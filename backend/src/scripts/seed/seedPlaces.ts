/**
 * @fileoverview Database Seeding Script for Places Collection
 *
 * Populates the MongoDB database with initial place data (hostels, cafés,
 * apartments, camping sites). This script is intended for development and
 * testing environments to establish baseline data.
 *
 * Architecture: Uses OOP with clear separation between data, database operations,
 * and orchestration. Enables testing, reusability, and easy modification of seed data.
 *
 * Usage: npm run seed:places
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Place from "../../models/Place.js";

dotenv.config();

/* ============================= TYPE DEFINITIONS ============================= */

/**
 * Represents a place/accommodation/venue entry.
 * This interface enforces that all places have required fields and
 * provides type safety throughout the seeding process.
 */
interface IPlaceData {
  name: string;
  city: string;
  rating: number;
  reviews: number;
  verified: boolean;
  category: "Hostel" | "Café" | "Apartment" | "Camp";
  image: string;
  description: string;
}

/**
 * Represents the raw place data with temporary ID field.
 * The ID is temporary (used during data organization) and removed before insertion.
 * This prevents MongoDB from storing our arbitrary IDs.
 */
interface IRawPlaceData extends IPlaceData {
  id: number;
}

/* ============================= PLACE SEED DATA ============================= */

/**
 * @class PlaceSeedDataProvider
 *
 * Manages all place seed data in a centralized location.
 * This class encapsulates the dataset to:
 * 1. Make data easy to find and modify
 * 2. Support different data sets for different environments (dev, staging, etc.)
 * 3. Enable validation of data before insertion
 *
 * Why separate class: Decouples data from logic. If seed data changes,
 * we only update this class. If seeding logic changes, database operations
 * remain unaffected.
 */
