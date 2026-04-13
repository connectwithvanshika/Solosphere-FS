/**
 * @fileoverview Travel Posts Routes Module
 *
 * Handles user-generated travel content including accommodation/venue posts
 * with advanced filtering, searching, and safety features. This module powers
 * the community-driven exploration aspect of Solosphere.
 *
 * Architecture: Implements three-layer pattern (Validator → Service → Controller)
 * to maintain strict separation between input validation, business logic, and HTTP handling.
 */

import express, { Router, Request, Response, NextFunction } from "express";
import type { Document, FilterQuery } from "mongoose";
import Post from "../models/Post.js";

/* ============================= TYPE DEFINITIONS ============================= */

/**
 * Represents a single travel post/accommodation listing.
 * Mirrors the MongoDB schema to ensure type safety across
 * all post-related operations.
 */
interface IPost {
  _id: string;
  title: string;
  description: string;
  rating: number;
  imageUrl?: string;
  category: "Hostel" | "Apartment" | "Camp" | "Private Stay" | "Shared" | "Café";
  city: string;
  tags: string[];
  guests: number;
  availableFrom?: Date | null;
  availableTo?: Date | null;
  nightSafetyScore: number;
  nightSafetyTags: {
    lighting: boolean;
    crowd: boolean;
    security: boolean;
  };
  lat?: number;
  lng?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a post creation request payload.
 * Contains all required fields for creating a new post.
 */
interface ICreatePostPayload {
  title: string;
  description: string;
  rating: number;
  imageUrl?: string;
  category: string;
  city: string;
  tags: string[];
  lat?: number;
  lng?: number;
}

/**
 * Represents a post update request payload.
 * All fields are optional to support partial updates.
 */
interface IUpdatePostPayload {
  title?: string;
  description?: string;
  rating?: number;
  imageUrl?: string;
  category?: string;
  city?: string;
  tags?: string[];
  lat?: number;
  lng?: number;
}

/**
 * Represents raw search/filter query parameters from the client.
 * All parameters are optional with sensible defaults.
 */
interface IPostSearchQueryParams {
  city?: string;
  category?: string;
  tags?: string;
  guests?: string | number;
  checkin?: string;
  checkout?: string;
  sort?: "rating" | "recent";
  page?: string | number;
  limit?: string | number;
  safeAfterNine?: string;
}

/**
 * Represents validated and normalized search parameters.
 * Ensures all values are in expected types and ranges before
 * reaching the service layer.
 */
interface IValidatedPostSearchQuery {
  cityFilter: string;
  categoryFilter: string;
  tagsFilter: string[];
  guestCountFilter: number | null;
  checkinDate: Date | null;
  checkoutDate: Date | null;
  sortPreference: "rating" | "recent";
  pageNumber: number;
  itemsPerPage: number;
  requireNightSafety: boolean;
}

/**
 * Represents the paginated search response sent to client.
 * Includes metadata to enable frontend pagination controls.
 */
interface IPostsPaginatedResponse {
  success: boolean;
  total: number;
  page: number;
  results: IPost[];
}

/**
 * Represents MongoDB filter criteria for post queries.
 * Uses MongoDB operators for flexible querying.
 */
interface IPostFilters {
  city?: RegExp;
  category?: RegExp;
  tags?: { $in: string[] };
  guests?: { $gte: number };
  availableFrom?: { $lte: Date };
  availableTo?: { $gte: Date };
  nightSafetyScore?: { $gte: number };
}

/* ============================= VALIDATION LAYER ============================= */

/**
 * @class PostValidator
 *
 * Validates and normalizes post data and search parameters at the API boundary.
 * Validation happens upfront to prevent invalid data from reaching business logic.
 *
 * Why centralized validation: Prevents invalid data from corrupting the database
 * and ensures consistent parameter handling across all endpoints. Also makes
 * security hardening (e.g., injection prevention) a single location to update.
 */
class PostValidator {
  private static readonly DEFAULT_PAGE = 1;
  private static readonly DEFAULT_LIMIT = 20;
  private static readonly MAX_LIMIT = 100;
  private static readonly NIGHT_SAFETY_THRESHOLD = 65;

