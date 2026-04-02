# Solosphere Backend

**Safe Journeys & Like-Minded Connections** 🌍

A robust, community-driven backend service for solo travelers to discover verified safe destinations, connect with like-minded travelers, and access trusted travel guidance.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Server](#running-the-server)
- [Database Seeding](#database-seeding)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Contributing](#contributing)

---

## Problem Statement

Solo travel, particularly for women and first-time explorers, presents significant challenges around safety, trust verification, and access to reliable local guidance. Traditional travel platforms lack community-driven safety-focused insights, forcing travelers to rely on fragmented, unverified reviews.

**Solosphere** addresses this gap by creating a secure, community-driven platform where solo travelers can:
- Share real safety experiences and verified local recommendations
- Discover pre-vetted safe destinations, accommodations, and travel tips
- Connect with like-minded travelers for companionship and shared journeys
- Access authenticated, community-curated content from real travelers

---

## System Architecture

```
┌─────────────┐
│  Frontend   │ (React.js + React Router + Axios)
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Backend API    │ (Node.js + Express.js)
│  (This Service) │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│    MongoDB      │ (Cloud Atlas)
│    Database     │
└─────────────────┘
```

### Architecture Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React.js, React Router, Axios, TailwindCSS | UI/UX with client-side routing and API communication |
| **Backend** | Node.js, Express.js, TypeScript | RESTful API server with business logic |
| **Database** | MongoDB Atlas | Document-oriented storage for users, posts, tips, and relationships |
| **Authentication** | JWT (JSON Web Tokens) | Stateless, secure authentication mechanism |
| **Hosting** | Vercel/Netlify (Frontend), Render/Railway (Backend), MongoDB Atlas (Database) | Cloud deployment and scaling |

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | 18+ | JavaScript runtime environment |
| **Framework** | Express.js | 4.x | Web application framework |
| **Language** | TypeScript | 5.x | Type-safe JavaScript variant |
| **Database** | MongoDB | 5.0+ | NoSQL document database |
| **ODM** | Mongoose | 7.x | Object Document Mapper for MongoDB |
| **Authentication** | JWT | via jsonwebtoken | Token-based authentication |
| **Environment** | dotenv | - | Environment variable management |
| **Dev Tools** | TypeScript Compiler, Node.js | - | Development and build tooling |

---

## Key Features

### Core Functionality

| Feature | Implementation | Access Level |
|---------|----------------|--------------|
| **User Authentication** | JWT-based signup, login, logout with token validation | Public / Protected Routes |
| **Travel Companion Matching** | Advanced filters: date overlap, location, preferences, safety ratings | Authenticated Users |
| **Safe Place Discovery** | Filterable & searchable database of verified safe destinations | Authenticated Users |
| **Travel Tips & Guides** | Community-curated safety tips organized by city and category | Authenticated Users |
| **Travel Planning** | Create, manage, and share travel plans with dates and itineraries | Authenticated Users |
| **Emergency SOS** | Geolocation-enabled emergency logging with automatic alerts | Authenticated Users |
| **Post & Review System** | Create, read, update, delete safety posts about places | Authenticated Users |
| **Blocking & Reporting** | Safety features to block users and report inappropriate content | Authenticated Users |
| **Advanced Search** | Multi-criteria filtering: city, category, date range, capacity | Authenticated Users |
| **Pagination & Sorting** | Efficient data retrieval with configurable page size and sort options | All Endpoints |

### Safety & Security

- **Role-Based Access Control**: User and Admin roles with endpoint authorization
- **Data Validation**: Input sanitization and schema validation on all endpoints
- **Verified Badges**: Admin-curated verification system for trusted locations
- **Geolocation Validation**: Safety checks for location data accuracy
- **Password Hashing**: Secure password storage with industry-standard algorithms

---

## Project Structure

```
backend/
├── src/
│   ├── app.ts                 # Express app initialization
│   ├── server.ts              # Server entry point
│   ├── config/
│   │   └── db.ts              # MongoDB connection configuration
│   ├── controllers/           # Request handlers
│   │   └── authController.ts
│   ├── middlewares/           # Express middleware
│   │   └── protect.ts         # JWT authentication middleware
│   ├── models/                # Mongoose schemas & models
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Tip.js
│   │   ├── Place.js
│   │   ├── TravelPlan.js
│   │   ├── ConnectionRequest.js
│   │   ├── Block.js
│   │   ├── Report.js
│   │   ├── EmergencyLog.js
│   │   └── [other models]
│   ├── routes/                # API route definitions (TypeScript)
│   │   ├── authRoutes.ts
│   │   ├── companionRoutes.ts
│   │   ├── placesRoutes.ts
│   │   ├── postRoutes.ts
│   │   ├── tipsRoutes.ts
│   │   ├── emergencyRoutes.ts
│   │   ├── GlobalRouter.ts
│   │   └── [other routes]
│   ├── scripts/               # Utility scripts
│   │   ├── clearTips.ts       # Database cleanup utility
│   │   └── seed/
│   │       ├── seedTips.ts    # Seed travel tips database
│   │       └── seedPlaces.ts  # Seed safe places database
│   └── utils/                 # Helper functions
│       └── generateToken.ts   # JWT token generation
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

---

## Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB Atlas** account with cluster credentials
- **npm** or **yarn** package manager
- **Git** for version control

### Step 1: Clone the Repository

```bash
git clone https://github.com/connectwithvanshika/Solosphere-FS.git
cd Solosphere-FS/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

See [Environment Configuration](#environment-configuration) section below.

### Step 4: Verify TypeScript Setup

```bash
npx tsc --version
```

---

## Environment Configuration

Create a `.env` file in the backend root directory with the following variables:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/solosphere?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: API Keys for integrations
GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

### Environment Variable Requirements

| Variable | Type | Required | Example |
|----------|------|----------|---------|
| `MONGO_URI` | String | ✅ Yes | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | String | ✅ Yes | `your-secret-key-min-32-chars` |
| `PORT` | Number | ❌ No | `5000` (default) |
| `NODE_ENV` | String | ❌ No | `development` or `production` |

**⚠️ Security Warning**: Never commit `.env` file to version control. Add it to `.gitignore`.

---

## Running the Server

### Development Mode (with hot reload)

```bash
npm run dev
```

Server will start on `http://localhost:5000` with TypeScript compilation.

### Production Build

```bash
npm run build
npm start
```

### Verify Server Health

```bash
curl http://localhost:5000/health
```

Expected response: `{ "status": "ok" }`

---

## Database Seeding

### Seed Travel Tips

Populates the database with 60 travel tips across 5 major cities (Safety, Transport, Wellness, Helplines categories).

```bash
npm run seed:tips
```

### Seed Safe Places

Populates the database with 16 verified safe places (hostels, cafés, accommodations, nature spots).

```bash
npm run seed:places
```

### Clear All Tips (⚠️ Destructive)

**Warning**: This operation deletes all tips and cannot be undone.

```bash
npm run clear:tips
```

---

## API Documentation

### Authentication Routes

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

Response: `{ token, userId, email }`

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response: `{ token, userId, email }`

### Protected Routes

All endpoints below require a valid JWT token in the `Authorization` header:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Get All Posts
```http
GET /api/posts?page=1&limit=10&city=Goa
```

#### Create a New Post
```http
POST /api/posts
Content-Type: application/json

{
  "title": "Safe Café in Goa",
  "excerpt": "Amazing and safe café by the beach",
  "content": "Full review here...",
  "city": "Goa",
  "category": "Café",
  "rating": 4.5
}
```

#### Find Travel Companions
```http
GET /api/companions/match?city=Jaipur&startDate=2024-05-01
```

Filters by:
- `city` - Destination city
- `startDate` - Trip start date (ISO format)
- `endDate` - Trip end date (ISO format)
- `gender` - Gender preference (optional)

#### Discover Travel Tips
```http
GET /api/tips?city=Delhi&category=Safety&page=1
```

Categories: `Safety`, `Transport`, `Wellness`, `Helplines`

#### Submit Emergency SOS
```http
POST /api/emergency/sos
Content-Type: application/json

{
  "latitude": 28.7041,
  "longitude": 77.1025,
  "message": "Need immediate assistance"
}
```

#### Get Safe Places with Filters
```http
GET /api/places?city=Mumbai&category=Hostel&minRating=4.0&page=1&sort=-rating
```

Query Parameters:
- `city` - Filter by city
- `category` - Filter by place type
- `minRating` - Minimum safety rating (0-5)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sort` - Sort field (prefix with `-` for descending)

---

## API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **POST** | `/api/auth/signup` | User registration | ❌ No |
| **POST** | `/api/auth/login` | User login | ❌ No |
| **GET** | `/api/posts` | Get all posts with pagination | ✅ Yes |
| **POST** | `/api/posts` | Create new post | ✅ Yes |
| **GET** | `/api/posts/:id` | Get post details | ✅ Yes |
| **PUT** | `/api/posts/:id` | Update post | ✅ Yes (Owner/Admin) |
| **DELETE** | `/api/posts/:id` | Delete post | ✅ Yes (Owner/Admin) |
| **GET** | `/api/posts/search` | Search/filter posts | ✅ Yes |
| **GET** | `/api/companions/match` | Find travel companions | ✅ Yes |
| **GET** | `/api/tips` | Discover travel tips | ✅ Yes |
| **GET** | `/api/places` | Browse safe places | ✅ Yes |
| **POST** | `/api/emergency/sos` | Report emergency | ✅ Yes |
| **POST** | `/api/verify/:id` | Verify place (Admin only) | ✅ Yes (Admin) |

---

## Database Models

### User Model
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  profileImage: String,
  bio: String,
  gender: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model (Travel Safety Reviews)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  excerpt: String,
  content: String,
  city: String,
  category: String,
  rating: Number,
  verified: Boolean,
  likes: [ObjectId],
  comments: [{userId, text, createdAt}],
  createdAt: Date,
  updatedAt: Date
}
```

### TravelPlan Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  city: String,
  startDate: Date,
  endDate: Date,
  description: String,
  guestCapacity: Number,
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Tip Model (Travel Guidance)
```javascript
{
  _id: ObjectId,
  city: String,
  category: String (Safety|Transport|Wellness|Helplines),
  title: String,
  excerpt: String,
  content: String,
  verified: Boolean,
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

For detailed schema information, refer to the model files in `src/models/`.

---

## Testing the APIs

### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123","name":"John Doe"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'

# Get authenticated endpoints (replace TOKEN with your JWT)
curl -X GET http://localhost:5000/api/tips \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Import the API endpoints into Postman
2. Set `Authorization` header with Bearer token for protected routes
3. Configure environment variables for `base_url` and `token`
4. Test each endpoint systematically

---

## Development Guidelines

### Code Standards

- **TypeScript**: All new files must be `.ts` (not `.js`)
- **Naming**: Use camelCase for variables/functions, PascalCase for classes/interfaces
- **Comments**: Explain "why" decisions were made, not "what" the code does
- **Architecture**: Follow 3-layer pattern (Validator → Service → Controller)
- **Error Handling**: Use proper HTTP status codes and error messages

### Best Practices

- ✅ Validate all inputs before processing
- ✅ Use middleware for cross-cutting concerns
- ✅ Implement proper error handling with try-catch
- ✅ Document complex business logic
- ✅ Keep functions small and focused (Single Responsibility Principle)
- ✅ Use dependency injection for testability

---

## Contributing

We welcome contributions from the community! Please follow these steps:

1. **Fork the repository** on GitHub
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** with clear, descriptive commits
4. **Follow the code standards** outlined above
5. **Test your changes** thoroughly
6. **Push to your fork** and submit a Pull Request
7. **Ensure all tests pass** before requesting review

### Reporting Issues

Found a bug or have a feature request? Please [open an issue](https://github.com/connectwithvanshika/Solosphere-FS/issues) with:
- Clear title and description
- Steps to reproduce (for bugs)
- Expected vs. actual behavior
- Environment details (Node version, OS, etc.)

---

## Support & Documentation

- **Backend Repository**: [Solosphere-FS/backend](https://github.com/connectwithvanshika/Solosphere-FS)
- **Frontend Repository**: [Solosphere-FS/frontend](https://github.com/connectwithvanshika/Solosphere-FS)
- **Issues & Discussions**: [GitHub Issues](https://github.com/connectwithvanshika/Solosphere-FS/issues)
- **MongoDB Documentation**: [docs.mongodb.com](https://docs.mongodb.com)
- **Express.js Guide**: [expressjs.com](https://expressjs.com)
- **TypeScript Handbook**: [typescriptlang.org](https://www.typescriptlang.org)

---

## License

This project is licensed under the MIT License. See LICENSE file for details.

---

## Acknowledgments

- Built for solo travelers, by developers who understand the importance of community safety
- Special thanks to MongoDB Atlas for reliable database hosting
- Inspired by real traveler experiences and safety concerns

---

**Made with ❤️ for safer travels worldwide.**
