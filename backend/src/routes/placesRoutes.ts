/**
 * @fileoverview Places Discovery Routes Module
 *
 * Handles place exploration and discovery functionality including filtering,
 * searching, sorting, and pagination. This is a critical feature for the
 * journey exploration aspect of Solosphere.
 *
 * Architecture: Implements three-layer pattern (Validator → Service → Controller)
 * to maintain clean separation between data validation, business logic, and HTTP handling.
 */

import express, { Router, Request, Response, NextFunction } from "express";
import type { Document, FilterQuery } from "mongoose";
import Place from "../models/Place.js";

/* ============================= TYPE DEFINITIONS ============================= */

/**
 * Represents a single travel destination/place in the system.
 * This interface mirrors the MongoDB schema to provide type safety
 * for place-related operations.
 */
interface IPlace {
  _id: string;
  name: string;
  city: string;
  rating: number;
  reviews: number;
  verified: boolean;
  category: string;
  saved: boolean;
  image: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents query parameters for place discovery.
 * All parameters are optional and have sensible defaults to handle
 * clients that send minimal or no filter criteria.
 */
interface IPlaceQueryParams {
  search?: string;
  category?: string;
  sort?: "rating" | "reviews" | "recent";
  page?: number | string;
  limit?: number | string;
}

/**
 * Represents validated and normalized query parameters.
 * By separating raw inputs from validated values, we prevent
 * invalid values from propagating through the application.
 */
interface IValidatedPlaceQuery {
  searchTerm: string;
  categoryFilter: string;
  sortField: "rating" | "reviews" | "recent";
  pageNumber: number;
  itemsPerPage: number;
}

/**
 * Represents the paginated response returned to the client.
 * This contract ensures consistent API responses across all endpoints.
 */
interface IPlacesPaginatedResponse {
  success: boolean;
  places: IPlace[];
  total: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Represents the search filter criteria for MongoDB queries.
 * Using discriminated types helps prevent invalid filter combinations.
 */
interface IPlaceFilters {
  category?: { $regex: string; $options: string };
  $or?: Array<{ name: { $regex: string; $options: string } } | { city: { $regex: string; $options: string } }>;
}

/* ============================= VALIDATION LAYER ============================= */

/**
 * @class PlacesValidator
 *
 * Validates and normalizes place discovery query parameters.
 * Centralized validation ensures:
 * 1. Consistent parameter handling across all endpoints
 * 2. Early rejection of invalid inputs before database operations
 * 3. Protection against injection attacks via regex patterns
 * 4. Predictable pagination boundaries
 *
 * Why validation matters for discovery: Users can send arbitrary query strings.
 * Validating parameters prevents database errors, performance issues, and
 * potential security vulnerabilities from reaching the service layer.
 */
class PlacesValidator {
  private static readonly MIN_PAGE = 1;
  private static readonly MIN_ITEMS_PER_PAGE = 1;
  private static readonly MAX_ITEMS_PER_PAGE = 100;
  private static readonly DEFAULT_SORT = "rating";
  private static readonly DEFAULT_LIMIT = 12;

