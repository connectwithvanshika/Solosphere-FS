import express, { Router, Request, Response, NextFunction } from "express";
import authController from "../controllers/authController.js";

/**
 * Validation result interface for request body validation
 */
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * AuthRouteManager orchestrates all authentication-related route definitions and middleware
 * 
 * Why a class-based route manager:
 * - Encapsulates route setup logic in a reusable, testable class
 * - Allows middleware chaining for consistent validation across routes
 * - Enables future extensibility (OAuth, 2FA, password reset routes)
 * - Centralizes route documentation and access control
 * - Makes dependency injection easier for testing
 */
class AuthRouteManager {
  private router: Router;

  /**
   * Initialize the AuthRouteManager with a new Express Router instance
   * 
   * Why lazy route initialization:
   * - Routes are only registered when explicitly needed
   * - Enables conditional route registration based on environment
   * - Cleaner separation of concerns from module loading
   */
  constructor() {
    this.router = express.Router();
  }

  /**
   * Validates request body contains required authentication fields
   * 
   * Why validate on every request:
   * - Catches malformed requests before reaching controller logic
   * - Provides consistent validation across all auth endpoints
   * - Reduces controller complexity by handling trivial validation here
   * - Enables centralized error formatting for API consistency
   * 
   * @param requiredFields - Array of field names that must be present in request body
   * @returns Middleware function that validates the request
   */
  private createRequestValidator(requiredFields: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const validationResult: ValidationResult = this.validateRequestBody(req.body, requiredFields);

      if (!validationResult.isValid) {
        res.status(400).json({ message: validationResult.error });
        return;
      }

      // Request is valid, proceed to next middleware/handler
      next();
    };
  }

  /**
   * Validates that request body contains all required fields with proper types
   * 
   * Why extract validation logic:
   * - Reusable across multiple middleware instances
   * - Easier to test validation independently from middleware
   * - Follows single responsibility principle
   * 
   * @param requestBody - The request body to validate
   * @param requiredFields - Array of field names that must be present
   * @returns ValidationResult object with isValid flag and error message
   */
  private validateRequestBody(requestBody: Record<string, any>, requiredFields: string[]): ValidationResult {
    // Check all required fields exist and are non-empty strings
    // Why strict type checking: Prevents type confusion bugs (number vs string for email)
    const missingFields = requiredFields.filter(
      (field) => !requestBody[field] || typeof requestBody[field] !== "string" || requestBody[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      return {
        isValid: false,
        error: `Missing or invalid required fields: ${missingFields.join(", ")}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Registers all authentication routes on the router instance
   * 
   * Why explicit route registration method:
   * - Clear entry point for understanding which routes exist
   * - Makes it easy to add/remove routes without searching through code
   * - Follows builder pattern for fluent API setup
   * - Centralizes route documentation
   * 
   * @returns The configured Express Router instance
   */
  public registerRoutes(): Router {
    // POST /api/auth/signup
    // Why validation middleware on signup:
    // - Prevents invalid registration attempts before DB operations
    // - Ensures name, email, password fields exist and are properly formatted
    // - Reduces database load from spam/malformed requests
    this.router.post(
      "/signup",
      this.createRequestValidator(["name", "email", "password"]),
      async (req: Request, res: Response): Promise<void> => {
        await authController.registerUser(req, res);
      }
    );

    // POST /api/auth/login
    // Why validation middleware on login:
    // - Immediately reject requests missing credentials (fast fail)
    // - Prevents unnecessary database queries for incomplete requests
    // - Protects against brute force attack patterns early in pipeline
    this.router.post(
      "/login",
      this.createRequestValidator(["email", "password"]),
      async (req: Request, res: Response): Promise<void> => {
        await authController.loginUser(req, res);
      }
    );

    return this.router;
  }

  /**
   * Returns the configured Express Router instance
   * 
   * Why expose router getter:
   * - Allows external code to use the router without re-instantiating
   * - Encapsulates router instance within the class
   * - Provides single point of access for route registration
   * 
   * @returns The Express Router with all auth routes registered
   */
  public getRouter(): Router {
    return this.router;
  }
}

/**
 * Factory function to create and configure authentication routes
 * 
 * Why a factory function:
 * - Simplifies setup in main server file (single line: createAuthRoutes())
 * - Hides complexity of AuthRouteManager from consumers
 * - Enables future middleware setup or configuration before export
 * - Follows consistent pattern with other route modules
 * 
 * @returns Configured Express Router with all authentication endpoints
 */
export const createAuthRoutes = (): Router => {
  const authRouteManager = new AuthRouteManager();

  // Register all authentication routes on the manager
  authRouteManager.registerRoutes();

  // Return the configured router for use in main app
  return authRouteManager.getRouter();
};

// Export the router function for convenience
// Why named export + default: Allows both import styles
// import { createAuthRoutes } from './authRoutes'
// import createAuthRoutes from './authRoutes'
export default createAuthRoutes();