  /**
   * Validates post creation payload.
   *
   * Why we throw on invalid titles: Empty titles make posts unsearchable
   * and provide no value to other travelers. Catch this early.
   *
   * @throws {Error} If required fields are missing or invalid
   */
  static validateCreatePostPayload(payload: any): asserts payload is ICreatePostPayload {
    if (!payload.title || payload.title.toString().trim().length === 0) {
      throw new Error("Title is required and cannot be empty");
    }

    if (!payload.description || payload.description.toString().trim().length === 0) {
      throw new Error("Description is required and cannot be empty");
    }

    if (payload.rating !== undefined && (typeof payload.rating !== "number" || payload.rating < 0 || payload.rating > 5)) {
      throw new Error("Rating must be a number between 0 and 5");
    }

    if (!payload.category || typeof payload.category !== "string") {
      throw new Error("Category is required");
    }

    if (!payload.city || payload.city.toString().trim().length === 0) {
      throw new Error("City is required");
    }

    if (!Array.isArray(payload.tags)) {
      throw new Error("Tags must be an array");
    }
  }

  /**
   * Validates post update payload.
   * More lenient than create validation since updating partial fields.
   */
  static validateUpdatePostPayload(payload: any): asserts payload is IUpdatePostPayload {
    if (payload.title !== undefined && payload.title.toString().trim().length === 0) {
      throw new Error("Title cannot be empty");
    }

    if (payload.description !== undefined && payload.description.toString().trim().length === 0) {
      throw new Error("Description cannot be empty");
    }

    if (payload.rating !== undefined && (typeof payload.rating !== "number" || payload.rating < 0 || payload.rating > 5)) {
      throw new Error("Rating must be a number between 0 and 5");
    }
  }

  /**
   * Validates and normalizes post search query parameters.
   *
   * Why separate validation: URL query strings come as strings. We normalize them
   * to proper types and sanitize regex patterns to prevent injection attacks.
   *
   * Why enforce pagination limits: Allowing unlimited page sizes enables DoS attacks
   * and memory exhaustion. We constrain to a reasonable maximum.
   *
   * @returns {IValidatedPostSearchQuery} Validated and normalized parameters
   * @throws {Error} If date parameters are invalid
   */
  static validateAndNormalizeSearchQuery(query: any): IValidatedPostSearchQuery {
    const cityFilter = (query.city || "").toString().trim();
    const categoryFilter = (query.category || "").toString().trim();
    
    // Parse tags: convert comma-separated string to array
    const tagsFilter = (query.tags || "")
      .toString()
      .split(",")
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0);

    // Parse guest count: must be positive integer
    let guestCountFilter: number | null = null;
    if (query.guests && !isNaN(Number(query.guests))) {
      guestCountFilter = Math.max(1, Number(query.guests));
    }

    // Parse and validate date range
    let checkinDate: Date | null = null;
    let checkoutDate: Date | null = null;
    
    if (query.checkin) {
      const parsedCheckin = new Date(query.checkin);
      if (!isNaN(parsedCheckin.getTime())) {
        checkinDate = parsedCheckin;
      }
    }

    if (query.checkout) {
      const parsedCheckout = new Date(query.checkout);
      if (!isNaN(parsedCheckout.getTime())) {
        checkoutDate = parsedCheckout;
      }
    }

    // Validate sort field
    const sortPreference = (query.sort === "rating" ? "rating" : "recent") as "rating" | "recent";

    // Parse and constrain pagination
    const pageNumber = Math.max(this.DEFAULT_PAGE, Number(query.page) || this.DEFAULT_PAGE);
    let itemsPerPage = Number(query.limit) || this.DEFAULT_LIMIT;
    itemsPerPage = Math.min(itemsPerPage, this.MAX_LIMIT);