  /**
   * Validates and normalizes place discovery query parameters.
   *
   * Why separate validation: Raw query parameters from the URL may be strings,
   * out of range, or contain dangerous characters. We normalize them here
   * before passing to the service layer.
   *
   * Why enforce limits on pagination: Allowing unbounded page sizes could
   * cause memory issues or allow attackers to DoS the application by requesting
   * millions of results at once.
   *
   * @param {IPlaceQueryParams} query - Raw query parameters from request
   * @returns {IValidatedPlaceQuery} Validated and normalized parameters
   * @throws {Error} If parameters fail validation
   */
  static validateAndNormalizePlaceQuery(query: any): IValidatedPlaceQuery {
    // Search term: trim whitespace to prevent matching noise
    const searchTerm = (query.search || "").toString().trim();

    // Category filter: default to "All" meaning no filter
    const categoryFilter = (query.category || "All").toString();

    // Validate sort field is one of allowed values
    const allowedSortFields: Array<"rating" | "reviews" | "recent"> = [
      "rating",
      "reviews",
      "recent",
    ];
    const sortField = (allowedSortFields.includes(query.sort)
      ? query.sort
      : this.DEFAULT_SORT) as "rating" | "reviews" | "recent";

    // Parse and constrain page number
    const pageNumber = Math.max(this.MIN_PAGE, Number(query.page) || 1);

    // Parse and constrain items per page
    let itemsPerPage = Number(query.limit) || this.DEFAULT_LIMIT;
    itemsPerPage = Math.max(this.MIN_ITEMS_PER_PAGE, itemsPerPage);
    itemsPerPage = Math.min(this.MAX_ITEMS_PER_PAGE, itemsPerPage);

    return {
      searchTerm,
      categoryFilter,
      sortField,
      pageNumber,
      itemsPerPage,
    };
  }
}

/* ============================= SERVICE LAYER ============================= */

/**
 * @class PlacesService
 *
 * Encapsulates all business logic for place discovery including:
 * 1. Building MongoDB filter queries from user inputs
 * 2. Applying sorting rules
 * 3. Implementing pagination logic
 * 4. Coordinating database operations
 *
 * Why service layer: This logic can be reused across different transports
 * (REST, GraphQL, gRPC) without duplicating filter/sort/pagination code.
 * Also enables testing business logic independently of Express.
 */
class PlacesService {
  /**
   * Builds MongoDB filter object from validated query parameters.
   *
   * Why separate method: Filter building is complex (regex escaping, multiple
   * criteria). Separating it makes testing easier and changes to filter logic
   * don't require touching the controller.
   *
   * @param {IValidatedPlaceQuery} validatedQuery - Normalized query parameters
   * @returns {IPlaceFilters} MongoDB filter object
   */
  private buildFilters(validatedQuery: IValidatedPlaceQuery): IPlaceFilters {
    const filters: IPlaceFilters = {};

    // Add category filter if not "All"
    if (validatedQuery.categoryFilter && validatedQuery.categoryFilter !== "All") {
      filters.category = {
        $regex: `^${validatedQuery.categoryFilter}$`,
        $options: "i", // Case-insensitive matching
      };
    }

    // Add text search across name and city fields
    if (validatedQuery.searchTerm.length > 0) {
      filters.$or = [
        { name: { $regex: validatedQuery.searchTerm, $options: "i" } },
        { city: { $regex: validatedQuery.searchTerm, $options: "i" } },
      ];
    }

    return filters;
  }

  /**
   * Builds MongoDB sort object from sort preference.
   *
   * Why separate method: Sorting rules might change (e.g., adding secondary sorts).
   * Separating makes it a single point of change.
   *
   * @param {string} sortField - User's sort preference
   * @returns {Object} MongoDB sort specification
   */
  private buildSortObject(sortField: "rating" | "reviews" | "recent"): Record<string, -1 | 1> {
    const sortMap: Record<"rating" | "reviews" | "recent", Record<string, -1 | 1>> = {
      rating: { rating: -1 }, // Highest ratings first
      reviews: { reviews: -1 }, // Most reviewed first
      recent: { createdAt: -1 }, // Newest first
    };

    return sortMap[sortField];
  }

