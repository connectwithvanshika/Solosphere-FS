import dotenv from "dotenv";

// Load environment variables from .env file at startup
// Why at very top: Must load before ANY imports that access process.env
// This ensures db.ts and other modules can read environment variables when they load
dotenv.config({
  path: "./.env",
});

import { Express } from "express";
import { createApp } from "./app.js";
import db from "./config/db.js";

/**
 * Server configuration interface
 * Defines runtime settings for the server
 */
interface ServerConfiguration {
  port: number;
  environment: "development" | "production" | "test";
  isDatabaseRequired: boolean;
}

/**
 * ServerManager orchestrates application startup, database connection, and server lifecycle
 * 
 * Why separate server manager from app:
 * - Application configuration is independent of server startup concerns
 * - Enables testing the app without starting a server or connecting to database
 * - Allows the app to be used in serverless environments (no server.listen needed)
 * - Follows Single Responsibility Principle (app = config, server = startup)
 * - Makes it easy to run different server instances (cluster, worker processes)
 * 
 * Architectural Pattern:
 * ServerManager -> bootstrapApplication() -> ApplicationBootstrapper -> Express App
 * This layered approach allows testing at each level independently
 */
class ServerManager {
  /**
   * Express application instance
   * 
   * Why private:
   * - Prevents external code from modifying the app after startup
   * - Forces use of public methods for any needed operations
   * - Encapsulates the app lifecycle within ServerManager
   * 
   * @private
   */
  private expressApp: Express | null = null;

  /**
   * Server configuration
   * 
   * Why stored as property:
   * - Accessible for logging and debugging
   * - Can be checked at runtime for conditional behavior
   * - Makes configuration explicit and auditable
   * 
   * @private
   */
  private config: ServerConfiguration;

  /**
   * HTTP server instance after listening
   * 
   * Why track the server:
   * - Needed for graceful shutdown
   * - Allows getting the actual port if OS assigned one
   * - Enables close() operation to free resources
   * 
   * @private
   */
  private httpServer: ReturnType<Express["listen"]> | null = null;

  /**
   * Initialize ServerManager with environment configuration
   * 
   * Why load dotenv in module level:
   * - Environment variables must be available before config is set
   * - Centralizes configuration loading at application start
   * - Allows environment-specific behavior
   */
  constructor() {
    // Validate required environment variables exist
    // Why validate: Prevents cryptic errors later when undefined vars are accessed
    // Fails fast with clear error messages about what's missing
    const mongoDbUri = process.env.MONGODB_URI;
    const nodeEnv = process.env.NODE_ENV || "development";
    const jwtSecret = process.env.JWT_SECRET;

    if (!mongoDbUri || mongoDbUri.trim() === "") {
      throw new Error("❌ MONGODB_URI is not defined or is empty in .env file");
    }

    if (!jwtSecret || jwtSecret.trim() === "") {
      throw new Error("❌ JWT_SECRET is not defined or is empty in .env file");
    }

    // Build server configuration from environment variables
    this.config = {
      port: parseInt(process.env.PORT || "5001", 10),
      environment: nodeEnv as "development" | "production" | "test",
      isDatabaseRequired: nodeEnv !== "test",
    };

    // Log configuration on startup
    // Why log: Helps verify correct environment is loaded
    console.log(`📋 Server running in ${this.config.environment} mode on port ${this.config.port}`);
  }

  /**
   * Initializes the Express application
   * 
   * Why separate initialization step:
   * - Application setup may have failures (missing routes, etc)
   * - Allows logging the initialization process
   * - Makes it explicit when app is ready vs when server is listening
   * - Enables testing app setup independently
   * 
   * Why not in constructor:
   * - Constructor should be lightweight and synchronous
   * - Application setup is complex enough to warrant its own method
   * - Allows error handling at startup step level
   * 
   * @private
   * @returns {Promise<void>}
   * @throws Error if application initialization fails
   */
  private async initializeApplication(): Promise<void> {
    try {
      this.expressApp = createApp();
      this.logStartupMessage("Application initialized successfully");
    } catch (error) {
      // Log detailed error for debugging
      // Why catch here: Allows graceful error handling before server starts
      console.error("Application initialization failed:", error);
      throw error;
    }
  }

