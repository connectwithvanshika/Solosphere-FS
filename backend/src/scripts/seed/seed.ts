/**
 * Database Seeding Script for Travel Accommodation Listings
 *
 * This script seeds the MongoDB database with diverse travel accommodation options
 * including hostels, apartments, camps, and private stays across multiple Indian cities.
 *
 * Architecture:
 * - PlaceSeedDataProvider: Manages immutable seed data (19 accommodation listings)
 * - DatabaseConnection: Handles MongoDB connection lifecycle
 * - PlaceSeeder: Orchestrates seeding logic with statistics and error handling
 * - Main entry point: Initializes and executes the seeding process
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from '../../models/Post';

// Load environment variables at bootstrap to ensure database URI is available
dotenv.config({ path: './.env' });

// ============================================================================
// Type Definitions & Interfaces
// ============================================================================

/**
 * INightSafetyTags represents the safety attributes of an accommodation at night.
 * We track specific safety dimensions (lighting, crowd, security) separately rather than
 * a single score because different travelers prioritize different safety factors.
 */
interface INightSafetyTags {
  lighting: boolean;
  crowd: boolean;
  security: boolean;
}

/**
 * IAccommodation represents a complete accommodation listing in the Solosphere platform.
 * This structure ensures data consistency across all listings and enables
 * efficient filtering and searching by multiple criteria (category, city, rating).
 */
interface IAccommodation {
  title: string;
  description: string;
  rating: number;
  imageUrl: string;
  category: 'Hostel' | 'Apartment' | 'Camp' | 'Private Stay';
  city: string;
  tags: string[];
  guests: number;
  availableFrom: Date;
  availableTo: Date;
  nightSafetyScore?: number;
  nightSafetyTags?: INightSafetyTags;
  lat: number;
  lng: number;
}

/**
 * ISeededResult captures the outcome of seeding including counts by category
 * to provide visibility into what was actually inserted into the database.
 */
interface ISeededResult {
  success: boolean;
  totalInserted: number;
  categoryBreakdown: {
    hostels: number;
    apartments: number;
    camps: number;
    privateStays: number;
  };
  error?: Error;
}

// ============================================================================
// Seed Data Provider: Encapsulates all accommodation data
// ============================================================================

/**
 * PlaceSeedDataProvider maintains all authentic accommodation listings.
 * By centralizing seed data in a dedicated provider, we achieve:
 * - Single source of truth for seed content
 * - Data validation and consistency before insertion
 * - Easy maintenance and ability to add/modify listings
 * - Decoupling of data from seeding logic
 */