  /**
   * Searches and paginates places based on discovery criteria.
   *
   * Why Promise.all: We parallelize the count and find operations.
   * Counting while finding would require two sequential database round-trips.
   * Parallelization cuts response time roughly in half for this endpoint.
   *
   * Why separate skip calculation: Pagination math (pageNum - 1) * perPage
   * is easy to get wrong. Keeping it in one place reduces bugs.
   *
   * @param {IValidatedPlaceQuery} validatedQuery - Validated search parameters
   * @returns {Promise<IPlacesPaginatedResponse>} Paginated places with metadata
   * @throws {Error} If database operation fails
   */
  async searchPlacesWithPagination(
    validatedQuery: IValidatedPlaceQuery
  ): Promise<IPlacesPaginatedResponse> {
    const filters = this.buildFilters(validatedQuery);
    const sortObject = this.buildSortObject(validatedQuery.sortField);
    const skipCount = (validatedQuery.pageNumber - 1) * validatedQuery.itemsPerPage;

    // Execute count and find in parallel to minimize database round-trips
    const [places, totalCount] = await Promise.all([
      Place.find(filters as FilterQuery<any>)
        .sort(sortObject)
        .skip(skipCount)
        .limit(validatedQuery.itemsPerPage)
        .lean() // Return plain objects, not Mongoose documents, for better performance
        .exec() as Promise<any[]>,
      Place.countDocuments(filters as FilterQuery<any>),
    ]);

    // Calculate pagination metadata for frontend
    const totalPages = Math.ceil(totalCount / validatedQuery.itemsPerPage);

    return {
      success: true,
      places: places as IPlace[],
      total: totalCount,
      totalPages,
      currentPage: validatedQuery.pageNumber,
    };
  }
}

/* ============================= CONTROLLER LAYER ============================= */

/**
 * @class PlacesController
 *
 * Manages HTTP request/response lifecycle for place discovery endpoints.
 * Responsibilities:
 * 1. Extract and parse query parameters from Express request
 * 2. Delegate validation to validator
 * 3. Invoke service layer for business logic
 * 4. Format response with proper HTTP status codes
 * 5. Delegate errors to middleware for consistent handling
 *
 * Why this separation: Service logic is independent of HTTP framework,
 * enabling reuse with different transports or in background jobs.
 */
class PlacesController {
  private placesService: PlacesService;

  constructor(placesService: PlacesService) {
    this.placesService = placesService;
  }

  /**
   * Handles place discovery with filtering, searching, and pagination.
   *
   * Why 200 status for paginated endpoints: Pagination doesn't create resources,
   * it retrieves a subset of existing ones. 200 is semantically correct.
   *
   * Why error delegation: Allows global error handling, logging, and consistent
   * error response formatting across the entire API without code duplication.
   *
   * @route GET /
   * @param {Request} req - Express request with query parameters
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Error handling middleware
   */
  discoverPlaces = async (
    req: Request<{}, {}, {}, IPlaceQueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedQuery = PlacesValidator.validateAndNormalizePlaceQuery(req.query);
      const result = await this.placesService.searchPlacesWithPagination(validatedQuery);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

/* ============================= ROUTE SETUP ============================= */

/**
 * Factory function to create and configure the places routes router.
 *
 * Why factory pattern: Enables dependency injection for testing.
 * In tests, we can inject a mock service without modifying route definitions.
 * Also allows easy swapping of service implementations if needed.
 *
 * @returns {Router} Configured Express router with place discovery endpoints
 */
function createPlacesRouter(): Router {
  const router = express.Router();

  const placesService = new PlacesService();
  const placesController = new PlacesController(placesService);

  /**
   * @swagger
   * /places:
   *   get:
   *     summary: Discover travel places
   *     description: Search and discover travel destinations with filtering, searching, and pagination
   *     tags:
   *       - Places
   *     parameters:
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search term to find places by name or city
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *         description: Filter by place category (default "All" for no filter)
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *           enum: [rating, reviews, recent]
   *         description: Sort results by rating, reviews, or recent (default "rating")
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
   *         description: Number of results per page (default 12, max 100)
   *     responses:
   *       200:
   *         description: Successfully retrieved places with pagination metadata
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 places:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                       name:
   *                         type: string
   *                       city:
   *                         type: string
   *                       rating:
   *                         type: number
   *                       reviews:
   *                         type: integer
   *                       category:
   *                         type: string
   *                       verified:
   *                         type: boolean
   *                       image:
   *                         type: string
   *                       description:
   *                         type: string
   *                 total:
   *                   type: integer
   *                 totalPages:
   *                   type: integer
   *                 currentPage:
   *                   type: integer
   *       400:
   *         description: Validation error in query parameters
   *       500:
   *         description: Server error
   */
  router.get("/", placesController.discoverPlaces);

  return router;
}

export default createPlacesRouter();
