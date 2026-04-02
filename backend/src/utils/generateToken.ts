import jwt from "jsonwebtoken";
import { Types } from "mongoose";

/**
 * JWT token payload interface
 */
interface TokenPayload {
  id: string;
}

/**
 * Generates a JWT authentication token for user session management
 *
 * @param userId - MongoDB user ID (ObjectId)
 * @returns Signed JWT token string
 * @throws Error if JWT_SECRET is not defined in environment variables
 *
 * @example
 * const token = generateToken(userId);
 * // Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
export const generateToken = (userId: Types.ObjectId | string): string => {
  const secret = process.env.JWT_SECRET;

  // Verify secret exists before attempting token generation
  // Why fail early: Missing secrets cause runtime errors on every auth, hard to debug
  // Better to catch during startup than during concurrent user signups
  if (!secret) {
    throw new Error("❌ JWT_SECRET is not defined in .env file");
  }

  // Include only userId in payload
  // Why minimal payload: Reduces token size, faster transmission and parsing
  // Sensitive data (passwords, IP addresses) should never be in token
  const payload: TokenPayload = {
    id: userId.toString(),
  };

  // Sign with HS256 and 7-day expiration
  // Why HS256: Fast symmetric algorithm suitable for single-server validation
  // Why explicit algorithm: Prevents algorithm switching attacks (RS256 trick)
  return jwt.sign(payload, secret, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
};
