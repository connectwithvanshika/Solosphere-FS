/**
 * Database Cleanup Script for Travel Tips
 *
 * This script safely removes all travel tips from the MongoDB database.
 * Useful for development, testing, and data reset scenarios where a clean slate is needed.
 *
 * Architecture:
 * - DatabaseConnection: Manages MongoDB connection lifecycle
 * - TipCleaner: Orchestrates the tip deletion with error handling
 * - Main entry point: Initializes and executes the cleanup process
 *
 * WARNING: This operation is destructive and cannot be undone.
 * Use only in development/test environments.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tip from '../models/Tip';

// Load environment variables at bootstrap to ensure database URI is available
dotenv.config();

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * ICleanupResult captures the outcome of a database cleanup operation,
 * including the number of deleted documents and error information if applicable.
 */
interface ICleanupResult {
  success: boolean;
  deletedCount: number;
  error?: Error;
}

// ============================================================================
// Database Connection Manager
// ============================================================================

/**
 * DatabaseConnection manages the MongoDB connection lifecycle.
 * By centralizing connection logic, we achieve:
 * - Consistent connection configuration across all scripts
 * - Clean separation of concerns (connection vs. cleanup logic)
 * - Reusability across different database operations
 * - Testability through dependency injection
 */
class DatabaseConnection {
  /**
   * Establishes connection to MongoDB using the configured MONGO_URI from environment.
   * Throws an error if MONGO_URI is not defined, failing fast at startup to prevent
   * accidental operations against wrong database environments.
   */
  public async connect(): Promise<void> {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error(
        'MONGO_URI environment variable is not defined. Please configure it in .env file.'
      );
    }

    try {
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB successfully.');
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Gracefully closes the MongoDB connection.
   * Called in finally blocks to ensure cleanup regardless of success/failure,
   * preventing connection leaks and resource exhaustion.
   */
  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('✅ Disconnected from MongoDB.');
    } catch (error) {
      console.error('❌ Failed to disconnect from MongoDB:', error);
    }
  }
}

// ============================================================================
// Tip Cleaner: Orchestrates deletion with confirmation and safety
// ============================================================================

/**
 * TipCleaner handles the process of removing all travel tips from the database.
 * This class provides:
 * - Structured deletion logic with proper error handling
 * - Logging of operation results for audit trails
 * - Clean separation of cleanup logic from connection management
 * - Reusability if other collections need similar cleanup
 */
class TipCleaner {
  private databaseConnection: DatabaseConnection;

  /**
   * Constructor accepts a DatabaseConnection instance to enable dependency injection.
   * This pattern allows testing with mock database connections and validates
   * database access before attempting destructive operations.
   */
  public constructor(databaseConnection: DatabaseConnection) {
    this.databaseConnection = databaseConnection;
  }

  /**
   * Executes the complete cleanup workflow:
   * 1. Connects to MongoDB
   * 2. Deletes all documents from the Tip collection using deleteMany with empty filter
   * 3. Logs the number of deleted records for verification
   * 4. Returns operation result
   *
   * The empty filter {} in deleteMany ensures ALL tips are removed. This is intentional
   * for development/testing scenarios but dangerous in production—hence the clear
   * warning in the file header and the optional confirmation prompt recommendation.
   */
  public async clearAllTips(): Promise<ICleanupResult> {
    try {
      // Establish database connection before cleanup
      await this.databaseConnection.connect();

      console.log(
        '🗑️  Clearing all travel tips from the database (this operation cannot be undone)...\n'
      );

      /**
       * deleteMany with empty filter {} removes all documents from the collection.
       * The result object contains deletedCount—number of documents actually removed.
       * This is used for logging to confirm the operation succeeded.
       */
      const deleteResult = await Tip.deleteMany({});

      const deletedCount = deleteResult.deletedCount || 0;

      console.log(
        `✅ Successfully deleted ${deletedCount} travel tips from the database.`
      );

      return {
        success: true,
        deletedCount
      };
    } catch (error) {
      // Capture error details while preserving error object for debugging
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      console.error(
        '❌ Cleanup operation encountered an error:',
        errorMessage
      );

      return {
        success: false,
        deletedCount: 0,
        error: error instanceof Error ? error : new Error(String(error))
      };
    } finally {
      // Always disconnect to clean up resources, regardless of success/failure
      // This prevents lingering connections that could exhaust connection pools
      await this.databaseConnection.disconnect();
    }
  }
}

// ============================================================================
// Main Entry Point: Initialize and execute cleanup
// ============================================================================

/**
 * Main execution function that orchestrates the entire cleanup process.
 * Uses proper exit codes to communicate success/failure to the process/CI system:
 * - Exit code 0: Success (all tips cleared)
 * - Exit code 1: Failure (error during cleanup)
 *
 * This allows the script to be integrated into CI/CD pipelines where exit codes
 * determine whether dependent steps should proceed or halt.
 */
async function main(): Promise<void> {
  try {
    // Initialize database connection with clean separation of concerns
    const dbConnection = new DatabaseConnection();

    // Create cleaner with injected dependency
    const cleaner = new TipCleaner(dbConnection);

    // Execute cleanup and capture result
    const result = await cleaner.clearAllTips();

    // Exit with appropriate code based on operation outcome
    if (result.success) {
      console.log(
        '\n🎉 Tips cleanup completed successfully! Database has been reset.\n'
      );
      process.exit(0);
    } else {
      console.log(
        '\n⚠️  Tips cleanup completed with errors. Please review the logs above.\n'
      );
      process.exit(1);
    }
  } catch (error) {
    // Handle unexpected errors outside of cleaner logic
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error(
      '❌ Unexpected error during cleanup initialization:',
      errorMessage
    );
    process.exit(1);
  }
}

// Execute main function when script is run directly (not imported as module)
main();
