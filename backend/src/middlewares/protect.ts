/**
 * @fileoverview Authentication Middleware Module
 *
 * Handles JWT-based authentication for protected routes. This middleware
 * enforces that requests include a valid JWT token, verifies token integrity,
 * and enriches requests with authenticated user information.
 *
 * Architecture: Implements class-based middleware pattern with dependency injection
 * to enable testability, better error handling, and separation of concerns.
 */

import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import type { Document } from "mongoose";
import User from "../models/User.js";

/* ============================= TYPE DEFINITIONS ============================= */

/**
 * Payload structure of a validated JWT token.
 * We extract the user ID from the token to look up user details.
 */
interface IJwtPayload extends JwtPayload {
  id: string;
}

/**
 * Extending Express Request to include authenticated user property.
 * This allows TypeScript to understand that protected route handlers
 * will have access to req.user without casting.
 */
declare global {
  namespace Express {
    interface Request {
      user?: Document;
    }
  }
}

/**
 * Represents the token extraction result.
 * Using a discriminated union prevents checking null in multiple places.
 */
type TokenExtractionResult =
  | { success: true; token: string }
  | { success: false; error: string };

/* ============================= TOKEN EXTRACTOR ============================= */

/**
 * @class TokenExtractor
 *
 * Extracts JWT tokens from HTTP request headers.
 * Separated into its own class to:
 * 1. Make token extraction testable independently
 * 2. Support multiple extraction strategies (Bearer, custom header, etc.)
 * 3. Keep authentication logic clean and reusable
 *
 * Why separate class: Following Single Responsibility Principle - this class
 * has one job: extract tokens from requests. Makes it easy to add cookie-based
 * tokens or other extraction methods later without modifying the middleware.
 */
class TokenExtractor {
  private static readonly BEARER_PREFIX = "Bearer";
  private static readonly AUTHORIZATION_HEADER = "authorization";

  /**
   * Extracts JWT token from Authorization header.
   *
   * Why Bearer token format: Industry standard for API authentication.
   * Token should be in format "Bearer <token>" per HTTP specification.
   *
   * Why strict null checks: Validates header exists and has correct format
   * before attempting string operations. Prevents undefined crashes.
   *
   * @param {Request} req - Express request object
   * @returns {TokenExtractionResult} Token if found, error message otherwise
   */
  static extractTokenFromHeader(req: Request): TokenExtractionResult {
    const authHeader = req.headers[this.AUTHORIZATION_HEADER];

    // Header must be a string (Express type narrowing)
    if (typeof authHeader !== "string") {
      return {
        success: false,
        error: "Authorization header is missing or invalid",
      };
    }

    // Check if header follows Bearer token format
    if (!authHeader.startsWith(`${this.BEARER_PREFIX} `)) {
      return {
        success: false,
        error: "Authorization header must use Bearer token format",
      };
    }

    // Extract token after "Bearer " prefix
    const token = authHeader.substring(`${this.BEARER_PREFIX} `.length);

    // Validate token is not empty after extraction
    if (!token || token.length === 0) {
      return {
        success: false,
        error: "Token cannot be empty",
      };
    }

    return { success: true, token };
  }
}

/* ============================= JWT VERIFIER ============================= */

/**
 * @class JwtVerifier
 *
 * Verifies JWT token integrity and extracts payload.
 * Separated to avoid mixing token extraction, verification, and user lookup.
 *
 * Why encapsulate verification: JWT verification can throw exceptions and
 * returns decoded tokens. Centralizing enables consistent error handling
 * and makes the class responsible for one thing: token verification.
 */
class JwtVerifier {
  private jwtSecret: string;

  constructor(jwtSecret: string) {
    // JWT_SECRET must always be defined; throw early if misconfigured
    if (!jwtSecret || jwtSecret.length === 0) {
      throw new Error("JWT_SECRET environment variable is not configured");
    }
    this.jwtSecret = jwtSecret;
  }

  /**
   * Verifies a JWT token and extracts its payload.
   *
   * Why separate method: Isolates JWT verification from Express middleware.
   * Enables testing verification logic without Express or middleware concerns.
   *
   * Why throw on error: Invalid tokens are security issues. Throwing forces
   * the caller to explicitly handle and respond appropriately, rather than
   * silently returning null which can be missed.
   *
   * @param {string} token - JWT token to verify
   * @returns {IJwtPayload} The decoded token payload
   * @throws {Error} If token is invalid, expired, or malformed
   */
  verifyToken(token: string): IJwtPayload {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);

      // TypeScript guard: ensure decoded has the expected structure
      if (typeof decoded === "string" || !("id" in decoded)) {
        throw new Error("Token payload does not contain user ID");
      }

      return decoded as IJwtPayload;
    } catch (error) {
      // Re-throw with descriptive message for logging
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token has expired");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error(`Invalid token: ${error.message}`);
      }
      throw error;
    }
  }
}

/* ============================= USER REPOSITORY ============================= */

/**
 * @class UserRepository
 *
 * Handles user data access operations.
 * Abstracts database operations to isolate authentication logic from
 * Mongoose-specific concerns.
 *
 * Why repository pattern: Swapping User model implementation or adding caching
 * only requires changes here. The authentication middleware remains unchanged.
 * Also enables easier testing with mock repositories.
 */
