/**
 * @fileoverview Emergency Routes Module
 *
 * Handles SOS (emergency) activation logging for the Solosphere platform.
 * This module captures critical user location data when the emergency button is activated,
 * enabling rapid emergency response and user safety features.
 *
 * Architecture: Implements layered architecture (Validator → Service → Controller)
 * to ensure data integrity, business logic isolation, and clean separation of concerns.
 */

import express, { Router, Request, Response, NextFunction } from "express";
import type { Document } from "mongoose";
import EmergencyLog from "../models/EmergencyLog.js";

/* ============================= TYPE DEFINITIONS ============================= */

/**
 * Represents geographic coordinates and optional location identifier.
 * Separated into its own interface to support reuse across multiple features
 * (matching, exploration, emergency response, etc.).
 */
interface IGeolocation {
  lat: number;
  lng: number;
  city?: string;
}

/**
 * Represents the raw emergency log request payload from the client.
 * Using optional userId allows the system to handle guest emergencies
 * without requiring authentication, critical for accessibility in crisis moments.
 */
interface IEmergencyLogPayload {
  userId?: string;
  lat: number;
  lng: number;
  city?: string;
}

/**
 * Represents the complete emergency log entity prepared for storage.
 * This interface documents the exact structure persisted to the database.
 */
interface IEmergencyLogRequest extends IEmergencyLogPayload {
  location: IGeolocation;
}

/* ============================= VALIDATION LAYER ============================= */

/**
 * @class EmergencyValidator
 *
 * Validates emergency log data at the API boundary to prevent invalid geolocation
 * data from being stored. Geolocation data quality is critical for emergency services,
 * making comprehensive validation essential before database operations.
 *
 * Why validation at this layer: Emergency responses must be fast and accurate.
 * Catching bad data early prevents corrupting the database with unusable coordinates
 * that could endanger users by misdirecting responders.
 */
class EmergencyValidator {
  /**
   * Validates emergency log payload comprehensively.
   *
   * We enforce strict geographic constraints because:
   * 1. Invalid lat/lng values render location data useless for mapping/routing
   * 2. Out-of-range coordinates could cause crashes in mapping services
   * 3. Invalid data in emergency systems could literally cost lives
   *
   * @throws {Error} If any geographic coordinates are invalid
   */
  static validateEmergencyLogPayload(payload: any): asserts payload is IEmergencyLogPayload {
    if (typeof payload.lat !== "number" || typeof payload.lng !== "number") {
      throw new Error("Latitude and longitude must be valid numbers");
    }

    if (payload.lat < -90 || payload.lat > 90) {
      throw new Error("Latitude must be between -90 and 90");
    }

    if (payload.lng < -180 || payload.lng > 180) {
      throw new Error("Longitude must be between -180 and 180");
    }

    if (payload.city && typeof payload.city !== "string") {
      throw new Error("City must be a string");
    }
  }
}

/* ============================= SERVICE LAYER ============================= */

/**
 * @class EmergencyService
 *
 * Encapsulates all business logic for emergency logging.
 * This separation enables:
 * 1. Reuse across different transports (REST, WebSocket, gRPC)
 * 2. Easy testing without Express dependencies
 * 3. Decoupling from database implementation details
 * 4. Potential queuing/batching of emergency logs if needed
 */
class EmergencyService {
  /**
   * Records an emergency activation with precise geolocation data.
   *
   * Why we handle optional userId: Users in crisis situations may not be signed in,
   * and requiring authentication during an emergency is a security and safety anti-pattern.
   * We allow guest emergency logs while still recording them for responder analysis.
   *
   * @param {string | undefined} userId - User ID if authenticated, undefined for guests
   * @param {IGeolocation} geolocation - Precise coordinates and optional city identifier
   * @returns {Promise<Document>} The created emergency log document with timestamp
   * @throws {Error} If database operation fails
   */
  async logEmergencyActivation(
    userId: string | undefined,
    geolocation: IGeolocation
  ): Promise<Document> {
    return EmergencyLog.create({
      userId: userId || null,
      location: {
        lat: geolocation.lat,
        lng: geolocation.lng,
        city: geolocation.city,
      },
    });
  }
}

/* ============================= CONTROLLER LAYER ============================= */

/**
 * @class EmergencyController
 *
 * Manages HTTP request/response lifecycle for emergency endpoints.
 * Responsibilities:
 * 1. Parse incoming emergency activation requests
 * 2. Validate payload before service processing
 * 3. Invoke service layer business logic
 * 4. Return consistent HTTP responses
 * 5. Delegate error handling to middleware
 *
 * This separation ensures service logic can be tested independently
 * and potentially ported to other frameworks/platforms.
 */
class EmergencyController {
  private emergencyService: EmergencyService;

  constructor(emergencyService: EmergencyService) {
    this.emergencyService = emergencyService;
  }

  /**
   * Handles emergency activation logging request.
   *
   * Why 201 status code: We're creating a new emergency log resource.
   * Why delegation to error middleware: Allows global error handling,
   * logging, and consistent error response formatting across all endpoints.
   *
   * @route POST /log
   * @param {Request} req - Request containing geolocation and optional user ID
   * @param {Response} res - Response object for sending HTTP response
   * @param {NextFunction} next - Error handler middleware
   */
  logEmergency = async (
    req: Request<{}, {}, IEmergencyLogPayload>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      EmergencyValidator.validateEmergencyLogPayload(req.body);

      const { userId, lat, lng, city } = req.body;
      const log = await this.emergencyService.logEmergencyActivation(userId, {
        lat,
        lng,
        city,
      });

      res.status(201).json({ success: true, log });
    } catch (error) {
      next(error);
    }
  };
}

/* ============================= ROUTE SETUP ============================= */

/**
 * Factory function to create and configure the emergency routes router.
 *
 * Why factory pattern: Enables dependency injection for testing and
 * allows easy swapping of service implementations without modifying route definitions.
 *
 * @returns {Router} Configured Express router with emergency endpoints
 */
function createEmergencyRouter(): Router {
  const router = express.Router();

  const emergencyService = new EmergencyService();
  const emergencyController = new EmergencyController(emergencyService);

  /**
   * @swagger
   * /emergency/log:
   *   post:
   *     summary: Log emergency activation
   *     description: Record an SOS (emergency) activation with precise geolocation data. Can be called by authenticated users or guests
   *     tags:
   *       - Emergency
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - lat
   *               - lng
   *             properties:
   *               userId:
   *                 type: string
   *                 description: Optional user ID if authenticated
   *                 example: 507f1f77bcf86cd799439011
   *               lat:
   *                 type: number
   *                 format: double
   *                 minimum: -90
   *                 maximum: 90
   *                 example: 48.8566
   *               lng:
   *                 type: number
   *                 format: double
   *                 minimum: -180
   *                 maximum: 180
   *                 example: 2.3522
   *               city:
   *                 type: string
   *                 description: Optional city name for reference
   *                 example: Paris
   *     responses:
   *       201:
   *         description: Emergency logged successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 log:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                     userId:
   *                       type: string
   *                     location:
   *                       type: object
   *                       properties:
   *                         lat:
   *                           type: number
   *                         lng:
   *                           type: number
   *                         city:
   *                           type: string
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *       400:
   *         description: Validation error - invalid geolocation coordinates
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Latitude must be between -90 and 90
   *       500:
   *         description: Server error
   */
  router.post("/log", emergencyController.logEmergency);

  return router;
}

export default createEmergencyRouter();