class PlaceSeedDataProvider {
  /**
   * Provides the complete array of 19 accommodation listings across 4 categories.
   * Data is organized by type (Hostels, Apartments, Camps, Private Stays) for clarity,
   * and each listing includes comprehensive metadata for filtering and discovery.
   *
   * Categories:
   * - Hostels: Shared spaces designed for budget-conscious travelers and community building
   * - Apartments: Private rental units for travelers seeking independence
   * - Camps: Outdoor experiences prioritizing nature immersion and adventure
   * - Private Stays: Intimate accommodations offering authentic local experiences
   */
  public static getAccommodationData(): IAccommodation[] {
    return [
      // ====================================================================
      // HOSTELS: Social spaces for budget travelers seeking community
      // ====================================================================
      {
        title: 'Zostel Goa',
        description: 'Popular backpacker hostel with beach access and nightlife nearby.',
        rating: 4.5,
        imageUrl:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        category: 'Hostel',
        city: 'Goa',
        tags: ['shared', 'community'],
        guests: 50,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        nightSafetyScore: 85,
        nightSafetyTags: { lighting: true, crowd: true, security: true },
        lat: 15.2993,
        lng: 74.124
      },
      {
        title: 'Moustache Hostel Jaipur',
        description: 'Rooftop views, cultural vibes, and community events.',
        rating: 4.6,
        imageUrl:
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
        category: 'Hostel',
        city: 'Jaipur',
        tags: ['shared', 'community'],
        guests: 40,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 26.9124,
        lng: 75.7873
      },
      {
        title: 'Women\'s Only Hostel Mumbai',
        description: 'Safe, secure accommodation exclusively for women travelers.',
        rating: 4.7,
        imageUrl:
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
        category: 'Hostel',
        city: 'Mumbai',
        tags: ['female-only', 'shared', 'community'],
        guests: 20,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        nightSafetyScore: 95,
        nightSafetyTags: { lighting: true, crowd: true, security: true },
        lat: 19.076,
        lng: 72.8777
      },
      {
        title: 'Backpacker\'s Den Manali',
        description: 'Budget-friendly hostel with mountain views and bonfire nights.',
        rating: 4.5,
        imageUrl:
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
        category: 'Hostel',
        city: 'Manali',
        tags: ['shared', 'community'],
        guests: 60,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 32.2396,
        lng: 77.1887
      },
      {
        title: 'Beachside Hostel Gokarna',
        description: 'Relaxed hostel steps from the beach with yoga sessions.',
        rating: 4.6,
        imageUrl:
          'https://cf.bstatic.com/xdata/images/hotel/max1024x768/612731999.jpg?k=a8dfe6a610273dd8e4b6501a1a897fc53c1cd6495f8f01da3f559fefb1911012&o=',
        category: 'Hostel',
        city: 'Gokarna',
        tags: ['shared', 'community'],
        guests: 45,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 14.5486,
        lng: 74.3189
      },
      {
        title: 'SheTravels Hostel Delhi',
        description: 'Vibrant hostel in South Delhi designed for female backpackers.',
        rating: 4.7,
        imageUrl:
          'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6',
        category: 'Hostel',
        city: 'Delhi',
        tags: ['female-only', 'shared', 'community'],
        guests: 35,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 28.5244,
        lng: 77.1855
      },
      {
        title: 'Nomad Hub Hostel',
        description: 'The ultimate co-living space for digital nomads.',
        rating: 4.5,
        imageUrl:
          'https://images.unsplash.com/photo-1520277739336-7bf67edfa768',
        category: 'Hostel',
        city: 'Bangalore',
        tags: ['shared', 'community', 'private'],
        guests: 60,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 12.9352,
        lng: 77.6245
      },

      // ====================================================================
      // APARTMENTS: Independent rental units for autonomous travelers
      // ====================================================================
      {
        title: 'Riverside Apartment Rishikesh',
        description: 'Peaceful apartment near the Ganges, perfect for yoga retreats.',
        rating: 4.6,
        imageUrl:
          'https://plus.unsplash.com/premium_photo-1676657955279-8fd22fbb75e0',
        category: 'Apartment',
        city: 'Rishikesh',
        tags: ['private'],
        guests: 4,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 30.0869,
        lng: 78.2676
      },
      {
        title: 'Cozy Apartment Delhi',
        description: 'Modern apartment in the heart of Delhi with metro access.',
        rating: 4.4,
        imageUrl:
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        category: 'Apartment',
        city: 'Delhi',
        tags: ['private'],
        guests: 3,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 28.7041,
        lng: 77.1025
      },
      {
        title: 'Urban Loft Bangalore',
        description: 'Stylish apartment in tech hub with coworking space nearby.',
        rating: 4.5,
        imageUrl:
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9',
        category: 'Apartment',
        city: 'Bangalore',
        tags: ['private'],
        guests: 2,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 12.9716,
        lng: 77.5946
      },
      {
        title: 'Sea View Flat Mumbai',
        description: 'High-rise apartment overlooking the Arabian Sea.',
        rating: 4.8,
        imageUrl:
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        category: 'Apartment',
        city: 'Mumbai',
        tags: ['private', 'female-only'],
        guests: 4,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 19.076,
        lng: 72.8777
      },
      {
        title: 'Heritage Home Kolkata',
        description: 'Vintage aesthetics with modern amenities in Salt Lake.',
        rating: 4.7,
        imageUrl:
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
        category: 'Apartment',
        city: 'Kolkata',
        tags: ['private', 'community'],
        guests: 5,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 22.5726,
        lng: 88.3639
      },
      {
        title: 'Writer\'s Retreat Apartment',
        description: 'Quiet, community-focused apartment complex for creatives.',
        rating: 4.6,
        imageUrl:
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
        category: 'Apartment',
        city: 'Shimla',
        tags: ['private', 'community'],
        guests: 4,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        nightSafetyScore: 80,
        nightSafetyTags: { lighting: true, crowd: false, security: true },
        lat: 30.1441,
        lng: 78.29661734
      },

      // ====================================================================
      // CAMPS: Outdoor experiences emphasizing nature and adventure
      // ====================================================================
      {
        title: 'Pangong Camp',
        description: 'Lakeside camping experience in Ladakh with stunning views.',
        rating: 4.9,
        imageUrl:
          'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d',
        category: 'Camp',
        city: 'Ladakh',
        tags: ['shared', 'community'],
        guests: 20,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 33.7782,
        lng: 78.9969
      },
      {
        title: 'Hampi Heritage Camp',
        description: 'Heritage camping near ancient ruins with guided tours.',
        rating: 4.7,
        imageUrl:
          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
        category: 'Camp',
        city: 'Hampi',
        tags: ['shared', 'community'],
        guests: 15,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 15.335,
        lng: 76.46
      },
      {
        title: 'Mountain View Camp Dharamshala',
        description: 'Peaceful camping spot with Himalayan views and trekking routes.',
        rating: 4.8,
        imageUrl:
          'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce',
        category: 'Camp',
        city: 'Dharamshala',
        tags: ['shared', 'community'],
        guests: 30,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 32.219,
        lng: 76.3234
      },
      {
        title: 'Desert Camp Jaisalmer',
        description: 'Traditional desert camping with camel safari and folk music.',
        rating: 4.9,
        imageUrl:
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
        category: 'Camp',
        city: 'Jaisalmer',
        tags: ['shared', 'community'],
        guests: 40,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 26.9157,
        lng: 70.9083
      },
      {
        title: 'Forest Haven Eco-Camp Munnar',
        description: 'Eco-friendly tents surrounded by tea plantations.',
        rating: 4.7,
        imageUrl:
          'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7',
        category: 'Camp',
        city: 'Munnar',
        tags: ['private', 'shared'],
        guests: 15,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        nightSafetyScore: 40,
        nightSafetyTags: { lighting: false, crowd: false, security: false },
        lat: 10.0867,
        lng: 77.04
      },
      {
        title: 'SafeGlamp Women\'s Camp',
        description: 'Exclusive women-only glamping experience with 24/7 security.',
        rating: 4.8,
        imageUrl:
          'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7',
        category: 'Camp',
        city: 'Rishikesh',
        tags: ['female-only', 'private', 'shared'],
        guests: 12,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        nightSafetyScore: 92,
        nightSafetyTags: { lighting: true, crowd: true, security: true },
        lat: 30.0869,
        lng: 78.2676
      },

      // ====================================================================
      // PRIVATE STAYS: Intimate accommodations offering authentic local experiences
      // ====================================================================
      {
        title: 'Blue Beach Hut',
        description: 'Private stay near Calangute Beach, perfect for solo travelers.',
        rating: 4.7,
        imageUrl:
          'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf',
        category: 'Private Stay',
        city: 'Goa',
        tags: ['private', 'female-only'],
        guests: 2,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 15.56,
        lng: 73.755
      },
      {
        title: 'Gokulam Private Stay',
        description: 'Traditional Kerala home with local family experience.',
        rating: 4.8,
        imageUrl:
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
        category: 'Private Stay',
        city: 'Kerala',
        tags: ['private', 'community'],
        guests: 3,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 10.8505,
        lng: 76.2711
      },
      {
        title: 'Sunset Villa Goa',
        description: 'Luxury private villa with pool and beach proximity.',
        rating: 4.9,
        imageUrl:
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
        category: 'Private Stay',
        city: 'Goa',
        tags: ['private'],
        guests: 6,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 15.4909,
        lng: 73.8278
      },
      {
        title: 'Zen Garden Cottage',
        description: 'Peaceful private stay offering meditation classes.',
        rating: 4.9,
        imageUrl:
          'https://images.unsplash.com/photo-1587061949409-02df41d5e562',
        category: 'Private Stay',
        city: 'Pondicherry',
        tags: ['private', 'female-only'],
        guests: 3,
        availableFrom: new Date('2024-01-01'),
        availableTo: new Date('2026-12-31'),
        lat: 11.9416,
        lng: 79.8083
      }
    ];
  }
}