class PlaceSeedDataProvider {
  /**
   * Comprehensive list of travel places with practical safety,
   * accessibility, and community features for solo/female travelers.
   *
   * Data includes:
   * - Diverse categories (hostels, cafés, apartments, camps)
   * - Various Indian cities to test geomapping features
   * - Mix of verified and unverified places (reflects real-world data)
   * - Ratings and review counts for filtering tests
   */
  private static readonly PLACES_DATA: IRawPlaceData[] = [
    // Women-focused hostels: Private safety features, community spaces
    {
      id: 1,
      name: "Zostel Women's Hostel",
      city: "Pune, India",
      rating: 4.8,
      reviews: 124,
      verified: true,
      category: "Hostel",
      image:
        "https://media.cnn.com/api/v1/images/stellar/prod/140127103345-peninsula-shanghai-deluxe-mock-up.jpg?q=w_2226,h_1449,x_0,y_0,c_fill",
      description:
        "Secure women-only hostel with keypad entry, workspace, and community meetups.",
    },
    {
      id: 2,
      name: "SafeStay Women Hostel",
      city: "Delhi, India",
      rating: 4.7,
      reviews: 201,
      verified: true,
      category: "Hostel",
      image: "https://journeywoman.com/wp-content/uploads/2017/07/hotel-safety-tip.jpg",
      description:
        "Women-only hostel with fingerprint access, reading areas, and shared kitchen.",
    },
    {
      id: 3,
      name: "PinkNest Ladies Hostel",
      city: "Jaipur, India",
      rating: 4.6,
      reviews: 158,
      verified: false,
      category: "Hostel",
      image: "https://media.istockphoto.com/id/1151357999/photo/beautiful-woman-laying-and-enjoying-breakfast-in-bed.jpg?s=612x612&w=0&k=20&c=vvu09PfKJ5VeL6DFI6PqxO27aLmNWNqC9rM7hV4PIGo=",
      description:
        "Friendly community hostel for women with cultural events and shared workspace.",
    },
    {
      id: 4,
      name: "Urban Oasis Co-Hostel",
      city: "Hyderabad, India",
      rating: 4.5,
      reviews: 142,
      verified: true,
      category: "Hostel",
      image: "https://gos3.ibcdn.com/a668156276d611e98b8c0242ac110008.jpg",
      description:
        "Comfortable modern women's hostel with gym, cafe lounge, and lockers.",
    },
    {
      id: 5,
      name: "CoLive Women's Co-Residence",
      city: "Bangalore, India",
      rating: 4.5,
      reviews: 152,
      verified: true,
      category: "Hostel",
      image:
        "https://preferredrate.com/wp-content/uploads/2021/10/blog_blue-home-evening-1.jpg",
      description:
        "Modern co-living room for women with coworking desks, community kitchen and gym.",
    },

    // Remote-work friendly cafés: Workspace, Wi-Fi, peaceful environments
    {
      id: 6,
      name: "Blue Lagoon Café",
      city: "Manali, India",
      rating: 4.7,
      reviews: 89,
      verified: false,
      category: "Café",
      image:
        "https://i.pinimg.com/474x/74/80/b2/7480b2bab89c9f6d39cdbf658c59c872.jpg",
      description:
        "Mountain view café with Wi-Fi, cozy seating, and a remote-work friendly atmosphere.",
    },
    {
      id: 7,
      name: "Soul Brew Café",
      city: "Goa, India",
      rating: 4.8,
      reviews: 301,
      verified: true,
      category: "Café",
      image: "https://cdn.prod.website-files.com/60414b21f1ffcdbb0d5ad688/656794b84c74fd60a580c975_sincerely-media-VNsdEl1gORk-unsplash.jpg",
      description:
        "Beachside café with journaling corners, soft music, and amazing cold coffee.",
    },
    {
      id: 8,
      name: "The Cloud Café",
      city: "Shimla, India",
      rating: 4.6,
      reviews: 97,
      verified: false,
      category: "Café",
      image:
        "https://m.media-amazon.com/images/I/71njsLSyMvL._AC_UF894,1000_QL80_.jpg",
      description:
        "Rooftop café offering mountain views, live music and silent reading corners.",
    },
    {
      id: 9,
      name: "Quiet Corner Workspace Café",
      city: "Kolkata, India",
      rating: 4.7,
      reviews: 192,
      verified: false,
      category: "Café",
      image: "https://www.ceebeedesignstudio.com/assets/img/blog/blog-21/best-interiors-in-bangalore-25-11-2024.jpg",
      description:
        "A peaceful café for remote workers with fast Wi-Fi and phone-free zones.",
    },

    // Serviced apartments: Privacy, security, amenities for longer stays
    {
      id: 10,
      name: "Sea Breeze Resort Apartments",
      city: "Goa, India",
      rating: 4.9,
      reviews: 231,
      verified: true,
      category: "Apartment",
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/49/63/a9/sea-breeze-hotel-apartments.jpg?w=900&h=-1&s=1",
      description:
        "Beachfront serviced apartments with CCTV, private balcony, and digital room locks.",
    },
    {
      id: 11,
      name: "HerSpace Urban Studio",
      city: "Mumbai, India",
      rating: 4.9,
      reviews: 420,
      verified: true,
      category: "Apartment",
      image:
        "https://onekindesign.com/wp-content/uploads/2018/08/Built-In-Window-Seats-Capturing-Ocean-Views-08-1-Kindesign.jpg",
      description:
        "Ideal for solo women with secured entry, sea-facing windows and workspace setup.",
    },
    {
      id: 12,
      name: "Serene Heights Studio",
      city: "Chandigarh, India",
      rating: 4.8,
      reviews: 88,
      verified: true,
      category: "Apartment",
      image: "https://www.dc.umich.edu/wp-content/uploads/sites/487/2023/07/StudioB_HDR-1200x800.jpg",
      description:
        "Compact and secure independent studio for female travelers and remote workers.",
    },
    {
      id: 13,
      name: "Palm Residency Flats",
      city: "Chennai, India",
      rating: 4.6,
      reviews: 133,
      verified: false,
      category: "Apartment",
      image: "https://housing.com/news/wp-content/uploads/2024/01/Flats-vs-compressed-1.jpg",
      description:
        "Serviced apartment with safety alarms, private kitchenette and workspace.",
    },

    // Nature camps: Adventure, guided activities, safety protocols
    {
      id: 14,
      name: "SkyHill Camping Retreat",
      city: "Rishikesh, India",
      rating: 4.6,
      reviews: 178,
      verified: true,
      category: "Camp",
      image: "https://visitkochijapan.com/image/rendering/attraction_image/1832/trim.900/3/2?v=9b2f80ae9ae6bd7dfbdcd0f2bb9f6c99687becdf",
      description:
        "Safe riverside camp with guided trekking, yoga spaces, and bonfire nights.",
    },
    {
      id: 15,
      name: "Forest Haven Eco-Camp",
      city: "Munnar, India",
      rating: 4.8,
      reviews: 261,
      verified: true,
      category: "Camp",
      image: "https://images.unsplash.com/photo-1533575770077-052fa2c609fc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9yZXN0JTIwY2FtcHxlbnwwfHwwfHx8MA%3D%3D",
      description:
        "Nature escape with guided hikes, meditation deck, and women-only zones.",
    },
    {
      id: 16,
      name: "Moonlight Adventure Camp",
      city: "Kedarnath, India",
      rating: 4.6,
      reviews: 120,
      verified: false,
      category: "Camp",
      image: "https://i.redd.it/h0am54nruec01.jpg",
      description:
        "Adventure camping with safety protocols, bonfire, and mountain-view tents.",
    },
  ];

