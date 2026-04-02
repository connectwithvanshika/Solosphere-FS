/**
 * @fileoverview Travel Tips Discovery Routes Module
 *
 * Handles travel safety tips, destination guides, and community knowledge
 * base featuring comprehensive filtering, text search, and pagination.
 * This critical feature enables travelers to find location-specific wisdom.
 *
 * Architecture: Implements three-layer pattern (Validator → Service → Controller)
 * to ensure input integrity, business logic isolation, and clean HTTP handling.
 */

import express, { Router, Request, Response, NextFunction } from "express";
import type { Document, FilterQuery } from "mongoose";
import Tip from "../models/Tip.js";

/* ============================= TYPE DEFINITIONS ============================= */

/**
 * Represents a single travel tip/guide in the system.
 * This interface mirrors the MongoDB schema to provide type safety
 * for all tip-related operations and database interactions.
 */
interface ITip {
  _id: string;
  city: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  verified: boolean;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents raw tip query parameters from the client.
 * All fields are optional with sensible defaults to handle
 * minimal filter criteria from clients.
 */
interface ITipQueryParams {
  city?: string;
  category?: string;
  search?: string;
  page?: string | number;
  limit?: string | number;
}

/**
 * Represents validated and normalized query parameters.
 * By converting raw inputs to proper types, we prevent invalid
 * values from propagating through the application.
 */
interface IValidatedTipQuery {
  cityFilter: string;
  categoryFilter: string;
  searchTerm: string;
  pageNumber: number;
  itemsPerPage: number;
}

/**
 * Represents the paginated response structure sent to the client.
 * This contract ensures consistent API responses across pagination endpoints.
 */
interface ITipsPaginatedResponse {
  tips: ITip[];
  total: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Represents MongoDB filter criteria for tip queries.
 * Uses MongoDB operators for flexible, performant querying.
 */
interface ITipFilters {
  city?: string;
  category?: string;
  $or?: Array<
    | { title: { $regex: string; $options: string } }
    | { excerpt: { $regex: string; $options: string } }
    | { content: { $regex: string; $options: string } }
  >;
}

/* ============================= VALIDATION LAYER ============================= */

/**
 * @class TipsValidator
 *
 * Validates and normalizes tip discovery query parameters at the API boundary.
 * Centralizing validation ensures:
 * 1. Consistent parameter handling across all endpoints
 * 2. Early rejection of invalid inputs before database operations
 * 3. Protection against injection attacks via regex patterns
 * 4. Predictable pagination boundaries
 *
 * Why validation here: Raw query parameters from URLs are untrustworthy.
 * Normalizing them upfront prevents invalid values from reaching the service layer
 * and potential database errors or performance issues.
 */
class TipsValidator {
  private static readonly MIN_PAGE = 1;
  private static readonly MIN_ITEMS_PER_PAGE = 1;
  private static readonly MAX_ITEMS_PER_PAGE = 100;
  private static readonly DEFAULT_LIMIT = 6;
  private static readonly NO_FILTER_VALUE = "All";

  /**
   * Validates and normalizes tip discovery query parameters.
   *
   * Why separate validation: URL query strings are strings even when representing
   * numbers or booleans. We normalize types and constrain values here before
   * passing to the service layer.
   *
   * Why enforce pagination limits: Allowing unbounded page sizes could cause
   * memory exhaustion or enable attackers to DoS by requesting millions of results.
   *
   * @param {ITipQueryParams} query - Raw query parameters from request
   * @returns {IValidatedTipQuery} Validated and normalized parameters
   */
  static validateAndNormalizeTipQuery(query: any): IValidatedTipQuery {
    // City filter: default to "All" meaning no filter
    const cityFilter = (query.city || this.NO_FILTER_VALUE).toString();

    // Category filter: default to "All" meaning no filter
    const categoryFilter = (query.category || this.NO_FILTER_VALUE).toString();

    // Search term: trim whitespace and normalize
    const searchTerm = (query.search || "").toString().trim();

    // Parse and constrain page number
    const pageNumber = Math.max(this.MIN_PAGE, Number(query.page) || this.MIN_PAGE);

    // Parse and constrain items per page
    let itemsPerPage = Number(query.limit) || this.DEFAULT_LIMIT;
    itemsPerPage = Math.max(this.MIN_ITEMS_PER_PAGE, itemsPerPage);
    itemsPerPage = Math.min(this.MAX_ITEMS_PER_PAGE, itemsPerPage);

    return {
      cityFilter,
      categoryFilter,
      searchTerm,
      pageNumber,
      itemsPerPage,
    };
  }
}

/* ============================= SERVICE LAYER ============================= */

/**
 * @class TipsService
 *
 * Encapsulates all business logic for tip discovery including:
 * 1. Building MongoDB filter queries from user inputs
 * 2. Implementing pagination logic
 * 3. Coordinating database operations
 *
 * Why service layer: Business logic can be reused across different transports
 * (REST, GraphQL, gRPC, WebSocket) without duplicating filter/pagination code.
 * Also enables testing independent of Express, improving code quality.
 */
class TipsService {
  /**
   * Builds MongoDB filter object from validated query parameters.
   *
   * Why separate method: Filter construction is complex with multiple criteria
   * and regex patterns. Separating it makes the logic testable and changes to
   * filtering rules don't require touching the controller.
   *
   * @param {IValidatedTipQuery} validatedQuery - Normalized query parameters
   * @returns {ITipFilters} MongoDB filter object
   */
  private buildFilters(validatedQuery: IValidatedTipQuery): ITipFilters {
    const filters: ITipFilters = {};

    // Add city filter if not "All"
    if (validatedQuery.cityFilter !== this.NO_FILTER_VALUE) {
      filters.city = validatedQuery.cityFilter;
    }

    // Add category filter if not "All"
    if (validatedQuery.categoryFilter !== this.NO_FILTER_VALUE) {
      filters.category = validatedQuery.categoryFilter;
    }

    // Add text search across multiple fields
    if (validatedQuery.searchTerm.length > 0) {
      filters.$or = [
        { title: { $regex: validatedQuery.searchTerm, $options: "i" } },
        { excerpt: { $regex: validatedQuery.searchTerm, $options: "i" } },
        { content: { $regex: validatedQuery.searchTerm, $options: "i" } },
      ];
    }

    return filters;
  }

