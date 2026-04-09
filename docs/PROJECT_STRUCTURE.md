# 📁 Project Structure Guide

Comprehensive overview of SoloSphere's codebase organization.

---

## Root Directory Structure

```
solosphere/
├── 📚 Documentation Files
│   ├── README.md                    ← Quick start & project overview
│   ├── DOCUMENTATION.md             ← Complete documentation
│   ├── ARCHITECTURE.md              ← System design & patterns
│   ├── API_REFERENCE.md             ← All API endpoints
│   ├── SETUP.md                     ← Installation guide
│   ├── PROJECT_STRUCTURE.md         ← This file
│   └── LICENSE                      ← MIT License
│
├── ⚙️ Configuration Files
│   ├── vercel.json                  ← Vercel deployment config
│   ├── package.json                 ← Root dependencies
│   ├── package-lock.json            ← Dependency lock file
│   └── .gitignore                   ← Git ignore rules
│
├── 🏗️ Backend (Express + TypeScript)
│   └── backend/
│       ├── package.json             ← Backend dependencies
│       ├── package-lock.json
│       ├── tsconfig.json            ← TypeScript config
│       ├── dist/                    ← Compiled JavaScript (generated)
│       ├── node_modules/            ← Dependencies (generated)
│       ├── .env                     ← Environment variables (not committed)
│       │
│       └── src/
│           ├── server.ts            ← Entry point, server startup
│           ├── app.ts               ← Express app setup, middleware
│           │
│           ├── config/
│           │   └── db.ts            ← MongoDB connection logic
│           │
│           ├── controllers/
│           │   └── authController.ts ← Signup/Login logic
│           │
│           ├── middlewares/
│           │   └── protect.ts        ← JWT authentication middleware
│           │
│           ├── models/               ← Mongoose schemas
│           │   ├── User.js           ← User schema
│           │   ├── Post.js           ← Community review schema
│           │   ├── Place.js          ← Safe place schema
│           │   ├── Tip.js            ← Travel tip schema
│           │   ├── TravelPlan.js     ← Travel plan schema
│           │   ├── ConnectionRequest.js ← Companion request schema
│           │   ├── EmergencyLog.js   ← SOS alert schema
│           │   ├── Block.js          ← Block user schema
│           │   └── Report.js         ← Report content schema
│           │
│           ├── routes/               ← Express route handlers
│           │   ├── GlobalRouter.ts   ← Main router (imports all routes)
│           │   ├── authRoutes.ts     ← /api/auth endpoints
│           │   ├── postRoutes.ts     ← /api/posts endpoints
│           │   ├── placesRoutes.ts   ← /api/places endpoints
│           │   ├── tipsRoutes.ts     ← /api/tips endpoints
│           │   ├── companionRoutes.ts ← /api/companions endpoints
│           │   └── emergencyRoutes.ts ← /api/emergency endpoints
│           │
│           ├── scripts/              ← Utility scripts
│           │   ├── clearTips.ts      ← Script to clear tips from DB
│           │   └── seed/             ← Database seeding scripts
│           │       ├── seed.ts       ← Main seed orchestrator
│           │       ├── seedPlaces.ts ← Seed 16 verified places
│           │       └── seedTips.ts   ← Seed 60+ travel tips
│           │
│           └── utils/
│               └── generateToken.ts  ← JWT token generation helper
│
├── 💻 Frontend (React + Vite)
│   └── frontend/
│       ├── package.json             ← Frontend dependencies
│       ├── package-lock.json
│       ├── vite.config.js           ← Vite configuration
│       ├── eslint.config.js         ← ESLint configuration
│       ├── index.html               ← HTML entry point
│       ├── dist/                    ← Production build (generated)
│       ├── node_modules/            ← Dependencies (generated)
│       ├── .env                     ← Environment variables (not committed)
│       ├── public/                  ← Static files
│       │   └── images/
│       │
│       └── src/
│           ├── main.jsx             ← Vite entry point
│           ├── App.jsx              ← Main component, router setup
│           ├── App.css              ← Global styles
│           ├── index.css            ← Base styles
│           ├── api.js               ← Axios configuration & API client
│           │
│           ├── assets/              ← Images, icons, fonts
│           │
│           ├── pages/               ← Route components
│           │   ├── Home.jsx         ← Landing page
│           │   ├── Login.jsx        ← Login form
│           │   ├── Signup.jsx       ← Signup form
│           │   ├── Explore.jsx      ← Browse destinations
│           │   ├── Gallery.jsx      ← Place gallery view
│           │   ├── Map.jsx          ← Interactive map
│           │   ├── MyPosts.jsx      ← User's posts
│           │   ├── TravelCompanion.jsx ← Find companions
│           │   ├── TravelTips.jsx   ← Browse tips
│           │   ├── EmergencyMode.jsx ← Emergency interface
│           │   ├── SOSButton.jsx    ← SOS trigger button
│           │   └── Footer.jsx       ← Footer component
│           │
│           └── styles/              ← Component-specific CSS
│               ├── home.css
│               ├── login.css
│               ├── signup.css
│               ├── explore.css
│               ├── gallery.css
│               ├── map.css
│               ├── companion.css
│               ├── travel-tips.css
│               ├── sos.css
│               ├── footer.css
│               └── myposts.css
```

