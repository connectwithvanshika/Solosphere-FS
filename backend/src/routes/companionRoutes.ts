/**
 * @fileoverview Travel Companion Routes Module
 * 
 * This module handles all companion-matching related routes including travel plan management,
 * user matching, connection requests, and safety features (blocking/reporting).
 * 
 * Architecture: Uses class-based controller pattern with dependency injection to maintain
 * separation of concerns and enable easier testing and maintenance.
 */

import express, { Router, Request, Response, NextFunction } from "express";
import type { Document, Types } from "mongoose";
import TravelPlan from "../models/TravelPlan.js";
import ConnectionRequest from "../models/ConnectionRequest.js";
import Block from "../models/Block.js";
import Report from "../models/Report.js";
import User from "../models/User.js";

/* ============================= TYPE DEFINITIONS ============================= */

/**
 * Represents the structure of a travel plan request payload.
 * We use strict typing to catch errors at compile-time rather than runtime,
 * providing better IDE support and documentation.
 */
interface ITravelPlanPayload {
  userId: string;
  city: string;
  startDate: Date;
  endDate: Date;
  genderPreference: "female-only" | "all";
}

/**
 * Represents a user profile with minimal fields needed for companion matching.
 * Extracted to avoid exposing sensitive user data through the matching API.
 */
interface IUserProfileResponse {
  _id: string;
  name: string;
  gender: string;
  verified: boolean;
}

/**
 * Represents a travel plan with populated user information.
 * Used when returning match results to the frontend.
 */
interface IMatchResult {
  _id: string;
  userId: IUserProfileResponse;
  city: string;
  startDate: Date;
  endDate: Date;
  genderPreference: "female-only" | "all";
  isActive: boolean;
}

/**
 * Represents the structure of a connection request payload.
 * Kept minimal to enforce explicit intent - both sender and receiver must be specified.
 */
interface IConnectionRequestPayload {
  senderId: string;
  receiverId: string;
}

/**
 * Represents the response to a connection request.
 * Limited status options prevent invalid states at the API boundary.
 */
interface IConnectionResponsePayload {
  requestId: string;
  status: "accepted" | "declined";
}

/**
 * Represents a safety action (blocking or reporting a user).
 * Reason field is required for reports to help moderators understand incidents.
 */
interface ISafetyActionPayload {
  blockerId?: string;
  blockedUserId?: string;
  reporterId?: string;
  reportedUserId?: string;
  reason?: string;
}

/* ============================= VALIDATION LAYER ============================= */

/**
 * @class TravelCompanionValidator
 * 
 * Encapsulates validation logic to prevent invalid data from reaching database operations.
 * Validation happens at the boundary (API input) rather than scattered throughout handlers,
 * making it easier to audit and modify validation rules in one place.
 */
class TravelCompanionValidator {
  /**
   * Validates travel plan payload for required fields and valid date ranges.
   * We check date logic upfront to prevent invalid travel plans from being stored.
   * 
   * @throws {Error} If validation fails
   */
  static validateTravelPlanPayload(payload: any): asserts payload is ITravelPlanPayload {
    if (!payload.userId || !payload.city || !payload.startDate || !payload.endDate) {
      throw new Error("Missing required fields: userId, city, startDate, endDate");
    }

    const start = new Date(payload.startDate);
    const end = new Date(payload.endDate);

    // Reject plans where end date is before or equal to start date
    // This prevents nonsensical travel dates and reduces data quality issues
    if (end <= start) {
      throw new Error("End date must be after start date");
    }
  }

  /**
   * Validates connection request payload.
   * Prevents users from sending requests to themselves at the API level.
   * 
   * @throws {Error} If validation fails
   */
  static validateConnectionRequest(
    payload: any
  ): asserts payload is IConnectionRequestPayload {
    if (!payload.senderId || !payload.receiverId) {
      throw new Error("Both senderId and receiverId are required");
    }

    if (payload.senderId === payload.receiverId) {
      throw new Error("Cannot send connection request to yourself");
    }
  }

