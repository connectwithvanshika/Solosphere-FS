import mongoose, { Connection } from "mongoose";

/**
 * DatabaseConnection Class
 *
 * Manages MongoDB connection lifecycle with proper state management,
 * error handling, and connection status tracking.
 *
 * @class DatabaseConnection
 * @example
 * // Usage in server initialization
 * import db from "./config/db";
 * await db.connect();
 */
class DatabaseConnection {
  // ==================== Private Properties ====================

  /**
   * MongoDB connection URI
   * @private
   * @type {string}
   */
  private uri: string;

  /**
   * Connection status flag
   * @private
   * @type {boolean}
   */
  private isConnected: boolean;

  /**
   * Mongoose connection instance reference
   * @private
   * @type {Connection | null}
   */
  private connection: Connection | null = null;

  // ==================== Constructor ====================

  /**
   * Initializes DatabaseConnection instance with MongoDB URI
   *
   * Why read from process.env directly:
   * - Simplest approach, no abstraction layer needed
   * - process.env is populated by dotenv.config() at startup
   * - Clear where the connection string comes from
   *
   * @constructor
   * @throws {Error} If MONGODB_URI is not provided in .env
   *
   * @example
   * const db = new DatabaseConnection();
   * await db.connect();
   */
  constructor() {
    // Get MongoDB URI from environment variables
    // Why from process.env: Loaded by dotenv at application startup
    // MONGODB_URI must be set in .env file
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || mongoUri.trim() === "") {
      throw new Error("❌ MONGODB_URI is not defined or empty in .env file");
    }

    this.uri = mongoUri;
    this.isConnected = false;
  }

  // ==================== Public Methods ====================

  /**
   * Establishes connection to MongoDB database
   *
   * Attempts to connect to MongoDB using the provided URI.
   * Sets the connection status flag and logs the result.
   *
   * @async
   * @returns {Promise<void>}
   * @throws {Error} Exits process if connection fails
   *
   * @example
   * try {
   *   await db.connect();
   * } catch (error) {
   *   console.error("Failed to connect to database");
   * }
   */
  async connect(): Promise<void> {
    try {
      // Establish connection with Mongoose
      await mongoose.connect(this.uri);

      // Update connection status
      this.isConnected = true;
      this.connection = mongoose.connection;

      console.log("Database connected successfully!");
    } catch (error) {
      // Log the error and exit process
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Database connection error:", errorMessage);

      this.isConnected = false;
      this.connection = null;
      process.exit(1);
    }
  }

  /**
   * Closes the MongoDB connection gracefully
   *
   * Disconnects from MongoDB and updates the connection status flag.
   * Only attempts disconnection if the connection is active.
   *
   * @async
   * @returns {Promise<void>}
   * @throws {Error} Exits process if disconnection fails
   *
   * @example
   * await db.disconnect();
   */
  async disconnect(): Promise<void> {
    try {
      if (this.isConnected && this.connection) {
        // Disconnect from MongoDB
        await mongoose.disconnect();

        // Update connection status
        this.isConnected = false;
        this.connection = null;

        console.log("Database disconnected successfully!");
      }
    } catch (error) {
      // Log the error and exit process
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("An error occurred while disconnecting from database:", errorMessage);

      process.exit(1);
    }
  }

  /**
   * Retrieves the current connection status
   *
   * @returns {boolean} True if connected, false otherwise
   *
   * @example
   * const isConnected = db.getConnectionStatus();
   * if (isConnected) {
   *   console.log("Database is ready");
   * }
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Retrieves the Mongoose connection instance
   *
   * Returns the active Mongoose connection object for advanced operations.
   *
   * @returns {Connection | null} Active Mongoose connection or null if not connected
   *
   * @example
   * const conn = db.getConnection();
   * if (conn) {
   *   // Use connection for custom operations
   * }
   */
  getConnection(): Connection | null {
    return this.connection;
  }
}

// ==================== Export ====================

/**
 * Singleton instance of DatabaseConnection
 * Used throughout the application for all database operations
 */
export default new DatabaseConnection();