---

## Backend Deep Dive

### `server.ts` — Server Entry Point

```typescript
// Responsibilities:
// 1. Load environment variables
// 2. Connect to MongoDB
// 3. Initialize Express app
// 4. Start listening on PORT
// 5. Handle shutdown gracefully

// Typical flow:
dotenv.config()
│
├─ connectDB()              // MongoDB connection
│
├─ app = require('./app')   // Express initialization
│
├─ server.listen(PORT)      // Start server
│
└─ Handle shutdown signals
```

### `app.ts` — Express Configuration

```typescript
// Responsibilities:
// 1. Setup middleware (body parsing, CORS)
// 2. Register route handlers
// 3. Error handling middleware
// 4. Health check endpoints

// Middleware stack:
app.use(cors())                    // Enable CORS
app.use(express.json())            // Parse JSON bodies
app.use(express.urlencoded(...))   // Parse form data
app.use(requestLogger)             // Log requests
│
├─ app.use('/api', globalRouter)   // Mount all API routes
│
├─ app.use(errorHandler)           // Centralized error handling
│
└─ app.use(notFound)               // 404 handler
```

### `config/db.ts` — Database Connection

```typescript
// Responsibilities:
// 1. Connect to MongoDB Atlas
// 2. Handle connection events
// 3. Manage connection pooling

// Connection flow:
mongoose.connect(MONGO_URI)
│
├─ .on('connected')      // Connection established
├─ .on('error')          // Connection error
├─ .on('disconnected')   // Connection closed
│
└─ Export connected instance
```

### `controllers/authController.ts` — Auth Logic

```typescript
// Responsibilities:
// 1. User registration (signup)
// 2. User authentication (login)
// 3. Password hashing & verification
// 4. JWT token generation

// Functions:
export.signup()  // Create new user, hash password, send token
export.login()   // Find user, verify password, send token
```

### `middlewares/protect.ts` — JWT Authentication

```typescript
// Responsibilities:
// 1. Extract JWT from Authorization header
// 2. Verify token signature and expiration
// 3. Validate user exists in database
// 4. Attach user to request object
// 5. Pass control to next middleware

// Middleware flow:
exports.protect = (req, res, next) => {
  1. Get token from headers
  2. Verify token with JWT_SECRET
  3. Get user from database
  4. req.user = user  // Attach user
  5. next()           // Continue to route
}
```

### `models/` — Mongoose Schemas

Each file defines a schema for a collection:

```typescript
// User.js
Schema: {
  name: String
  email: String (unique)
  password: String (hashed)
  role: String (enum: ['user', 'admin'])
  timestamps
}

// Post.js
Schema: {
  userId: ObjectId ref User
  title: String
  content: String
  city: String
  rating: Number
  verified: Boolean
  likes: [ObjectId]
  timestamps
}

// Similar structure for Place, Tip, TravelPlan, etc.
```

### `routes/` — Express Route Handlers

Each route file exports a router:

```typescript
// authRoutes.ts
router.post('/signup', authController.signup)
router.post('/login', authController.login)

// postRoutes.ts
router.get('/', protect, postController.getAllPosts)
router.post('/', protect, postController.createPost)
router.get('/:id', protect, postController.getPost)
router.put('/:id', protect, postController.updatePost)
router.delete('/:id', protect, postController.deletePost)

// Similar patterns for places, tips, companions, emergency
```

### `scripts/` — Database Operations

```typescript
// seed/seedTips.ts
// Creates 60+ travel tips across 5 cities
// Categories: Safety, Transport, Wellness, Helplines

// seed/seedPlaces.ts
// Creates 16 verified safe places
// Cities: Delhi, Goa, Bali, Bangkok, Paris

// clearTips.ts
// Removes all tips from database
// Used for resetting test data
```

---

## Frontend Deep Dive

### `main.jsx` — Entry Point

```jsx
// Responsibilities:
// 1. Initialize React
// 2. Render App component
// 3. Mount to DOM

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### `App.jsx` — Router Setup

```jsx
// Responsibilities:
// 1. Define all routes
// 2. Setup React Router
// 3. Handle redirects based on auth

// Main routes:
/                  → Home page
/login             → Login form
/signup            → Signup form
/explore           → Browse places
/gallery           → Place gallery
/map               → Interactive map
/my-posts          → User's reviews
/companions        → Travel companion matching
/tips              → Travel tips
/emergency         → Emergency mode
```

### `api.js` — Axios Configuration

```javascript
// Responsibilities:
// 1. Configure base URL
// 2. Setup request/response interceptors
// 3. Handle token management
// 4. Centralize API calls