  /**
   * Validates blocking action.
   * Similar self-check as connection requests; users shouldn't be able to block themselves.
   * 
   * @throws {Error} If validation fails
   */
  static validateBlockAction(payload: any): void {
    if (!payload.blockerId || !payload.blockedUserId) {
      throw new Error("Both blockerId and blockedUserId are required");
    }

    if (payload.blockerId === payload.blockedUserId) {
      throw new Error("Cannot block yourself");
    }
  }

  /**
   * Validates report submission.
   * Reason field is mandatory to ensure reports contain actionable information for moderation.
   * 
   * @throws {Error} If validation fails
   */
  static validateReportAction(payload: any): void {
    if (!payload.reporterId || !payload.reportedUserId || !payload.reason) {
      throw new Error("reporterId, reportedUserId, and reason are required");
    }

    if (payload.reporterId === payload.reportedUserId) {
      throw new Error("Cannot report yourself");
    }

    // Require at least some meaningful report text to reduce noise reports
    if (payload.reason.trim().length < 10) {
      throw new Error("Report reason must be at least 10 characters");
    }
  }
}

/* ============================= SERVICE LAYER ============================= */

/**
 * @class TravelCompanionService
 * 
 * Encapsulates all business logic for travel companion matching.
 * This separation allows us to:
 * 1. Reuse logic across different endpoints (REST, GraphQL, WebSocket, etc.)
 * 2. Test business logic independently of HTTP concerns
 * 3. Mock database calls easily in tests
 * 4. Maintain a single source of truth for each feature
 */
class TravelCompanionService {
  /**
   * Creates or updates a user's travel plan.
   * We use upsert pattern to allow users to modify their existing plan without
   * checking beforehand, reducing the number of database queries.
   * 
   * @param {ITravelPlanPayload} planData - Travel plan details
   * @returns {Promise<Document>} The created or updated travel plan
   * @throws {Error} If database operation fails
   */
  async createOrUpdateTravelPlan(planData: ITravelPlanPayload): Promise<Document> {
    const existingPlan = await TravelPlan.findOne({ userId: planData.userId });

    if (existingPlan) {
      // User has existing plan - update it
      // We reactivate in case they had previously deactivated their plan
      existingPlan.city = planData.city;
      existingPlan.startDate = planData.startDate;
      existingPlan.endDate = planData.endDate;
      existingPlan.genderPreference = planData.genderPreference;
      existingPlan.isActive = true;
      await existingPlan.save();
      return existingPlan;
    }

    // New user - create fresh plan with defaults
    return TravelPlan.create(planData);
  }

  /**
   * Retrieves user's current travel plan if it exists.
   * Returns null instead of empty object to clearly indicate absence of plan.
   * 
   * @param {string} userId - MongoDB user ID
   * @returns {Promise<Document | null>} The travel plan or null
   * @throws {Error} If database operation fails
   */
  async getUserTravelPlan(userId: string): Promise<Document | null> {
    return TravelPlan.findOne({ userId });
  }