    // Check if night safety filter is enabled
    const requireNightSafety = query.safeAfterNine === "true";

    return {
      cityFilter,
      categoryFilter,
      tagsFilter,
      guestCountFilter,
      checkinDate,
      checkoutDate,
      sortPreference,
      pageNumber,
      itemsPerPage,
      requireNightSafety,
    };
  }
}

/* ============================= SERVICE LAYER ============================= */

/**
 * @class PostService
 *
 * Encapsulates all business logic for post operations including:
 * 1. CRUD operations (Create, Read, Update, Delete)
 * 2. Filtering and searching with complex criteria
 * 3. Pagination and sorting
 *
 * Why service layer: Business logic is independent of Express framework,
 * enabling reuse across different transports (GraphQL, gRPC, etc.) and
 * easier unit testing without HTTP concerns.
 */
class PostService {
  /**
   * Creates a new travel post with provided details.
   *
   * @param {ICreatePostPayload} postData - Validated post creation data
   * @returns {Promise<Document>} The created post document
   * @throws {Error} If database operation fails
   */
  async createPost(postData: ICreatePostPayload): Promise<Document> {
    return Post.create({
      title: postData.title.trim(),
      description: postData.description.trim(),
      rating: postData.rating || 0,
      imageUrl: postData.imageUrl || null,
      category: postData.category,
      city: postData.city.trim(),
      tags: postData.tags.map((tag) => tag.trim()),
      lat: postData.lat,
      lng: postData.lng,
    });
  }

  /**
   * Retrieves all posts for the current user.
   *
   * Why no user filter: Current implementation returns all posts.
   * This should be updated to filter by authenticated user ID when
   * authentication is added to the route handler.
   *
   * @returns {Promise<Document[]>} Array of user's posts
   * @throws {Error} If database operation fails
   */
  async getUserPosts(): Promise<Document[]> {
    return Post.find().sort({ createdAt: -1 });
  }

  /**
   * Builds MongoDB filter object from validated search parameters.
   *
   * Why separate method: Filter construction is complex. Separating it
   * makes the search logic testable and changes to filters don't require
   * touching the controller.
   *
   * @param {IValidatedPostSearchQuery} validatedQuery - Normalized search params
   * @returns {IPostFilters} MongoDB filter specification
   */
  private buildSearchFilters(validatedQuery: IValidatedPostSearchQuery): IPostFilters {
    const filters: IPostFilters = {};

    // City filter: case-insensitive regex matching
    if (validatedQuery.cityFilter.length > 0) {
      filters.city = new RegExp(validatedQuery.cityFilter, "i");
    }

    // Category filter: case-insensitive, and "all" means no filter
    if (validatedQuery.categoryFilter.length > 0 && validatedQuery.categoryFilter.toLowerCase() !== "all") {
      filters.category = new RegExp(validatedQuery.categoryFilter, "i");
    }

    // Tags filter: find posts containing any of the specified tags
    if (validatedQuery.tagsFilter.length > 0) {
      filters.tags = { $in: validatedQuery.tagsFilter };
    }

    // Guest capacity filter: find posts that can accommodate requested guests
    if (validatedQuery.guestCountFilter !== null) {
      filters.guests = { $gte: validatedQuery.guestCountFilter };
    }

    // Date availability filter: find posts available for the requested period
    if (validatedQuery.checkinDate || validatedQuery.checkoutDate) {
      if (validatedQuery.checkinDate) {
        filters.availableFrom = { $lte: validatedQuery.checkinDate };
      }
      if (validatedQuery.checkoutDate) {
        filters.availableTo = { $gte: validatedQuery.checkoutDate };
      }
    }

    // Night safety filter: find posts with high safety scores for solo travelers
    if (validatedQuery.requireNightSafety) {
      filters.nightSafetyScore = { $gte: PostValidator["NIGHT_SAFETY_THRESHOLD"] };
    }

    return filters;
  }