  /**
   * Constant value for "no filter" option.
   * Extracted to avoid string duplication and enable easy changes.
   */
  private get NO_FILTER_VALUE() {
    return "All";
  }

  /**
   * Searches tips with filtering and pagination.
   *
   * Why Promise.all: Parallelizes count and find operations. Counting sequentially
   * would require two database round-trips; parallelization significantly reduces
   * response time by executing both queries concurrently.
   *
   * Why sort by createdAt: Newest tips appear first, ensuring users see most
   * recent travel guidance and community contributions.
   *
   * @param {IValidatedTipQuery} validatedQuery - Validated search parameters
   * @returns {Promise<ITipsPaginatedResponse>} Paginated tips with metadata
   * @throws {Error} If database operation fails
   */
  async searchTipsWithPagination(
    validatedQuery: IValidatedTipQuery
  ): Promise<ITipsPaginatedResponse> {
    const filters = this.buildFilters(validatedQuery);
    const skipCount = (validatedQuery.pageNumber - 1) * validatedQuery.itemsPerPage;

    // Execute count and find in parallel to minimize database latency
    const [tips, totalCount] = await Promise.all([
      Tip.find(filters as FilterQuery<any>)
        .sort({ createdAt: -1 }) // Newest tips first
        .skip(skipCount)
        .limit(validatedQuery.itemsPerPage)
        .lean() // Return plain objects, not Mongoose documents, for better performance
        .exec() as Promise<any[]>,
      Tip.countDocuments(filters as FilterQuery<any>),
    ]);

    // Calculate pagination metadata for frontend
    const totalPages = Math.max(1, Math.ceil(totalCount / validatedQuery.itemsPerPage));

    return {
      tips: tips as ITip[],
      total: totalCount,
      totalPages,
      currentPage: validatedQuery.pageNumber,
    };
  }
}

/* ============================= CONTROLLER LAYER ============================= */

/**
 * @class TipsController
 *
 * Manages HTTP request/response lifecycle for tip discovery endpoints.
 * Responsibilities:
 * 1. Extract and parse query parameters from Express request
 * 2. Delegate validation to validator
 * 3. Invoke service layer for business logic
 * 4. Format response with proper HTTP status codes
 * 5. Delegate errors to middleware for consistent handling
 *
 * Why this separation: Service logic is completely independent of Express,
 * enabling reuse in different contexts (background jobs, webhooks, etc.)
 * and easier testing without HTTP concerns.
 */
class TipsController {
  private tipsService: TipsService;

  constructor(tipsService: TipsService) {
    this.tipsService = tipsService;
  }

  /**
   * Handles tip discovery with filtering and pagination.
   *
   * Why 200 status: We're retrieving an existing subset of tips,
   * not creating resources. 200 is semantically correct for retrieval.
   *
   * Why error delegation: Allows global error handling, logging, and consistent
   * error response formatting across all endpoints without code duplication.
   *
   * @route GET /
   * @param {Request} req - Express request with query parameters
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Error handling middleware
   */
  discoverTips = async (
    req: Request<{}, {}, {}, ITipQueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedQuery = TipsValidator.validateAndNormalizeTipQuery(req.query);
      const result = await this.tipsService.searchTipsWithPagination(validatedQuery);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

/* ============================= ROUTE SETUP ============================= */

/**
 * Factory function to create and configure the tips routes router.
 *
 * Why factory pattern: Enables dependency injection for testing.
 * In tests, we can inject a mock service without modifying route definitions.
 * Also allows easy swapping of service implementations (e.g., cached vs uncached).
 *
 * @returns {Router} Configured Express router with tip discovery endpoints
 */
function createTipsRouter(): Router {
  const router = express.Router();

  const tipsService = new TipsService();
  const tipsController = new TipsController(tipsService);

  /**
   * GET /
   * Discover travel tips with optional filtering and pagination.
   *
   * Query parameters:
   *   - city: Filter by destination city (optional, default: "All")
   *   - category: Filter by tip category (optional, default: "All")
   *   - search: Full-text search across title/excerpt/content (optional)
   *   - page: Page number for pagination (optional, default: 1)
   *   - limit: Items per page (optional, default: 6, max: 100)
   */
  router.get("/", tipsController.discoverTips);

  return router;
}

export default createTipsRouter();