  /**
   * Connects to MongoDB database
   * 
   * Why separate method:
   * - Database connection is I/O operation (async)
   * - Can fail independently from app setup
   * - Allows conditional connection in test environment
   * - Makes database lifecycle explicit and testable
   * 
   * Why check isDatabaseRequired:
   * - Test environment may use in-memory database
   * - Allows different configurations per environment
   * - Prevents unnecessary connection attempts
   * 
   * @private
   * @returns {Promise<void>}
   * @throws Error if database connection fails
   */
  private async connectDatabase(): Promise<void> {
    if (!this.config.isDatabaseRequired) {
      this.logStartupMessage("Database connection skipped (test environment)");
      return;
    }

    try {
      await db.connect();
      this.logStartupMessage("Database connected successfully");
    } catch (error) {
      // Log detailed error - database connection is critical
      // Why catch here: Application cannot function without database
      console.error("Database connection failed:", error);
      throw error;
    }
  }

  /**
   * Validates that the server is ready to start
   * 
   * Why validation step:
   * - Catches configuration issues before listening on port
   * - Makes startup requirements explicit
   * - Prevents server from running with missing dependencies
   * 
   * @private
   * @returns {void}
   * @throws Error if validation fails
   */
  private validateStartupRequirements(): void {
    // Verify application was initialized
    // Why check: Indicates initializeApplication() was called
    if (!this.expressApp) {
      throw new Error("Application not initialized. Call bootstrap() first.");
    }

    // Verify port is valid number
    // Why check: Invalid port prevents server from starting
    if (typeof this.config.port !== "number" || this.config.port < 1 || this.config.port > 65535) {
      throw new Error(`Invalid port number: ${this.config.port}. Must be between 1 and 65535.`);
    }
  }

