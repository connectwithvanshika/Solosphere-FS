import express, { Router, Request, Response, NextFunction } from "express";
import type { Document, Types } from "mongoose";
import TravelPlan from "../models/TravelPlan.js";
import ConnectionRequest from "../models/ConnectionRequest.js";
import Block from "../models/Block.js";
import Report from "../models/Report.js";
import User from "../models/User.js";

interface ITravelPlanPayload {
  userId: string;
  city: string;
  startDate: Date;
  endDate: Date;
  genderPreference: "female-only" | "all";
}

interface IUserProfileResponse {
  _id: string;
  name: string;
  gender: string;
  verified: boolean;
}

interface IMatchResult {
  _id: string;
  userId: IUserProfileResponse;
  city: string;
  startDate: Date;
  endDate: Date;
  genderPreference: "female-only" | "all";
  isActive: boolean;
}

interface IConnectionRequestPayload {
  senderId: string;
  receiverId: string;
}

interface IConnectionResponsePayload {
  requestId: string;
  status: "accepted" | "declined";
}

interface ISafetyActionPayload {
  blockerId?: string;
  blockedUserId?: string;
  reporterId?: string;
  reportedUserId?: string;
  reason?: string;
}

class TravelCompanionValidator {
  static validateTravelPlanPayload(payload: any): asserts payload is ITravelPlanPayload {
    if (!payload.userId || !payload.city || !payload.startDate || !payload.endDate) {
      throw new Error("Missing required fields: userId, city, startDate, endDate");
    }

    const start = new Date(payload.startDate);
    const end = new Date(payload.endDate);

    if (end <= start) {
      throw new Error("End date must be after start date");
    }
  }

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

  static validateBlockAction(payload: any): void {
    if (!payload.blockerId || !payload.blockedUserId) {
      throw new Error("Both blockerId and blockedUserId are required");
    }

    if (payload.blockerId === payload.blockedUserId) {
      throw new Error("Cannot block yourself");
    }
  }

  static validateReportAction(payload: any): void {
    if (!payload.reporterId || !payload.reportedUserId || !payload.reason) {
      throw new Error("reporterId, reportedUserId, and reason are required");
    }

    if (payload.reporterId === payload.reportedUserId) {
      throw new Error("Cannot report yourself");
    }

    if (payload.reason.trim().length < 10) {
      throw new Error("Report reason must be at least 10 characters");
    }
  }
}

class TravelCompanionService {
  async createOrUpdateTravelPlan(planData: ITravelPlanPayload): Promise<Document> {
    const existingPlan = await TravelPlan.findOne({ userId: planData.userId });

    if (existingPlan) {
      existingPlan.city = planData.city;
      existingPlan.startDate = planData.startDate;
      existingPlan.endDate = planData.endDate;
      existingPlan.genderPreference = planData.genderPreference;
      existingPlan.isActive = true;
      await existingPlan.save();
      return existingPlan;
    }

    return TravelPlan.create(planData);
  }

  async getUserTravelPlan(userId: string): Promise<Document | null> {
    return TravelPlan.findOne({ userId });
  }

  async findCompatibleMatches(userId: string): Promise<any[]> {
    const userPlan = await TravelPlan.findOne({ userId });

    // Return empty array for users without active plans
    // This prevents anonymous users from appearing in searches
    if (!userPlan || !userPlan.isActive) {
      return [];
    }

    const blockedRecords = await Block.find({ blockerId: userId }).select(
      "blockedUserId"
    );
    const blockedUserIds = blockedRecords.map((record) => record.blockedUserId);

    const matchingPlans = await TravelPlan.find({
      userId: {
        $ne: userId,
        $nin: blockedUserIds,
      },
      city: new RegExp(userPlan.city, "i"),
      startDate: { $lte: userPlan.endDate },
      endDate: { $gte: userPlan.startDate },
      isActive: true,
    }).populate("userId", "name gender verified");

    return matchingPlans;
  }

  async sendConnectionRequest(
    requestData: IConnectionRequestPayload
  ): Promise<Document> {
    const existingRequest = await ConnectionRequest.findOne({
      senderId: requestData.senderId,
      receiverId: requestData.receiverId,
    });

    if (existingRequest) {
      throw new Error("Connection request already sent to this user");
    }

    return ConnectionRequest.create(requestData);
  }

  async respondToConnectionRequest(
    requestId: string,
    status: "accepted" | "declined"
  ): Promise<Document> {
    const updatedRequest = await ConnectionRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      throw new Error("Connection request not found");
    }

    return updatedRequest;
  }

  async getUserPendingRequests(userId: string): Promise<Document[]> {
    return ConnectionRequest.find({
      receiverId: userId,
      status: "pending",
    }).populate("senderId", "name gender verified");
  }

  async blockUser(blockerId: string, blockedUserId: string): Promise<void> {
    const existingBlock = await Block.findOne({ blockerId, blockedUserId });
    if (!existingBlock) {
      await Block.create({ blockerId, blockedUserId });
    }
  }

  async reportUser(
    reporterId: string,
    reportedUserId: string,
    reason: string
  ): Promise<void> {
    await Report.create({ reporterId, reportedUserId, reason });
  }
}

class TravelCompanionController {
  private companionService: TravelCompanionService;

  constructor(companionService: TravelCompanionService) {
    this.companionService = companionService;
  }

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
      next(error);
    }
  };

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
      if (error instanceof Error && error.message.includes("already sent")) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        next(error);
      }
    }
  };

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

function createCompanionRouter(): Router {
  const router = express.Router();

  const companionService = new TravelCompanionService();
  const companionController = new TravelCompanionController(companionService);

  router.post("/plans", companionController.createOrUpdatePlan);

  router.get("/plans/:userId", companionController.getPlan);

  router.get("/matches/:userId", companionController.getMatches);

  router.post("/connect/request", companionController.sendRequest);

  router.patch("/connect/respond", companionController.respondToRequest);

  router.get("/connect/requests/:userId", companionController.getPendingRequests);

  router.post("/block", companionController.blockUser);

  router.post("/report", companionController.reportUser);

  return router;
}

export default createCompanionRouter();