// Key exports:
export const API_BASE_URL
export const axiosInstance
export functions for each endpoint:
  - createPost()
  - getPlaces()
  - getCompanions()
  - etc.
```

### `pages/` — React Components

Each page component handles:
- Rendering UI
- Calling API functions
- State management
- Error handling
- Loading states

```jsx
// Home.jsx
- Display hero section
- Show featured places/tips
- Call-to-action buttons

// Login.jsx
- Email/password form
- Client-side validation
- API call to /auth/login
- Store JWT token
- Redirect on success

// Explore.jsx
- Display filtered places
- Category/city filters
- Sorting options
- Pagination
- Show place details

// Similar patterns for other pages
```

### `styles/` — Component Styling

Each CSS file corresponds to a page:

```css
/* home.css */
Hero section
Featured cards
Footer styling

/* explore.css */
Filter controls
Place cards/grid
Map view
Loading states

/* Similar for other pages */
```

---

## Data Flow Examples

### Creating a Post (Full Stack)

```
Frontend: User submits form
│
├─ Validate input (client-side)
├─ Prepare data object
├─ Call api.js → createPost()
│
▼
HTTP Request
POST /api/posts
{title, content, city, rating, imageUrl}
Authorization: Bearer <JWT>
│
▼
Backend: app.ts
│
├─ CORS middleware ✅
├─ Body parser middleware ✅
├─ protect middleware (JWT verify)
│
▼
Route: postRoutes.ts
POST /api/posts → postController.createPost()
│
▼
Controller: authController.ts
│
├─ Validate input
├─ Get user from req.user (from middleware)
├─ Create Post document
├─ Save to MongoDB
├─ Return response
│
▼
Backend: models/Post.js
│
├─ Insert one document
├─ Return saved post with ID
│
▼
Frontend: Receive response
│
├─ Add post to local state
├─ Show success message
├─ Redirect to /my-posts
```

### Fetching Places with Filters

```
Frontend: User selects filters
{city: 'Goa', category: 'Hostel', minRating: 4}
│
├─ Build query string
├─ Call api.js → getPlaces(filters)
│
▼
HTTP Request
GET /api/places?city=Goa&category=Hostel&minRating=4
│
▼
Backend: app.ts
│
├─ CORS middleware ✅
├─ Query parser middleware
│
▼
Route: placesRoutes.ts
GET /api/places → placeController.getPlaces()
│
▼
Controller
│
├─ Extract query params
├─ Build MongoDB filter:
│   { city: "Goa", category: "Hostel", rating: { $gte: 4 } }
├─ Execute query with pagination
├─ Return results + pagination metadata
│
▼
Backend: models/Place.js
│
├─ Query collection with filter
├─ Sort results
├─ Apply pagination
├─ Return array of places
│
▼
Frontend: Receive response
│
├─ Update state with places
├─ Render place cards
├─ Show pagination controls
```

---

## Important Files Quick Reference

### Must-Know Backend Files

| File | Purpose | No-Touch 🔴 | Safe to Edit 🟢 |
|------|---------|-----------|------|
| `server.ts` | Server startup | 🟢 | 🟢 |
| `app.ts` | Express setup | 🟢 | 🟢 |
| `config/db.ts` | DB connection | 🟢 | 🟢 |
| `controllers/` | Business logic | 🟢 | 🟢 |
| `models/` | Schemas | 🟢 | 🟢 |
| `routes/` | API endpoints | 🟢 | 🟢 |
| `middlewares/` | Auth logic | 🟢 | 🟢 |
| `.env` | Secrets | 🔴 | Don't commit |

### Must-Know Frontend Files

| File | Purpose | No-Touch 🔴 | Safe to Edit 🟢 |
|------|---------|-----------|------|
| `App.jsx` | Router | 🟢 | 🟢 |
| `api.js` | API client | 🟢 | 🟢 |
| `pages/` | Components | 🟢 | 🟢 |
| `styles/` | CSS | 🟢 | 🟢 |
| `.env` | Config | 🔴 | Don't commit |

---

## Adding New Features

### Adding a New API Endpoint

1. **Create Model** → `backend/src/models/NewModel.js`
2. **Create Controller** → `backend/src/controllers/newController.ts`
3. **Create Routes** → `backend/src/routes/newRoutes.ts`
4. **Register Routes** → Update `GlobalRouter.ts`
5. **Test Endpoint** → Use Postman/curl

### Adding a New Page

1. **Create Component** → `frontend/src/pages/NewPage.jsx`
2. **Add Route** → Update `App.jsx`
3. **Add Styles** → `frontend/src/styles/newpage.css`
4. **Add Navigation** → Update menu/navigation
5. **Test Page** → Visit in browser

---

## Common Commands

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Compile TypeScript
npm start            # Run production
npm run seed:tips    # Seed data
npm run clear:tips   # Clear data

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production
npm run lint         # Run ESLint
```

---

For more details, see:
- [Complete Documentation](./DOCUMENTATION.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Setup Guide](./SETUP.md)
- [Main README](../README.md)