  /**
   * Retrieves the seed data, removing temporary ID fields (which are used for
   * organization but should not be persisted to MongoDB).
   *
   * Why separate method: Allows validation or transformation of data before
   * use. If we need to filter or enrich data in the future, we do it here.
   *
   * @returns {IPlaceData[]} Place data without temporary ID fields
   */
  static getPlacesData(): IPlaceData[] {
    return this.PLACES_DATA.map((placeWithId) => {
      // Destructure to remove the temporary ID field
      const { id, ...placeDataWithoutId } = placeWithId;
      return placeDataWithoutId;
    });
  }

  /**
   * Returns the total count of seed places.
   * Useful for logging and verification purposes.
   *
   * @returns {number} Total number of places in seed data
   */
  static getPlaceCount(): number {
    return this.PLACES_DATA.length;
  }
}

/* ============================= DATABASE CONNECTION ============================= */

/**
 * @class DatabaseConnection
 *
 * Manages MongoDB connection lifecycle.
 * Encapsulates connection logic to:
 * 1. Handle connection errors gracefully
 * 2. Support different MongoDB URIs (dev, staging, production)
 * 3. Enable connection retries or pooling
 * 4. Centralize connection configuration
 *
 * Why separate class: Database operations should be delegated to a single
 * responsible class. Makes connection handling testable and reusable across scripts.
 */
class DatabaseConnection {
  private mongoUri: string;

  constructor(mongoUri: string) {
    // Fail fast if MongoDB URI is not configured
    if (!mongoUri || mongoUri.length === 0) {
      throw new Error("MONGO_URI environment variable is not configured");
    }
    this.mongoUri = mongoUri;
  }