  /**
   * Starts the HTTP server on configured port
   * 
   * Why separate start method:
   * - May be called multiple times with different configurations
   * - Allows graceful shutdown and restart
   * - Makes server lifecycle explicit in code
   * 
   * Why Render needs this:
   * - Serverless/container platforms require app.listen()
   * - Port must be dynamically assigned from environment
   * - Server must log startup to container logs
   * 
   * @private
   * @returns {Promise<void>}
   * @throws Error if server fails to start
   */
  private async startServer(): Promise<void> {
    try {
      this.validateStartupRequirements();

      // Start HTTP server on configured port
      // Why Promise wrapper: app.listen is callback-based, Promise is modern async/await pattern
      // Allows cleanup and error handling without callbacks
      return new Promise((resolve, reject) => {
        this.httpServer = this.expressApp!.listen(this.config.port, () => {
          this.logStartupMessage(`🚀 Server running at: http://localhost:${this.config.port}`);
          this.logStartupMessage(`Environment: ${this.config.environment}`);
          resolve();
        });

        // Handle server startup errors
        // Why error handler: Catches errors from listen() like EADDRINUSE (port in use)
        this.httpServer.on("error", (error: Error) => {
          console.error("Server startup failed:", error);
          reject(error);
        });
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      throw error;
    }
  }

  /**
   * Logs a startup message with consistent formatting
   * 
   * Why separate logging method:
   * - Centralizes log format (emoji and prefix)
   * - Easy to modify log format later (file logging, structured logs)
   * - Startup logs are important for deployment verification
   * 
   * @private
   * @param message - Message to log
   * @returns {void}
   */
  private logStartupMessage(message: string): void {
    console.log(`[Startup] ${message}`);
  }

  /**
   * Gracefully shuts down the server
   * 
   * Why graceful shutdown:
   * - Allows in-flight requests to complete
   * - Closes database connections cleanly
   * - Prevents data corruption from abrupt termination
   * - Essential for deployment rolling updates
   * 
   * Why public method:
   * - External code (signal handlers) needs to trigger shutdown
   * - Allows testing cleanup behavior
   * 
   * @public
   * @returns {Promise<void>}
   */
  public async shutdown(): Promise<void> {
    return new Promise((resolve) => {
      if (this.httpServer) {
        this.logStartupMessage("🛑 Shutting down server gracefully...");

        // Stop accepting new connections
        // Why close: Prevents new requests while finishing current ones
        this.httpServer.close(async () => {
          // Close database connection
          // Why disconnect: Releases connection pool, preventing resource leak
          try {
            await db.disconnect();
            this.logStartupMessage("✅ Graceful shutdown complete");
            process.exit(0);
          } catch (error) {
            console.error("❌ Error during shutdown:", error);
            process.exit(1);
          }
        });

        // Force shutdown after timeout
        // Why timeout: Prevents hanging forever if requests don't complete
        // 30 seconds is typical graceful shutdown window
        setTimeout(() => {
          console.error("❌ Graceful shutdown timeout. Force closing...");
          process.exit(1);
        }, 30000);
      } else {
        resolve();
      }
    });
  }

  /**
   * Orchestrates the complete server startup sequence
   * 
   * Why orchestration method:
   * - Defines the correct order of operations
   * - App must initialize before database connects
   * - Database must connect before server starts listening
   * - Makes startup flow explicit and clear
   * 
   * Why async:
   * - Database connection is I/O bound
   * - Server listen is async
   * - Single async flow is cleaner than callback chains
   * 
   * @public
   * @returns {Promise<Express>} The configured Express application
   * @throws Error if any startup step fails
   */
  public async start(): Promise<Express> {
    try {
      this.logStartupMessage("Starting Solosphere backend server...");

      // Step 1: Initialize Express application with middleware and routes
      // Why first: App setup is synchronous, should happen before I/O
      await this.initializeApplication();

      // Step 2: Connect to MongoDB
      // Why second: Database must be available before server handles requests
      await this.connectDatabase();

      // Step 3: Start HTTP server
      // Why last: Only listen on port after everything else is ready
      await this.startServer();

      // Setup signal handlers for graceful shutdown
      // Why SIGTERM: Container platforms send this signal for shutdown
      // Why SIGINT: Development users send this with Ctrl+C
      this.setupSignalHandlers();

      return this.expressApp as Express;
    } catch (error) {
      console.error("❌ Server startup failed. Exiting.", error);
      process.exit(1);
    }
  }

  /**
   * Registers signal handlers for graceful shutdown
   * 
   * Why signal handlers:
   * - Docker/Kubernetes send SIGTERM on shutdown
   * - Development sends SIGINT on Ctrl+C
   * - Ensures cleanup happens before process exits
   * 
   * @private
   * @returns {void}
   */
  private setupSignalHandlers(): void {
    // Handle termination signal from deployment platforms
    // Why SIGTERM: Standard termination signal for containers
    process.on("SIGTERM", async () => {
      console.log("📨 SIGTERM signal received: closing HTTP server");
      await this.shutdown();
    });

    // Handle interrupt signal from development environment
    // Why SIGINT: Ctrl+C in terminal sends SIGINT
    process.on("SIGINT", async () => {
      console.log("📨 SIGINT signal received: closing HTTP server");
      await this.shutdown();
    });
  }
}

/**
 * Application entry point
 * 
 * Why global execution:
 * - Module is immediately executed when imported
 * - Server starts without needing to call a function
 * - Matches Express convention and deployment platform expectations
 * 
 * Why check NODE_ENV:
 * - Prevents server startup during imports in test files
 * - Allows importing app.ts for testing without side effects
 */
if (process.env.NODE_ENV !== "test") {
  const serverManager = new ServerManager();

  // Start the server with error handling
  // Why try/catch: Ensures errors are logged and process exits cleanly
  serverManager.start().catch((error) => {
    console.error("❌ Fatal error during server startup:", error);
    process.exit(1);
  });
}

export default ServerManager;