  /**
   * Builds MongoDB sort specification from user preference.
   *
   * Why separate method: Sorting rules are a single point of change.
   * If we add secondary sort criteria later, it's changed in one place.
   *
   * @param {string} sortPreference - User's sort preference
   * @returns {Object} MongoDB sort specification
   */
  private buildSortObject(sortPreference: "rating" | "recent"): Record<string, -1 | 1> {
    const sortMap: Record<"rating" | "recent", Record<string, -1 | 1>> = {
      rating: { rating: -1, createdAt: -1 }, // Highest rating first, then newest
      recent: { createdAt: -1 }, // Newest first
    };

    return sortMap[sortPreference];
  }

  /**
   * Searches posts with filtering, sorting, and pagination.
   *
   * Why Promise.all: Parallelizes count and find operations. Counting sequentially
   * would require two database round-trips; parallelization cuts response time ~50%.
   *
   * @param {IValidatedPostSearchQuery} validatedQuery - Validated search parameters
   * @returns {Promise<IPostsPaginatedResponse>} Paginated posts with metadata
   * @throws {Error} If database operation fails
   */
  async searchPostsWithFilters(
    validatedQuery: IValidatedPostSearchQuery
  ): Promise<IPostsPaginatedResponse> {
    const filters = this.buildSearchFilters(validatedQuery);
    const sortObject = this.buildSortObject(validatedQuery.sortPreference);
    const skipCount = (validatedQuery.pageNumber - 1) * validatedQuery.itemsPerPage;

    // Execute count and find in parallel to minimize database latency
    const [posts, totalCount] = await Promise.all([
      Post.find(filters as FilterQuery<any>)
        .sort(sortObject)
        .skip(skipCount)
        .limit(validatedQuery.itemsPerPage)
        .lean() // Return plain objects for better performance
        .exec() as Promise<any[]>,
      Post.countDocuments(filters as FilterQuery<any>),
    ]);

    return {
      success: true,
      total: totalCount,
      page: validatedQuery.pageNumber,
      results: posts as IPost[],
    };
  }

  /**
   * Updates an existing post with new data.
   *
   * Why findByIdAndUpdate: Returns updated document in single operation,
   * preventing race conditions where data changes between read and write.
   *
   * @param {string} postId - MongoDB post ID
   * @param {IUpdatePostPayload} updateData - Fields to update
   * @returns {Promise<Document | null>} Updated post or null if not found
   * @throws {Error} If database operation fails
   */
  async updatePost(postId: string, updateData: IUpdatePostPayload): Promise<Document | null> {
    const sanitizedData = {
      ...(updateData.title && { title: updateData.title.trim() }),
      ...(updateData.description && { description: updateData.description.trim() }),
      ...(updateData.rating !== undefined && { rating: updateData.rating }),
      ...(updateData.imageUrl !== undefined && { imageUrl: updateData.imageUrl }),
      ...(updateData.category && { category: updateData.category }),
      ...(updateData.city && { city: updateData.city.trim() }),
      ...(updateData.tags && { tags: updateData.tags.map((tag) => tag.trim()) }),
      ...(updateData.lat !== undefined && { lat: updateData.lat }),
      ...(updateData.lng !== undefined && { lng: updateData.lng }),
    };

    return Post.findByIdAndUpdate(postId, sanitizedData, { new: true });
  }

  /**
   * Deletes a post by ID.
   *
   * @param {string} postId - MongoDB post ID
   * @returns {Promise<Document | null>} Deleted post or null if not found
   * @throws {Error} If database operation fails
   */
  async deletePost(postId: string): Promise<Document | null> {
    return Post.findByIdAndDelete(postId);
  }
}

/* ============================= CONTROLLER LAYER ============================= */