  /**
   * Finds compatible travel companions using multi-criteria matching.
   * 
   * Matching logic:
   * 1. Same city (case-insensitive for flexibility)
   * 2. Overlapping travel dates using interval logic
   * 3. Exclude blocked users to respect user safety preferences
   * 4. Only active plans to avoid stale matches
   * 
   * Date overlap check: StartA <= EndB AND StartB <= EndA
   * This mathematical approach handles all overlap scenarios correctly.
   * 
   * @param {string} userId - The user seeking matches
   * @returns {Promise<any[]>} Array of compatible travel plans
   * @throws {Error} If database operation fails
   */
  async findCompatibleMatches(userId: string): Promise<any[]> {
    // Fetch user's plan to ensure they have one and can see matches
    const userPlan = await TravelPlan.findOne({ userId });

    // Return empty array for users without active plans
    // This prevents anonymous users from appearing in searches
    if (!userPlan || !userPlan.isActive) {
      return [];
    }

    // Retrieve all users this person has blocked to exclude them from results
    // We fetch only IDs to minimize memory footprint for users with many blocks
    const blockedRecords = await Block.find({ blockerId: userId }).select(
      "blockedUserId"
    );
    const blockedUserIds = blockedRecords.map((record) => record.blockedUserId);

    // Build query with all matching criteria
    // Using RegExp for city to handle "Paris", "PARIS", "paris" identically
    const matchingPlans = await TravelPlan.find({
      userId: {
        $ne: userId, // Exclude self to prevent matching with own plan
        $nin: blockedUserIds, // Exclude blocked users for safety
      },
      city: new RegExp(userPlan.city, "i"), // Case-insensitive city match
      // Date range overlap: plan starts before user ends AND plan ends after user starts
      startDate: { $lte: userPlan.endDate },
      endDate: { $gte: userPlan.startDate },
      isActive: true, // Only show active plans to avoid matching with inactive users
    }).populate("userId", "name gender verified"); // Include minimal user info

    return matchingPlans;
  }

  /**
   * Sends a new connection request between two users.
   * 
   * We check for existing requests to prevent duplicates. This could result from:
   * 1. User clicking send multiple times quickly
   * 2. Browser retry on network failure
   * 3. Race condition with other requests
   * 
   * @param {IConnectionRequestPayload} requestData - Sender and receiver IDs
   * @returns {Promise<Document>} The created connection request
   * @throws {Error} If request already exists or database operation fails
   */
  async sendConnectionRequest(
    requestData: IConnectionRequestPayload
  ): Promise<Document> {
    // Check if request already exists to prevent duplicates
    // Duplicate requests waste storage and confuse users
    const existingRequest = await ConnectionRequest.findOne({
      senderId: requestData.senderId,
      receiverId: requestData.receiverId,
    });

    if (existingRequest) {
      throw new Error("Connection request already sent to this user");
    }

    // Create new request in pending status - receiver will accept/decline later
    return ConnectionRequest.create(requestData);
  }

  /**
   * Handles accepting or declining a connection request.
   * 
   * We update status atomically to ensure state is never invalid.
   * MongoDB's findByIdAndUpdate with `new: true` returns updated document
   * in a single operation, preventing race conditions.
   * 
   * @param {string} requestId - MongoDB connection request ID
   * @param {string} status - New status: 'accepted' or 'declined'
   * @returns {Promise<Document>} The updated connection request
   * @throws {Error} If request not found or database operation fails
   */
  async respondToConnectionRequest(
    requestId: string,
    status: "accepted" | "declined"
  ): Promise<Document> {
    const updatedRequest = await ConnectionRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true } // Return updated document
    );

    if (!updatedRequest) {
      throw new Error("Connection request not found");
    }

    return updatedRequest;
  }

  /**
   * Retrieves all pending connection requests received by a user.
   * 
   * We filter for pending status only to exclude past requests that have
   * already been responded to. Populating sender info helps frontend
   * display who sent each request.
   * 
   * @param {string} userId - The receiver's ID
   * @returns {Promise<Document[]>} Array of pending connection requests
   * @throws {Error} If database operation fails
   */
  async getUserPendingRequests(userId: string): Promise<Document[]> {
    return ConnectionRequest.find({
      receiverId: userId,
      status: "pending", // Only show unresponded requests
    }).populate("senderId", "name gender verified");
  }

  /**
   * Blocks another user from seeing the current user in matches or sending requests.
   * 
   * This is a unidirectional relationship: blocking someone doesn't prevent them
   * from seeing you, it only removes them from your results. This design choice
   * prevents revealing to bad actors that they've been blocked (security through obscurity).
   * 
   * @param {string} blockerId - ID of user doing the blocking
   * @param {string} blockedUserId - ID of user being blocked
   * @returns {Promise<void>}
   * @throws {Error} If database operation fails
   */
  async blockUser(blockerId: string, blockedUserId: string): Promise<void> {
    // Check if already blocked to prevent duplicate records
    const existingBlock = await Block.findOne({ blockerId, blockedUserId });
    if (!existingBlock) {
      await Block.create({ blockerId, blockedUserId });
    }
  }

  /**
   * Submits a user report for moderation review.
   * 
   * Reports are immutable once created to maintain an audit trail.
   * Moderators can use these reports to identify abusive users and take action.
   * 
   * @param {string} reporterId - ID of user filing the report
   * @param {string} reportedUserId - ID of reported user
   * @param {string} reason - Details of why user is being reported
   * @returns {Promise<void>}
   * @throws {Error} If database operation fails
   */
  async reportUser(
    reporterId: string,
    reportedUserId: string,
    reason: string
  ): Promise<void> {
    await Report.create({ reporterId, reportedUserId, reason });
  }
}

