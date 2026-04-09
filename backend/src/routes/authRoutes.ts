import express, { Router, Request, Response, NextFunction } from "express";
import authController from "../controllers/authController";

/**
 * Represents the structure of a validation outcome.
 * 
 * Why a dedicated type:
 * - Establishes a consistent contract for validation logic
 * - Avoids ambiguous return types (boolean vs object confusion)
 * - Enables future extensibility (e.g., error codes, metadata)
 */
interface ValidationResult {
  readonly isValid: boolean;
  readonly errorMessage?: string;
}

/**
 * Defines the expected shape of authentication-related request bodies.
 * 
 * Why explicit typing over generic Record<string, unknown>:
 * - Prevents runtime ambiguity (type coercion issues)
 * - Enables compile-time guarantees for required fields
 * - Improves IDE inference and developer velocity
 */
type AuthRequestBody = {
  name?: string;
  email?: string;
  password?: string;
};

/**
 * AuthRouteManager encapsulates all authentication route orchestration.
 * 
 * Why class-based design:
 * - Enables encapsulation (hiding validation + routing internals)
 * - Supports dependency injection for testability
 * - Scales better when adding cross-cutting concerns (rate limiting, logging)
 */
class AuthRouteManager {
  private readonly router: Router;

  constructor() {
    this.router = express.Router();
  }

  /**
   * Generates middleware for validating request payloads.
   * 
   * Why factory-based middleware:
   * - Avoids duplicating validation logic across routes
   * - Enables declarative route definitions (cleaner route layer)
   * - Keeps controllers focused on business logic, not input hygiene
   */
  private createBodyValidator(requiredFields: (keyof AuthRequestBody)[]) {
    return (req: Request<unknown, unknown, AuthRequestBody>, res: Response, next: NextFunction): void => {
      const validationResult = this.validateRequestBody(req.body, requiredFields);

      if (!validationResult.isValid) {
        res.status(400).json({ message: validationResult.errorMessage });
        return;
      }

      next();
    };
  }

  /**
   * Validates request body against required fields.
   * 
   * Why strict validation strategy:
   * - Prevents type confusion (e.g., number passed as email)
   * - Reduces downstream defensive coding in controllers
   * - Acts as an early rejection layer (improves system efficiency)
   */
  private validateRequestBody(
    requestBody: AuthRequestBody,
    requiredFields: (keyof AuthRequestBody)[]
  ): ValidationResult {
    const invalidFields = requiredFields.filter((field) => {
      const value = requestBody[field];
      return typeof value !== "string" || value.trim().length === 0;
    });

    if (invalidFields.length > 0) {
      return {
        isValid: false,
        errorMessage: `Missing or invalid fields: ${invalidFields.join(", ")}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Registers all authentication routes.
   * 
   * Why centralized registration:
   * - Provides a single source of truth for route definitions
   * - Improves discoverability for maintainers
   * - Enables conditional route loading (feature flags, environments)
   */
  public initializeRoutes(): void {
    /**
     * @swagger
     * /auth/signup:
     *   post:
     *     summary: Register a new user
     *     description: Create a new user account with email and password
     *     tags:
     *       - Authentication
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - email
     *               - password
     *             properties:
     *               name:
     *                 type: string
     *                 example: John Doe
     *               email:
     *                 type: string
     *                 format: email
     *                 example: john@example.com
     *               password:
     *                 type: string
     *                 format: password
     *                 example: securePassword123
     *     responses:
     *       200:
     *         description: User registered successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 token:
     *                   type: string
     *       400:
     *         description: Validation error or user already exists
     *       500:
     *         description: Internal server error
     */
    this.router.post(
      "/signup",
      this.createBodyValidator(["name", "email", "password"]),
      this.handleAsync(authController.registerUser)
    );

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: User login
     *     description: Authenticate user with email and password
     *     tags:
     *       - Authentication
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: john@example.com
     *               password:
     *                 type: string
     *                 format: password
     *                 example: securePassword123
     *     responses:
     *       200:
     *         description: Login successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 token:
     *                   type: string
     *       400:
     *         description: Invalid credentials
     *       500:
     *         description: Internal server error
     */
    this.router.post(
      "/login",
      this.createBodyValidator(["email", "password"]),
      this.handleAsync(authController.loginUser)
    );
  }

  /**
   * Wraps async route handlers to standardize error propagation.
   * 
   * Why abstraction over try-catch:
   * - Eliminates repetitive error handling boilerplate
   * - Ensures all async errors are forwarded to Express error middleware
   * - Prevents unhandled promise rejections
   */
  private handleAsync(
    handler: (req: Request, res: Response) => Promise<void>
  ) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await handler(req, res);
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Exposes the configured router instance.
   * 
   * Why controlled exposure:
   * - Prevents external mutation of internal routing logic
   * - Maintains encapsulation boundary
   */
  public getRouter(): Router {
    return this.router;
  }
}

/**
 * Factory function for authentication routes.
 * 
 * Why factory over direct export:
 * - Decouples instantiation from usage
 * - Enables future configuration injection (e.g., feature toggles)
 * - Simplifies integration in application bootstrap layer
 */
export const createAuthRoutes = (): Router => {
  const routeManager = new AuthRouteManager();
  routeManager.initializeRoutes();
  return routeManager.getRouter();
};

export default createAuthRoutes;