  /**
   * Establishes connection to MongoDB.
   *
   * Why separate method: Connection is an async operation that may fail.
   * Extracting it allows callers to handle connection errors specifically.
   *
   * @throws {Error} If connection fails
   */
  async connect(): Promise<void> {
    try {
      await mongoose.connect(this.mongoUri);
    } catch (error) {
      throw new Error(
        `Failed to connect to MongoDB at ${this.mongoUri}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Closes MongoDB connection.
   *
   * Why separate method: Always disconnect after seeding to free resources.
   * Enables proper cleanup in success or failure scenarios.
   *
   * @throws {Error} If disconnection fails
   */
  async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
    } catch (error) {
      throw new Error(
        `Failed to disconnect from MongoDB: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

/* ============================= SEEDING SERVICE ============================= */

/**
 * @class PlaceSeeder
 *
 * Orchestrates the complete seeding process:
 * 1. Clear existing data (important for idempotency)
 * 2. Insert new seed data
 * 3. Report results
 *
 * Why service class: Isolates seeding logic from Express/HTTP. Enables
 * reuse in other contexts (testing, migration scripts, etc.) and makes
 * the logic testable without database access in unit tests.
 */
class PlaceSeeder {
  private databaseConnection: DatabaseConnection;
  private seedDataProvider: typeof PlaceSeedDataProvider;

  constructor(
    databaseConnection: DatabaseConnection,
    seedDataProvider: typeof PlaceSeedDataProvider
  ) {
    this.databaseConnection = databaseConnection;
    this.seedDataProvider = seedDataProvider;
  }

  /**
   * Clears all existing places from the database.
   *
   * Why separate method: Data deletion is a distinct operation that may be
   * called independently. Enables reuse and testing of deletion logic.
   *
   * Why log count: Helps verify data was actually deleted and informs user
   * of the seeding scope.
   *
   * @returns {Promise<number>} Number of documents deleted
   * @throws {Error} If deletion fails
   */
  private async deleteExistingPlaces(): Promise<number> {
    try {
      const deletionResult = await Place.deleteMany({});
      return deletionResult.deletedCount || 0;
    } catch (error) {
      throw new Error(
        `Failed to delete existing places: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Inserts seed data into the database.
   *
   * Why separate method: Data insertion is a distinct operation. Enables
   * insertion strategy changes (bulk insert, streaming, etc.) without
   * affecting caller code.
   *
   * @param {IPlaceData[]} placesData - Places to insert
   * @returns {Promise<number>} Number of documents inserted
   * @throws {Error} If insertion fails
   */
  private async insertPlacesData(placesData: IPlaceData[]): Promise<number> {
    try {
      const insertionResult = await Place.insertMany(placesData);
      return insertionResult.length;
    } catch (error) {
      throw new Error(
        `Failed to insert places: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Executes the complete seeding process.
   *
   * Why orchestration method: Coordinates multiple operations (connect,
   * delete, insert, disconnect) in proper sequence. Callers don't need
   * to know the details of the seeding process.
   *
   * @returns {Promise<void>}
   * @throws {Error} If any step fails
   */
  async seed(): Promise<void> {
    try {
      // Step 1: Establish database connection
      console.log("📡 Connecting to MongoDB...");
      await this.databaseConnection.connect();
      console.log("✅ Connected to MongoDB");

      // Step 2: Get seed data
      const placesData = this.seedDataProvider.getPlacesData();
      const totalPlaces = this.seedDataProvider.getPlaceCount();
      console.log(`📦 Loaded ${totalPlaces} places for seeding`);

      // Step 3: Delete existing data (important for idempotency)
      console.log("🗑️  Clearing existing places...");
      const deletedCount = await this.deleteExistingPlaces();
      console.log(`✅ Deleted ${deletedCount} existing places`);

      // Step 4: Insert seed data
      console.log("🌱 Seeding new places...");
      const insertedCount = await this.insertPlacesData(placesData);
      console.log(`✅ Inserted ${insertedCount} places`);

      console.log("🚀 Database seeding completed successfully!");
    } finally {
      // Always disconnect, even if an error occurred
      await this.databaseConnection.disconnect();
    }
  }
}

/* ============================= MAIN ENTRY POINT ============================= */

/**
 * Main execution function.
 *
 * Why separate function: Enables error handling and clean exit codes.
 * Callers can await seedDatabase() or handle the promise appropriately.
 *
 * @returns {Promise<void>}
 */
async function seedDatabase(): Promise<void> {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error(
        "MONGO_URI environment variable is missing. Check your .env file."
      );
    }

    const databaseConnection = new DatabaseConnection(mongoUri);
    const seeder = new PlaceSeeder(databaseConnection, PlaceSeedDataProvider);

    await seeder.seed();
  } catch (error) {
    console.error(
      "❌ Seeding failed:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }

  process.exit(0);
}

// Execute seed script
seedDatabase();