/* ============================= CONTROLLER LAYER ============================= */

/**
 * @class TravelCompanionController
 * 
 * Handles HTTP request/response lifecycle for companion-related endpoints.
 * Responsibilities:
 * 1. Parse and validate incoming requests
 * 2. Call appropriate service methods
 * 3. Format responses with proper status codes
 * 4. Handle errors consistently
 * 
 * This separation allows service logic to be completely independent of Express,
 * making it testable and reusable across different transports (REST, gRPC, etc.)
 */
class TravelCompanionController {
  private companionService: TravelCompanionService;

  constructor(companionService: TravelCompanionService) {
    this.companionService = companionService;
  }

  /**
   * Creates or updates the authenticated user's travel plan.
   * Returns 200 instead of 201 because this is often an update operation.
   * 
   * @route POST /plans
   * @param {Request<{}, {}, ITravelPlanPayload>} req - Express request with travel plan data
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Error handling middleware
   */
  createOrUpdatePlan = async (
    req: Request<{}, {}, ITravelPlanPayload>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      TravelCompanionValidator.validateTravelPlanPayload(req.body);
      const plan = await this.companionService.createOrUpdateTravelPlan(req.body);
      res.status(200).json({ success: true, plan });
    } catch (error) {
      next(error); // Delegate to error middleware
    }
  };

  /**
   * Retrieves authenticated user's current travel plan.
   * 
   * @route GET /plans/:userId
   * @param {Request<{ userId: string }>} req - Request with user ID parameter
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Error handling middleware
   */
  getPlan = async (
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const plan = await this.companionService.getUserTravelPlan(req.params.userId);
      res.json(plan);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Finds potential travel companions who match the user's travel criteria.
   * This is the core matching endpoint that powers the companion discovery feature.
   * 
   * @route GET /matches/:userId
   * @param {Request<{ userId: string }>} req - Request with user ID
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Error handling middleware
   */
  getMatches = async (
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const matches = await this.companionService.findCompatibleMatches(
        req.params.userId
      );
      res.json(matches);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Sends a connection request to a potential companion.
   * Response code 201 indicates a new resource was created.
   * 
   * @route POST /connect/request
   * @param {Request<{}, {}, IConnectionRequestPayload>} req - Sender and receiver IDs
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Error handling middleware
   */
  sendRequest = async (
    req: Request<{}, {}, IConnectionRequestPayload>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      TravelCompanionValidator.validateConnectionRequest(req.body);
      const request = await this.companionService.sendConnectionRequest(req.body);
      res.status(201).json(request);
    } catch (error) {
      // If duplicate request exists, market as 400 Bad Request
      if (error instanceof Error && error.message.includes("already sent")) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        next(error);
      }
    }
  };

  /**
   * Accepts or declines a pending connection request.
   * 
   * @route PATCH /connect/respond
   * @param {Request<{}, {}, IConnectionResponsePayload>} req - Request ID and response status
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Error handling middleware
   */
  respondToRequest = async (
    req: Request<{}, {}, IConnectionResponsePayload>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { requestId, status } = req.body;
      const updatedRequest = await this.companionService.respondToConnectionRequest(
        requestId,
        status
      );
      res.json(updatedRequest);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves all pending connection requests sent to the authenticated user.
   * Only includes requests that haven't been responded to yet.
   * 
   * @route GET /connect/requests/:userId
   * @param {Request<{ userId: string }>} req - Receiver's user ID
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Error handling middleware
   */
  getPendingRequests = async (
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const requests = await this.companionService.getUserPendingRequests(
        req.params.userId
      );
      res.json(requests);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Blocks a user from appearing in the authenticated user's matches.
   * Returns 200 to indicate the operation completed successfully.
   * 
   * @route POST /block
   * @param {Request<{}, {}, ISafetyActionPayload>} req - Blocker and blocked user IDs
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Error handling middleware
   */
  blockUser = async (
    req: Request<{}, {}, ISafetyActionPayload>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      TravelCompanionValidator.validateBlockAction(req.body);
      const { blockerId, blockedUserId } = req.body;
      await this.companionService.blockUser(blockerId!, blockedUserId!);
      res.json({ success: true, message: "User blocked successfully" });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Files a report against a user for violating community guidelines.
   * Reports are submitted to moderators for review and action.
   * 
   * @route POST /report
   * @param {Request<{}, {}, ISafetyActionPayload>} req - Reporter, reported user, and reason
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Error handling middleware
   */
  reportUser = async (
    req: Request<{}, {}, ISafetyActionPayload>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      TravelCompanionValidator.validateReportAction(req.body);
      const { reporterId, reportedUserId, reason } = req.body;
      await this.companionService.reportUser(reporterId!, reportedUserId!, reason!);
      res.json({ success: true, message: "Report submitted successfully" });
    } catch (error) {
      next(error);
    }
  };
}

/* ============================= ROUTE SETUP ============================= */

/**
 * Factory function to create and configure the companion routes router.
 * Using a factory pattern allows for dependency injection, making it easy to swap
 * service implementations (e.g., for testing with mocks).
 * 
 * @returns {Router} Configured Express router with all companion endpoints
 */
function createCompanionRouter(): Router {
  const router = express.Router();

  // Instantiate service and controller with dependency injection
  // This enables testing by injecting mocks
  const companionService = new TravelCompanionService();
  const companionController = new TravelCompanionController(companionService);

  // ==================== TRAVEL PLANS ====================
  /**
   * Create or update authenticated user's travel plan.
   * Used when user wants to participate in companion matching.
   */
  router.post("/plans", companionController.createOrUpdatePlan);

  /**
   * Retrieve a specific user's travel plan.
   * Used to view travel details of a match candidate.
   */
  router.get("/plans/:userId", companionController.getPlan);

  // ==================== MATCHING ====================
  /**
   * Get all potential travel companions matching current user's criteria.
   * Core endpoint for the companion discovery feature.
   */
  router.get("/matches/:userId", companionController.getMatches);

  // ==================== CONNECTIONS ====================
  /**
   * Send a connection request to a matched user.
   * Initiates communication flow between potential companions.
   */
  router.post("/connect/request", companionController.sendRequest);

  /**
   * Accept or decline a received connection request.
   * Allows users to respond to connection attempts.
   */
  router.patch("/connect/respond", companionController.respondToRequest);

  /**
   * Get all pending connection requests received by user.
   * Shows users who are interested in connecting.
   */
  router.get("/connect/requests/:userId", companionController.getPendingRequests);

  // ==================== SAFETY ====================
  /**
   * Block a user from appearing in matches and sending requests.
   * Safety feature to remove unwanted users from experience.
   */
  router.post("/block", companionController.blockUser);

  /**
   * Report a user for violating community guidelines.
   * Allows community moderation of bad actors.
   */
  router.post("/report", companionController.reportUser);

  return router;
}

export default createCompanionRouter();
