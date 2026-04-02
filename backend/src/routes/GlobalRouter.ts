import { Express } from "express";

/**
 * API Route Interface
 * Defines structure for route modules with their mount path and handler
 */
interface APIRoute {
  path: string;
  handler: any; // Express Router instance
}

/**
 * GlobalRouter orchestrates all API route registration and management
 * 
 * Why a centralized router manager:
 * - Single source of truth for all API endpoints (no scattered route registration)
 * - Makes API structure immediately visible to developers
 * - Enables easy addition of new routes without modifying middleware setup
 * - Allows cross-cutting concerns (middleware, rate limiting per route group)
 * - Professional pattern used in large-scale applications (NestJS, Express best practices)
 * - Centralizes API documentation and endpoint organization
 * 
 * Why class-based approach:
 * - Encapsulates route registration logic
 * - Can be extended for features like versioning (/v1/api, /v2/api)
 * - Testable: can verify routes are registered correctly
 * - Enables dependency injection if routes need shared services
 * 
 * Architecture: GlobalRouter manages all routes → app.ts handles middleware → server.ts handles startup
 */
class GlobalRouter {
  /**
   * Array of registered API routes
   * 
   * Why store routes as array:
   * - Easy to iterate and register all at once
   * - Can be logged for debugging/documentation
   * - Enables future features like route validation, conflict detection
   * - Single source to add/remove endpoints
   * 
   * @private
   */
  private apiRoutes: APIRoute[];

  /**
   * Initialize GlobalRouter and define all API routes
   * 
   * Why initialize in constructor:
   * - Routes are defined when GlobalRouter is instantiated
   * - Ensures all routes are loaded before registration
   * - Lazy loading: routes only loaded when needed
   * 
   * Route organization:
   * Why prefix all routes with /api:
   * - Separates API routes from static files or other resources
   * - Enables easy versioning if needed (/api/v1, /api/v2)
   * - Clear distinction between UI and data endpoints
   * - Industry standard RESTful convention
   */
  constructor() {
    // Define all API routes with their paths and handlers
    // Why define here: Central location to see entire API structure at a glance
    this.apiRoutes = [
      {
        path: "/api/auth",
        handler: require("./authRoutes.ts").default,
        // Why separate auth:
        // - Different validation rules (email format, password requirements)
        // - Sensitive operations (password hashing, token generation)
        // - Different rate limiting needs (login attempts)
        // - Security-critical path that may need additional middleware
      },
      {
        path: "/api/posts",
        handler: require("./postRoutes.js").default,
        // Why separate posts:
        // - Different permissions model (users can only edit own posts)
        // - Possible caching strategy (recent posts cached)
        // - Different validation (content length limits)
        // - Social features (likes, comments)
      },
      {
        path: "/api/tips",
        handler: require("./tipsRoutes.js").default,
        // Why separate tips:
        // - Admin-only write operations (tips rarely updated)
        // - Possible aggressive caching (read-heavy, stable data)
        // - Public-facing data (no auth required for GET)
        // - Different performance requirements
      },
      {
        path: "/api/places",
        handler: require("./placesRoutes.js").default,
        // Why separate places:
        // - Bulk data operations (potentially large datasets)
        // - Geographic queries (location-based filtering)
        // - Possible database indexing specific to coordinates
        // - Reference data (rarely changes after initial load)
      },
      {
        path: "/api/emergency",
        handler: require("./emergencyRoutes.js").default,
        // Why separate emergency:
        // - Critical path (SOS features, safety-critical)
        // - Different rate limiting (may need higher limits for emergencies)
        // - Possible different logging/monitoring requirements
        // - May have different auth requirements (location sharing)
        // - Needs instant response (may bypass normal validation)
      },
      {
        path: "/api/companion",
        handler: require("./companionRoutes.js").default,
        // Why separate companion:
        // - Complex matching logic (finding compatible travel companions)
        // - Different permission model (match visibility, privacy)
        // - Possible notification requirements (new match alerts)
        // - Complex data relationships (preferences, past matches)
      },
    ];
  }

