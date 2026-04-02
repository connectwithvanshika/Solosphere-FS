import express, { Express, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import GlobalRouter from "./routes/GlobalRouter.js";

/**
 * CORS configuration interface
 * Defines allowed origins and request options for cross-origin requests
 */
interface CORSConfiguration {
  allowedOrigins: string[];
  credentials: boolean;
  methods: string[];
  allowedHeaders: string[];
}

/**
 * Creates and configures the Express application with middleware and routes
 * 
 * Why separate app configuration from server startup:
 * - Application configuration (middleware, routes) is independent of port/database
 * - Enables testing the Express app without starting a server
 * - Follows Single Responsibility Principle (setup vs. startup)
 * - Makes the app easily exportable for use in test suites or serverless environments
 * - Allows multiple server instances to share the same app configuration
 * 
 * @returns {Express} Configured Express application instance
 */
export const createApp = (): Express => {
  const app = express();

  // CORS configuration
  // Why explicit CORS setup:
  // - Frontend and backend hosted separately (different domains)
  // - Prevents unauthorized cross-origin requests from other domains
  // - Allows credentials (cookies, auth headers) in requests
  // - Restricts which HTTP methods are allowed from browser
  const corsConfiguration: CORSConfiguration = {
    allowedOrigins: [
      "http://localhost:5173",
      "https://solosphere-fs.vercel.app",
      "https://solosphere-fs-ycns.vercel.app",
      "https://solosphere-backend.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  const corsOptions: CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (mobile apps, Postman, curl requests)
      // Why this check: Backend services and CLI tools don't send Origin header
      if (!origin || corsConfiguration.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Reject requests from unauthorized origins
        // Why reject: Prevents CSRF and unauthorized API access
        callback(new Error(`CORS policy: ${origin} not allowed`));
      }
    },
    credentials: corsConfiguration.credentials,
    methods: corsConfiguration.methods,
    allowedHeaders: corsConfiguration.allowedHeaders,
  };

  // Enable CORS middleware
  // Why allowedOrigins whitelist:
  // - Blocks requests from malicious domains
  // - Localhost for development, production URLs for deployment
  // - Specific render.com and vercel.app URLs prevent subdomain attacks
  app.use(cors(corsOptions));

  // Configure JSON body parsing middleware
  // Why express.json() middleware:
  // - Automatically parses incoming request bodies with Content-Type: application/json
  // - Makes req.body available as parsed object (not raw buffer)
  // - Limits payload size by default to prevent DoS attacks
  app.use(express.json());

  // Register health check endpoint at root path
  // Why health check endpoint:
  // - Monitoring services need to verify server is running
  // - Load balancers use this to detect dead instances
  // - Simple way to test connectivity without auth
  // - Essential for deployment platforms (Render, Vercel)
  app.get("/", (req: Request, res: Response): void => {
    res.json({
      success: true,
      message: "Backend Running Successfully ✔️",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Register all API routes using GlobalRouter
  // Why GlobalRouter abstraction:
  // - Single source of truth for all API endpoints (visible in one file)
  // - Easy addition of new routes (just add to GlobalRouter array)
  // - Separates route registration from middleware configuration
  // - Enables cross-cutting concerns at route group level
  // - Cleaner app.ts: middleware setup separate from route registration
  const globalRouter = new GlobalRouter();
  globalRouter.registerRoutes(app);

  return app;
};

export default createApp;