class UserRepository {
  /**
   * Fetches user by ID, excluding sensitive password field.
   *
   * Why exclude password: Passwords should never appear in application memory
   * beyond the hash verification step. Including them in authenticated requests
   * is a security anti-pattern.
   *
   * Why return null instead of throwing: User not found is a distinct state
   * from database errors. The caller needs to handle this specifically by
   * returning 401 (user existed when token was issued, but no longer exists).
   *
   * @param {string} userId - MongoDB user ID from JWT
   * @returns {Promise<Document | null>} User without password or null
   * @throws {Error} If database operation fails
   */
  async findUserById(userId: string): Promise<Document | null> {
    return User.findById(userId).select("-password").exec();
  }
}

/* ============================= AUTHENTICATION SERVICE ============================= */

/**
 * @class AuthenticationService
 *
 * Orchestrates the complete authentication flow:
 * 1. Extract token from request
 * 2. Verify token integrity
 * 3. Look up user in database
 *
 * Why service: Enables testing the full auth flow independently and makes
 * the middleware thin/simple by delegating complexity here.
 */
class AuthenticationService {
  private jwtVerifier: JwtVerifier;
  private userRepository: UserRepository;

  constructor(jwtVerifier: JwtVerifier, userRepository: UserRepository) {
    this.jwtVerifier = jwtVerifier;
    this.userRepository = userRepository;
  }

  /**
   * Authenticates a request and returns the associated user.
   *
   * Why this orchestration: Combines multiple steps (extraction, verification,
   * lookup) into a single method. Callers don't need to know the details,
   * just call authenticate and get either the user or an error.
   *
   * Why return type is Promise<Document | null>: Authentication either succeeds
   * (returns user) or fails in different ways (invalid token, user not found).
   * The middleware uses this to send appropriate HTTP status codes.
   *
   * @param {Request} req - Express request with Authorization header
   * @returns {Promise<Document>} The authenticated user
   * @throws {Error} If token is missing, invalid, or user not found
   */
  async authenticateRequest(req: Request): Promise<Document> {
    // Step 1: Extract token from Authorization header
    const tokenExtractionResult = TokenExtractor.extractTokenFromHeader(req);
    if (!tokenExtractionResult.success) {
      const errorMessage = 'error' in tokenExtractionResult ? tokenExtractionResult.error : 'Unknown token extraction error';
      throw new Error(errorMessage);
    }

    // Step 2: Verify token integrity
    const tokenPayload = this.jwtVerifier.verifyToken(tokenExtractionResult.token);

    // Step 3: Look up user in database
    const user = await this.userRepository.findUserById(tokenPayload.id);
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}

/* ============================= MIDDLEWARE ============================= */

/**
 * @class ProtectMiddleware
 *
 * Express middleware that enforces authentication on protected routes.
 * Uses dependency injection to accept validator, verifier, and repository.
 *
 * Why class-based middleware: Enables dependency injection and testing.
 * Also allows stateful middleware if needed in the future (e.g., tracking failed attempts).
 *
 * Why constructor injection: Both JwtVerifier and UserRepository need
 * setup (JWT secret, database connection). Injecting them ensures proper
 * initialization and enables swapping implementations in tests.
 */
class ProtectMiddleware {
  private authenticationService: AuthenticationService;

  constructor(authenticationService: AuthenticationService) {
    this.authenticationService = authenticationService;
  }

  /**
   * Express middleware handler for authentication.
   *
   * Why error handling: Different authentication failures have specific meanings:
   * - Missing token: 401 (unauthenticated)
   * - Invalid token: 401 (unauthenticated)
   * - User not found: 401 (unauthenticated)
   * - Database error: 500 (server error)
   *
   * Why separate error messages: Helps developers debug issues during development.
   * In production, consider a generic "Unauthorized" for all 401s to avoid
   * leaking information about which userIDs exist.
   *
   * @param {Request} req - Express request
   * @param {Response} res - Express response
   * @param {NextFunction} next - Express next middleware function
   */
  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Authenticate request and attach user to request object
      const authenticatedUser = await this.authenticationService.authenticateRequest(req);
      req.user = authenticatedUser;

      // Continue to next middleware/route handler
      next();
    } catch (error) {
      // Handle different error types appropriately
      const errorMessage = error instanceof Error ? error.message : "Authentication failed";

      // Distinguish between different failure reasons for better debugging
      if (
        errorMessage.includes("missing") ||
        errorMessage.includes("invalid") ||
        errorMessage.includes("not found")
      ) {
        res.status(401).json({ message: `Unauthorized: ${errorMessage}` });
      } else if (errorMessage.includes("expired")) {
        res.status(401).json({ message: "Unauthorized: Token has expired" });
      } else {
        // Generic server error for unexpected issues
        res.status(500).json({ message: "Internal authentication error" });
      }
    }
  };
}

/* ============================= FACTORY AND EXPORT ============================= */

/**
 * Factory function to create a configured authentication middleware.
 *
 * Why factory: Handles initialization of all dependencies and returns
 * a middleware function. Keeps setup logic separate from middleware usage.
 *
 * Why getJwtSecret from process.env: Environment variables should only be
 * read once at startup. Reading them repeatedly is slow and can lead to
 * configuration mismatches if they change.
 *
 * @param {string} jwtSecret - JWT secret for token verification
 * @returns {(req: Request, res: Response, next: NextFunction) => Promise<void>}
 *          Express middleware function
 */
function createProtectMiddleware(jwtSecret: string) {
  const jwtVerifier = new JwtVerifier(jwtSecret);
  const userRepository = new UserRepository();
  const authenticationService = new AuthenticationService(jwtVerifier, userRepository);
  const protectMiddleware = new ProtectMiddleware(authenticationService);

  return protectMiddleware.handle;
}

// Initialize and export the protect middleware with JWT_SECRET from environment
export const protect = createProtectMiddleware(process.env.JWT_SECRET || "");