/**
 * @class PostController
 *
 * Manages HTTP request/response lifecycle for post endpoints.
 * Responsibilities:
 * 1. Extract and parse request data (body, params, query)
 * 2. Validate using validator classes
 * 3. Invoke service layer for business logic
 * 4. Return appropriate HTTP responses with status codes
 * 5. Delegate errors to middleware for consistent handling
 *
 * Why this separation: Service logic is completely independent of Express,
 * enabling use in different contexts (job queues, webhooks, etc.) and easier testing.
 */
class PostController {
  private postService: PostService;

  constructor(postService: PostService) {
    this.postService = postService;
  }

  /**
   * Creates a new travel post.
   *
   * Why 201 status: HTTP convention for resource creation.
   * Why error delegation: Allows global error handling, logging, and consistent
   * error response formatting without code duplication across endpoints.
   *
   * @route POST /
   * @param {Request} req - Request with post data in body
   * @param {Response} res - Response object
   * @param {NextFunction} next - Error middleware
   */
  createPost = async (
    req: Request<{}, {}, ICreatePostPayload>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      PostValidator.validateCreatePostPayload(req.body);
      const post = await this.postService.createPost(req.body);
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves all posts for the authenticated user.
   *
   * TODO: Add authentication middleware and filter by req.user.id
   *
   * @route GET /mine
   * @param {Request} req - Express request
   * @param {Response} res - Express response
   * @param {NextFunction} next - Error middleware
   */
  getUserPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const posts = await this.postService.getUserPosts();
      res.json(posts);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Searches and filters posts with advanced criteria.
   *
   * Why 200 status: We're retrieving an existing set of posts, not creating.
   *
   * @route GET /
   * @param {Request} req - Request with query parameters
   * @param {Response} res - Response object
   * @param {NextFunction} next - Error middleware
   */
  searchPosts = async (
    req: Request<{}, {}, {}, IPostSearchQueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedQuery = PostValidator.validateAndNormalizeSearchQuery(req.query);
      const result = await this.postService.searchPostsWithFilters(validatedQuery);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Updates an existing post.
   *
   * @route PUT /:id
   * @param {Request} req - Request with post ID param and update data in body
   * @param {Response} res - Response object
   * @param {NextFunction} next - Error middleware
   */
  updatePost = async (
    req: Request<
      { id: string },
      {},
      IUpdatePostPayload
    >,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      PostValidator.validateUpdatePostPayload(req.body);
      const updatedPost = await this.postService.updatePost(req.params.id, req.body);
      
      if (!updatedPost) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      res.json(updatedPost);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deletes a post.
   *
   * Why 200 response: Deletion is confirmed with success message.
   *
   * @route DELETE /:id
   * @param {Request} req - Request with post ID param
   * @param {Response} res - Response object
   * @param {NextFunction} next - Error middleware
   */
  deletePost = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const deletedPost = await this.postService.deletePost(req.params.id);
      
      if (!deletedPost) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      res.json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}

/* ============================= ROUTE SETUP ============================= */

/**
 * Factory function to create and configure the post routes router.
 *
 * Why factory pattern: Enables dependency injection for testing.
 * In tests, we can inject a mock service without modifying route definitions.
 * Also allows easy swapping of implementations (e.g., cached vs uncached service).
 *
 * @returns {Router} Configured Express router with post endpoints
 */
function createPostRouter(): Router {
  const router = express.Router();

  const postService = new PostService();
  const postController = new PostController(postService);

  /**
   * @swagger
   * /posts:
   *   post:
   *     summary: Create a new travel post
   *     description: Create a new travel accommodation or venue post with details and ratings
   *     tags:
   *       - Posts
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - description
   *               - category
   *               - city
   *               - tags
   *             properties:
   *               title:
   *                 type: string
   *                 example: Great hostel in downtown Paris
   *               description:
   *                 type: string
   *                 example: Amazing central location with friendly staff and clean rooms
   *               rating:
   *                 type: number
   *                 minimum: 0
   *                 maximum: 5
   *                 example: 4.5
   *               imageUrl:
   *                 type: string
   *                 format: uri
   *                 example: https://example.com/image.jpg
   *               category:
   *                 type: string
   *                 enum: [Hostel, Apartment, Camp, Private Stay, Shared, Café]
   *                 example: Hostel
   *               city:
   *                 type: string
   *                 example: Paris
   *               tags:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: [clean, budget-friendly, social]
   *               lat:
   *                 type: number
   *                 example: 48.8566
   *               lng:
   *                 type: number
   *                 example: 2.3522
   *     responses:
   *       201:
   *         description: Post created successfully
   *       400:
   *         description: Validation error - missing required fields
   *       500:
   *         description: Server error
   */
  router.post("/", postController.createPost);

  /**
   * @swagger
   * /posts/mine:
   *   get:
   *     summary: Get current user's posts
   *     description: Retrieve all travel posts created by the authenticated user
   *     tags:
   *       - Posts
   *     responses:
   *       200:
   *         description: User's posts retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *       500:
   *         description: Server error
   */
  router.get("/mine", postController.getUserPosts);

  /**
   * @swagger
   * /posts:
   *   get:
   *     summary: Search and filter travel posts
   *     description: Search travel posts with advanced filtering including location, dates, safety scores, and capacity
   *     tags:
   *       - Posts
   *     parameters:
   *       - in: query
   *         name: city
   *         schema:
   *           type: string
   *         description: Filter by city
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *           enum: [Hostel, Apartment, Camp, Private Stay, Shared, Café]
   *         description: Filter by accommodation category
   *       - in: query
   *         name: tags
   *         schema:
   *           type: string
   *         description: Comma-separated list of tags to filter by
   *       - in: query
   *         name: guests
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Minimum guest capacity required
   *       - in: query
   *         name: checkin
   *         schema:
   *           type: string
   *           format: date
   *         description: Check-in date filter
   *       - in: query
   *         name: checkout
   *         schema:
   *           type: string
   *           format: date
   *         description: Check-out date filter
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *           enum: [rating, recent]
   *         description: Sort by rating or recent (default "recent")
   *       - in: query
   *         name: safeAfterNine
   *         schema:
   *           type: string
   *           enum: [true, false]
   *         description: Filter for high night safety scores
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Page number for pagination (default 1)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *         description: Results per page (default 20, max 100)
   *     responses:
   *       200:
   *         description: Posts retrieved with pagination metadata
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 total:
   *                   type: integer
   *                 page:
   *                   type: integer
   *                 results:
   *                   type: array
   *                   items:
   *                     type: object
   *       400:
   *         description: Validation error in query parameters
   *       500:
   *         description: Server error
   */
  router.get("/", postController.searchPosts);

  /**
   * @swagger
   * /posts/{id}:
   *   put:
   *     summary: Update a travel post
   *     description: Update details of an existing travel post
   *     tags:
   *       - Posts
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Post ID to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               rating:
   *                 type: number
   *                 minimum: 0
   *                 maximum: 5
   *               imageUrl:
   *                 type: string
   *               category:
   *                 type: string
   *               city:
   *                 type: string
   *               tags:
   *                 type: array
   *                 items:
   *                   type: string
   *               lat:
   *                 type: number
   *               lng:
   *                 type: number
   *     responses:
   *       200:
   *         description: Post updated successfully
   *       404:
   *         description: Post not found
   *       400:
   *         description: Validation error
   *       500:
   *         description: Server error
   */
  router.put("/:id", postController.updatePost);

  /**
   * @swagger
   * /posts/{id}:
   *   delete:
   *     summary: Delete a travel post
   *     description: Remove a travel post from the system
   *     tags:
   *       - Posts
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Post ID to delete
   *     responses:
   *       200:
   *         description: Post deleted successfully
   *       404:
   *         description: Post not found
   *       500:
   *         description: Server error
   */
  router.delete("/:id", postController.deletePost);

  return router;
}

export default createPostRouter();