// ============================================================================
// Database Connection Manager
// ============================================================================

/**
 * DatabaseConnection manages the MongoDB connection lifecycle.
 * Centralizing connection logic ensures:
 * - Consistent connection configuration across all scripts
 * - Clean separation between connection and seeding concerns
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
      console.log('🔥 Connected to MongoDB successfully.');
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
// Place Seeder: Orchestrates the seeding process
// ============================================================================

/**
 * PlaceSeeder orchestrates the complete seeding workflow including data insertion,
 * cleanup, and statistics collection. This class provides:
 * - Structured seeding process with error handling
 * - Data validation before insertion
 * - Statistical breakdown by accommodation category
 * - Audit logging for tracking operations
 */
class PlaceSeeder {
  private databaseConnection: DatabaseConnection;

  /**
   * Constructor accepts a DatabaseConnection instance to enable dependency injection.
   * This pattern allows testing with mock database connections and separation of concerns.
   */
  public constructor(databaseConnection: DatabaseConnection) {
    this.databaseConnection = databaseConnection;
  }

  /**
   * Executes the complete seeding workflow:
   * 1. Connects to MongoDB
   * 2. Clears all existing accommodations (idempotent operation)
   * 3. Inserts new accommodation data
   * 4. Calculates and logs statistics by category
   * 5. Returns operation result with breakdown
   *
   * We delete all existing data before insertion rather than using insertMany with
   * ordered:false because accommodations need to be fresh and curated, not merged with stale data.
   */
  public async seedAccommodations(): Promise<ISeededResult> {
    try {
      // Establish database connection before seeding
      await this.databaseConnection.connect();

      // Retrieve immutable seed data from provider
      const accommodationData = PlaceSeedDataProvider.getAccommodationData();

      console.log(
        `\n🌱 Starting accommodation seeding process. Clearing old data...\n`
      );

      /**
       * Delete all existing accommodations before insertion.
       * This ensures data consistency and prevents mixed/stale records from
       * previous seeding operations.
       */
      await Post.deleteMany({});
      console.log('🗑️  Old accommodation data cleared.');

      /**
       * Insert complete dataset in a single batch operation.
       * MongoDB insertMany automatically handles index constraints and returns
       * the count of successfully inserted documents.
       */
      const insertResult = await Post.insertMany(accommodationData);

      const totalInserted = insertResult.length;

      // Calculate category breakdown for audit visibility
      const categoryBreakdown = this.calculateCategoryBreakdown(
        accommodationData
      );

      console.log(
        `\n✅ Successfully seeded ${totalInserted} accommodations into the database.`
      );
      console.log(`\n📊 Category Breakdown:`);
      console.log(`   🏨 Hostels: ${categoryBreakdown.hostels}`);
      console.log(`   🏢 Apartments: ${categoryBreakdown.apartments}`);
      console.log(`   ⛺ Camps: ${categoryBreakdown.camps}`);
      console.log(`   🏡 Private Stays: ${categoryBreakdown.privateStays}`);
      console.log('\n✨ Seeding complete! Your database is ready.\n');

      return {
        success: true,
        totalInserted,
        categoryBreakdown
      };
    } catch (error) {
      // Capture error details while preserving error object
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      console.error('❌ Seeding process encountered an error:', errorMessage);

      return {
        success: false,
        totalInserted: 0,
        categoryBreakdown: {
          hostels: 0,
          apartments: 0,
          camps: 0,
          privateStays: 0
        },
        error: error instanceof Error ? error : new Error(String(error))
      };
    } finally {
      // Always disconnect to clean up resources, regardless of success/failure
      await this.databaseConnection.disconnect();
    }
  }

