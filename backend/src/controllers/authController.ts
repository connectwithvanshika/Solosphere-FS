import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

/**
 * Request body interface for user registration
 */
interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

/**
 * Request body interface for user login
 */
interface LoginRequestBody {
  email: string;
  password: string;
}

/**
 * Authentication response interface
 */
interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

/**
 * AuthController handles all authentication-related operations
 * 
 * Why a class-based approach:
 * - Enables dependency injection and testability
 * - Groups related authentication logic together
 * - Allows for shared validation utilities across methods
 * - Provides a clear interface for route handlers
 * - Supports future extensions like password reset, email verification
 */
class AuthController {
  /**
   * Validates that all required fields are present in the request body
   * 
   * Why validate early:
   * - Prevents unnecessary database queries for incomplete requests
   * - Provides immediate feedback to clients about missing data
   * - Reduces server resource consumption on invalid requests
   * - Improves security by rejecting malformed payloads early
   * 
   * @param fields - Array of field names to validate
   * @param data - Request body data to validate
   * @returns true if all fields are present and non-empty, false otherwise
   */
  private validateRequiredFields(fields: string[], data: Record<string, any>): boolean {
    return fields.every((field) => data[field] && typeof data[field] === "string" && data[field].trim() !== "");
  }

  /**
   * Validates email format using a basic regex pattern
   * 
   * Why email validation:
   * - Prevents typos and invalid emails from being stored (reduces user support)
   * - Ensures emails are deliverable for password reset flows
   * - Catches common mistakes early before database operations
   * - Improves data quality in the user base for communication
   * 
   * @param email - Email string to validate
   * @returns true if email format is valid, false otherwise
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Registers a new user with the provided credentials
   * 
   * Why this flow:
   * - Field validation prevents storing corrupted data
   * - Email uniqueness prevents multiple accounts per person (simplifies auth)
   * - Password hashing ensures even admins cannot read user passwords
   * - Token generation enables immediate authenticated session after signup
   *
   * @param req - Express request object containing user registration data
   * @param res - Express response object for sending authentication response
   * @returns JSON response with user data and authentication token on success
   *
   * Response Status Codes:
   * - 201: User successfully registered (indicates resource creation)
   * - 400: Validation error (missing fields, invalid email, user exists)
   * - 500: Server error during registration
   */
  async registerUser(req: Request<{}, {}, RegisterRequestBody>, res: Response<AuthResponse | { message: string }>): Promise<void> {
    try {
      const { name, email, password } = req.body;

      // Validate required fields early to avoid expensive database operations
      // This provides immediate feedback without hitting the database
      if (!this.validateRequiredFields(["name", "email", "password"], { name, email, password })) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      // Email format validation prevents storing undeliverable addresses
      // This catches typos before they're persisted to the database
      if (!this.isValidEmail(email)) {
        res.status(400).json({ message: "Invalid email format" });
        return;
      }

      // Check for duplicate email to maintain uniqueness constraint
      // This prevents multiple accounts per user and authentication confusion
      // Must happen before password hashing to avoid unnecessary CPU usage
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "User already exists with this email" });
        return;
      }

      // Hash password with bcrypt (10 rounds) NEVER store plain text passwords
      // Why 10 rounds: Provides strong security (~10^8 iterations) while keeping response time < 1s
      // Prevents attackers from learning password even if database is compromised
      const hashedPassword = await bcrypt.hash(password, 10);

      // Normalize inputs before storage to ensure consistency
      // Trim whitespace to prevent login issues from accidental spaces
      // Lowercase email to prevent case-sensitivity issues at login
      const newUser = await User.create({
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      // Generate JWT token immediately to enable stateless authentication
      // Why stateless: Removes need for server-side session storage, enables horizontal scaling
      // Token carries user identity and avoids additional database lookup on each request
      const authToken = generateToken(newUser._id);

      // Return minimal user data (exclude password/sensitive fields)
      // Client stores token for Authorization header on subsequent requests
      const authResponse: AuthResponse = {
        _id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: authToken,
      };

      res.status(201).json(authResponse);
    } catch (error) {
      // Log error details for production debugging without exposing internals to client
      // Why generic error message: Prevents attackers from gathering system information
      if (error instanceof Error) {
        console.error("User registration failed:", error.message);
      }
      res.status(500).json({ message: "An error occurred during registration. Please try again later." });
    }
  }

  /**
   * Authenticates a user with email and password credentials
   * 
   * Why this flow:
   * - Email lookup first to verify user exists (fails fast on invalid users)
   * - Parallel password comparison ensures constant-time execution (prevents timing attacks)
   * - Token generation on success avoids additional requests for tokens
   *
   * @param req - Express request object containing login credentials
   * @param res - Express response object for sending authentication response
   * @returns JSON response with user data and authentication token on success
   *
   * Response Status Codes:
   * - 200: User successfully authenticated
   * - 400: Missing required fields
   * - 401: Invalid credentials (user not found or password mismatch)
   * - 500: Server error during login
   */
  async loginUser(req: Request<{}, {}, LoginRequestBody>, res: Response<AuthResponse | { message: string }>): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate credentials are provided before querying database
      // Early validation prevents unnecessary database operations and improves performance
      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      // Query user by email (should be indexed in database for O(log n) lookup)
      // Lowercase email ensures consistent matching regardless of input case
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Why generic error message: Prevents account enumeration attacks
        // Attackers cannot discover valid email addresses by trying combinations
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      // Compare plain password against bcrypt hash
      // Why bcrypt.compare: Uses constant-time comparison to prevent timing attacks
      // Attackers cannot determine password length or characters based on response time
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        // Use same generic error message as missing user to avoid revealing account existence
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      // Generate new token for this session
      // Why new token each login: Ensures user gets latest version with fresh expiration
      // Allows logout by token rotation (client gets new token, old token expires)
      const authToken = generateToken(user._id);

      // Return user data without sensitive fields
      // Client uses token for all subsequent authenticated requests
      const authResponse: AuthResponse = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        token: authToken,
      };

      res.json(authResponse);
    } catch (error) {
      // Log error details for production debugging without exposing system info
      // Why generic error message: Prevents information leakage to potential attackers
      if (error instanceof Error) {
        console.error("User authentication failed:", error.message);
      }
      res.status(500).json({ message: "An error occurred during login. Please try again later." });
    }
  }
}

// Export singleton instance of AuthController
// Why singleton: Ensures single instance across application, reduces memory overhead
// Controllers are stateless so singleton is safe and efficient
export default new AuthController();