  /**
   * Registers all API routes on the provided Express application
   * 
   * Why this method:
   * - Single method call in app.ts replaces 6 separate route.use() calls
   * - Centralizes all route registration in one logical place
   * - Easy to add logging, validation, or middleware to all routes at once
   * - Separates route registration logic from middleware setup
   * 
   * Why iterate through apiRoutes:
   * - Dynamic registration makes adding new routes easier (just add to array)
   * - Enables future features like route validation or conflict detection
   * - Single source of truth for routes
   * 
   * @param app - Express application instance to register routes on
   * @returns {void}
   * 
   * @example
   * const globalRouter = new GlobalRouter();
   * globalRouter.registerRoutes(app);
   */
  public registerRoutes(app: Express): void {
    // Register each API route with its path
    // Why loop: Scalable approach vs. hardcoding 6 separate app.use() calls
    this.apiRoutes.forEach((route) => {
      // Validate route configuration before registering
      // Why validate: Catch configuration errors early (missing path, null handler)
      this.validateRouteConfiguration(route);

      // Register route with Express
      // app.use() mounts router at specified path
      app.use(route.path, route.handler);

      // Log route registration for startup visibility
      // Why log: Developers can see all registered routes on server startup
      console.log(`✓ Registered route: ${route.path}`);
    });

    this.logRouteSummary();
  }

  /**
   * Validates route configuration is correct before registration
   * 
   * Why validate:
   * - Catches configuration errors at startup (missing path, null handler)
   * - Prevents silent failures where routes don't work
   * - Provides clear error messages for debugging
   * - Ensures consistency of all routes
   * 
   * @private
   * @param route - Route configuration to validate
   * @throws Error if route configuration is invalid
   */
  private validateRouteConfiguration(route: APIRoute): void {
    // Validate path exists and is non-empty
    // Why check: Route needs a path to mount on
    if (!route.path || typeof route.path !== "string") {
      throw new Error(`❌ Invalid route path: ${route.path}. Must be a non-empty string.`);
    }

    // Validate handler exists
    // Why check: Route needs a handler (Express Router) to process requests
    if (!route.handler) {
      throw new Error(`❌ Missing route handler for path: ${route.path}`);
    }
  }

  /**
   * Logs a summary of all registered routes
   * 
   * Why log summary:
   * - Gives developers quick visual confirmation all routes loaded
   * - Helps with deployment verification
   * - Useful for documentation in logs
   * - Easy to spot missing routes at startup
   * 
   * @private
   * @returns {void}
   */
  private logRouteSummary(): void {
    console.log(`\n API Routes Summary:`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    this.apiRoutes.forEach((route) => {
      console.log(`  ${route.path}`);
    });
    console.log(`Total routes registered: ${this.apiRoutes.length}\n`);
  }

  /**
   * Returns the list of registered routes
   * 
   * Why provide getter:
   * - Allows external code to inspect registered routes
   * - Useful for testing and documentation
   * - Enables future features like route listing endpoint
   * 
   * @returns {APIRoute[]} Array of all registered routes
   */
  public getRegisteredRoutes(): APIRoute[] {
    return this.apiRoutes;
  }

  /**
   * Checks if a route with given path is registered
   * 
   * Why this helper:
   * - Useful for testing and validation
   * - Can detect duplicate route registration
   * - Enables conditional middleware application
   * 
   * @param path - Route path to check
   * @returns {boolean} True if route with given path is registered
   */
  public hasRoute(path: string): boolean {
    return this.apiRoutes.some((route) => route.path === path);
  }
}

/**
 * Factory function to create GlobalRouter instance
 * 
 * Why factory function:
 * - Cleaner than "new GlobalRouter()" in app.ts
 * - Allows future initialization logic (dependency injection, middleware setup)
 * - Consistent with createApp() pattern
 * 
 * @returns {GlobalRouter} Configured GlobalRouter instance
 */
export const createGlobalRouter = (): GlobalRouter => {
  return new GlobalRouter();
};

export default GlobalRouter;