  /**
   * Calculates the breakdown of accommodations by category.
   * This method provides visibility into what was actually inserted,
   * helping to verify data integrity and completeness.
   */
  private calculateCategoryBreakdown(
    accommodations: IAccommodation[]
  ): {
    hostels: number;
    apartments: number;
    camps: number;
    privateStays: number;
  } {
    return {
      hostels: accommodations.filter(a => a.category === 'Hostel').length,
      apartments: accommodations.filter(a => a.category === 'Apartment').length,
      camps: accommodations.filter(a => a.category === 'Camp').length,
      privateStays: accommodations.filter(a => a.category === 'Private Stay')
        .length
    };
  }
}

// ============================================================================
// Main Entry Point: Initialize and execute seeding
// ============================================================================

/**
 * Main execution function that orchestrates the entire seeding process.
 * Uses proper exit codes to communicate success/failure to the process/CI system:
 * - Exit code 0: Success (all accommodations seeded)
 * - Exit code 1: Failure (error during seeding)
 *
 * This allows the script to be integrated into bash scripts and CI/CD pipelines
 * where exit codes determine whether dependent steps should proceed or halt.
 */
async function main(): Promise<void> {
  try {
    // Initialize database connection with clean separation of concerns
    const dbConnection = new DatabaseConnection();

    // Create seeder with injected dependency
    const seeder = new PlaceSeeder(dbConnection);

    // Execute seeding and capture result
    const result = await seeder.seedAccommodations();

    // Exit with appropriate code based on operation outcome
    if (result.success) {
      process.exit(0);
    } else {
      console.log(
        '\n⚠️  Accommodation seeding completed with errors. Please review the logs above.\n'
      );
      process.exit(1);
    }
  } catch (error) {
    // Handle unexpected errors outside of seeder logic
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error(
      '❌ Unexpected error during seeding initialization:',
      errorMessage
    );
    process.exit(1);
  }
}

// Execute main function when script is run directly (not imported as module)
main();
