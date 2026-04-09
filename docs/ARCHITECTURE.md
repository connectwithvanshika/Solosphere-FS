# 🏗️ Architecture Deep Dive

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Frontend)                  │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  React 19 Components & Pages                       │   │
│  │  - Home, Explore, Gallery, Map                     │   │
│  │  - Login, Signup, Profile                          │   │
│  │  - Travel Tips, Companion Matching                 │   │
│  │  - Emergency Mode, SOS Button                      │   │
│  └────────────────────────────────────────────────────┘   │
│                          │                                 │
│  ┌────────────────────────────────────────────────────┐   │
│  │  HTTP Client Layer (Axios)                         │   │
│  │  - Base URL Configuration                          │   │
│  │  - Request Interceptors                            │   │
│  │  - Token Management                                │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                   REST API (HTTP/HTTPS)
                          │
┌─────────────────────────────────────────────────────────────┐
│                   SERVER LAYER (Backend)                    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Express.js Application Setup (app.ts)             │   │
│  │  - Middleware Stack                                │   │
│  │  - CORS Configuration                              │   │
│  │  - Error Handling                                  │   │
│  └────────────────────────────────────────────────────┘   │
│                          │                                 │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Routing Layer (GlobalRouter.ts)                   │   │
│  │  - /api/auth → authRoutes                          │   │
│  │  - /api/posts → postRoutes                         │   │
│  │  - /api/places → placesRoutes                      │   │
│  │  - /api/tips → tipsRoutes                          │   │
│  │  - /api/companions → companionRoutes               │   │
│  │  - /api/emergency → emergencyRoutes                │   │
│  └────────────────────────────────────────────────────┘   │
│                          │                                 │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Middleware Layer (middlewares/)                   │   │
│  │  - protect.ts: JWT Authentication                  │   │
│  │  - Error handlers                                  │   │
│  │  - Request validators                              │   │
│  └────────────────────────────────────────────────────┘   │
│                          │                                 │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Controller Layer (controllers/)                   │   │
│  │  - authController: Signup/Login logic              │   │
│  │  - postController: CRUD for Posts                  │   │
│  │  - placeController: Browse Places                  │   │
│  │  - tipsController: Serve Tips                      │   │
│  │  - companionController: Match Companions           │   │
│  │  - emergencyController: Handle SOS                 │   │
│  └────────────────────────────────────────────────────┘   │
│                          │                                 │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Data Access Layer (models/)                       │   │
│  │  - Mongoose Schemas & ODM                          │   │
│  │  - Database queries via Mongoose methods           │   │
│  │  - Data validation & hooks                         │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                    Mongoose ODM
                          │
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER (Database)                     │
│                                                             │
│  MongoDB Atlas Cloud Database (NoSQL)                       │
│  - Users Collection                                        │
│  - Posts Collection                                        │
│  - Places Collection                                       │
│  - Tips Collection                                         │
│  - TravelPlans Collection                                  │
│  - ConnectionRequests Collection                           │
│  - EmergencyLogs Collection                                │
│  - Blocks Collection                                       │
│  - Reports Collection                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Architectural Patterns

### 1. **MVC (Model-View-Controller)**

- **Models**: Mongoose schemas in `models/` directory
- **Views**: React components in `frontend/src/pages/`
- **Controllers**: Express controllers in `backend/src/controllers/`

### 2. **Middleware Pattern**

```typescript
// Typical Express middleware flow
app.use(cors());                    // CORS middleware
app.use(express.json());            // Body parser
app.use(protect);                   // Auth middleware
app.use('/api/posts', postRoutes);  // Route handler
```

### 3. **JWT Authentication Flow**

```
┌─────────────────────────────────────────────────────┐
│ 1. User submits credentials                         │
│    (email, password)                                │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│ 2. Backend verifies with bcryptjs                   │
│    Password hash comparison                         │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│ 3. JWT Token generated                              │
│    Contains: user ID, role, expiration              │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│ 4. Token sent to frontend                           │
│    Stored in localStorage                           │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│ 5. Subsequent requests include token                │
│    Authorization: Bearer <token>                    │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│ 6. Backend verifies token via protect middleware    │
│    Validates signature & expiration                 │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│ 7. Request allowed if valid                         │
│    User context attached to request                 │
└─────────────────────────────────────────────────────┘
```

### 4. **RESTful API Design**

Each resource follows the REST convention:

```
Resource: Posts

GET    /api/posts           → Get all posts
GET    /api/posts/:id       → Get specific post
POST   /api/posts           → Create new post
PUT    /api/posts/:id       → Update post
DELETE /api/posts/:id       → Delete post
```

---

## UML Diagrams

### 1. **Class Diagram - Database Models & Relationships**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌──────────────────┐              ┌──────────────────┐                    │
│  │      User        │              │      Post        │                    │
│  ├──────────────────┤              ├──────────────────┤                    │
│  │ - _id: ObjectId  │◄──────┐      │ - _id: ObjectId  │                    │
│  │ - name: String   │       │      │ - userId: ref    │────────┐           │
│  │ - email: String  │       │      │ - title: String  │        │           │
│  │ - password: Hash │       │      │ - content: String│        │           │
│  │ - role: String   │       │      │ - city: String   │        │           │
│  │ - createdAt: Date│       │      │ - rating: Number │        │           │
│  └──────────────────┘       │      │ - verified: Bool │        │           │
│           ▲                 │      │ - likes: [ref]   │        │           │
│           │                 │      │ - createdAt: Date│        │           │
│           │ (1)      (*)    │      └──────────────────┘   (1)  │           │
│           │         {1..*}  │                                 (*)           │
│  ┌────────┴────────────────────────┬──────────────────────────┴───────┐   │
│  │        (creates)                │         (likes)                  │   │
│  │           (author)              │   (can like multiple)            │   │
│  │                                 │                                  │   │
│  │                     ┌──────────────────┐          ┌──────────────┐ │   │
│  │                     │      Place       │          │ TravelPlan   │ │   │
│  │                     ├──────────────────┤          ├──────────────┤ │   │
│  │                     │ - _id: ObjectId  │          │ - _id: ref   │ │   │
│  │                     │ - name: String   │          │ - userId: ref│ │   │
│  │              (1)    │ - city: String   │          │ - city: String
│  │             {0..*}  │ - category: Enm  │          │ - startDate: │ │   │
│  │ ┌──────────────────►│ - rating: Number │          │ - endDate:   │ │   │
│  │ │ (verified places) │ - verified: Bool │          │ - capacity:  │ │   │
│  │ │                   │ - createdAt: Date│          └──────────────┘ │   │
│  │ │                   └──────────────────┘                           │   │
│  │ │                                                                  │   │
│  │ │         ┌──────────────────┐        ┌────────────────────┐       │   │
│  │ │         │      Tip         │        │ ConnectionRequest  │       │   │
│  │ │         ├──────────────────┤        ├────────────────────┤       │   │
│  │ │         │ - _id: ObjectId  │        │ - _id: ObjectId    │       │   │
│  │ │         │ - city: String   │        │ - fromUser: ref    │────┐  │   │
│  │ │  (1)    │ - category: Enm  │        │ - toUser: ref      │    │  │   │
│  │ │ {0..*}  │ - title: String  │        │ - status: Enum     │ (1) │  │   │
│  │ └────────►│ - content: String│        │ - createdAt: Date  │{0..1}│  │   │
│  │           │ - verified: Bool │        └────────────────────┘  |  │   │
│  │           │ - createdAt: Date│                                │  │   │
│  │           └──────────────────┘                                │  │   │
│  │                                                                │  │   │
│  │  ┌─────────────────────┐        ┌──────────────────────┐      │  │   │
│  │  │   EmergencyLog      │        │  Block & Report      │      │  │   │
│  │  ├─────────────────────┤        ├──────────────────────┤      │  │   │
│  │  │ - _id: ObjectId     │        │ - _id: ObjectId      │      │  │   │
│  │  │ - userId: ref       │        │ - blocker/reporter   │      │  │   │
│  │  │ - location: {       │        │ - blocked/reported   │──────┘  │   │
│  │  │    lat, lng, city   │        │ - reason (Report)    │         │   │
│  │  │ }                   │        └──────────────────────┘         │   │
│  │  │ - timestamp: Date   │                                        │   │
│  │  └─────────────────────┘                                        │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Legend:           ◄─ references (foreign key)       (1) one-to-one   │
│                    ──► contains reference            (*) one-to-many   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. **Use Case Diagram - Actors & System Interactions**

```
                            ┌──────────────────────────┐
                            │  SoloSphere System       │
                            └──────────────────────────┘
                                      │
                ┌─────────────────────┼─────────────────────┐
                │                     │                     │
                ▼                     ▼                     ▼
            ┌────────┐            ┌──────────┐          ┌────────┐
            │ User   │            │  Admin   │          │ Guest  │
            └────────┘            └──────────┘          └────────┘
                │                     │                     │
        ┌───────┼──────────────┬──────┼──────────┐          │
        │       │              │      │          │          │
        ▼       ▼              ▼      ▼          ▼          ▼
   ┌────────────────────────────────────────────────────────────────┐
   │                     Core Use Cases                            │
   │                                                               │
   │  ┌──────────────────┐  ┌──────────────────┐ ┌──────────────┐ │
   │  │ Register & Login │  │ Browse Places    │ │ Browse Tips  │ │
   │  │                  │  │ (Filter/Sort)    │ │              │ │
   │  └──────────────────┘  └──────────────────┘ └──────────────┘ │
   │           ▲                      ▲                ▲            │
   │           │ (auth)               │ (all users)    │ (all users)
   │           │                      │                │            │
   │  ┌──────────────────┐  ┌──────────────────┐ ┌──────────────┐ │
   │  │ Create Post      │  │ Find Travel      │ │ Trigger SOS  │ │
   │  │ (Community       │  │ Companions       │ │ Emergency    │ │
   │  │ Safety Review)   │  │ (Date/Location)  │ │              │ │
   │  └──────────────────┘  └──────────────────┘ └──────────────┘ │
   │           ▲                      ▲                ▲            │
   │           │ (auth)               │ (auth)         │ (all users)
   │           │                      │                │            │
   │  ┌──────────────────┐  ┌──────────────────────────────────┐   │
   │  │ Block User &     │  │ Send Connection Requests         │   │
   │  │ Report Content   │  │ View Travel Plans                │   │
   │  └──────────────────┘  └──────────────────────────────────┘   │
   │           ▲                      ▲                              │
   │           │ (auth)               │ (auth)                      │
   │           │                      │                              │
   │  ┌────────────────────────────────────────────────────────┐   │
   │  │  ADMIN ONLY:                                          │   │
   │  │  ┌──────────────────┐     ┌─────────────────────────┐ │   │
   │  │  │ Verify Places &  │     │ View Emergency Logs    │ │   │
   │  │  │ Posts, Manage    │     │ Manage Reports         │ │   │
   │  │  │ Users & Reports  │     │                         │ │   │
   │  │  └──────────────────┘     └─────────────────────────┘ │   │
   │  └────────────────────────────────────────────────────────┘   │
   │                                                               │
   └────────────────────────────────────────────────────────────────┘
```

### 3. **Sequence Diagram - User Registration & JWT Generation**

```
User          Frontend        Backend           Database
 │               │               │                 │
 ├─ Enter ──────►│               │                 │
 │ Credentials   │               │                 │
 │               │               │                 │
 │       ┌───────┼──────────────►│                 │
 │       │POST /api/auth/signup  │                 │
 │       │{name,email,pass}      │                 │
 │       │                       │                 │
 │       │       ┌───────────────┤                 │
 │       │       │ Validate      │                 │
 │       │       │ Input         │                 │
 │       │       ├────────────────────────────────►│
 │       │       │ Check if email exists           │
 │       │       │◄────────────────────────────────┤
 │       │       │ Not Found ✓                     │
 │       │       │                                 │
 │       │       ├─ Hash Password (bcryptjs)      │
 │       │       ├─ Generate Salt (10 rounds)     │
 │       │       │                                 │
 │       │       ├────────────────────────────────►│
 │       │       │ Insert User Document            │
 │       │       │ {name, email, hashedPass}      │
 │       │       │                                 │
 │       │       │◄────────────────────────────────┤
 │       │       │ User ID (_id)                   │
 │       │       │                                 │
 │       │       ├─ Generate JWT Token             │
 │       │       │ Payload: {userId, role}         │
 │       │       │ Sign with JWT_SECRET            │
 │       │       │                                 │
 │       │◄──────┤ {token, user}                   │
 │       │ 201 Created                             │
 │       │                                         │
 │◄──────┤ Success Response                        │
 │ Token │ Redirect to Home                        │
 │       │                                         │
 └─ Store ──────►│ localStorage.setItem()           │
   Token in      │ "token": "eyJh..."              │
   Browser       │                                 │
```

### 4. **Sequence Diagram - Post Creation Flow**

```
User          Frontend         Backend         Auth Layer      Database
 │                │               │                │              │
 ├─ Write ───────►│               │                │              │
 │ Post Content   │               │                │              │
 │                │               │                │              │
 ├─ Click ───────►│               │                │              │
 │ Submit         │               │                │              │
 │                │               │                │              │
 │       ┌────────┼──────────────►│                │              │
 │       │ POST /api/posts        │                │              │
 │       │ Authorization: Bearer  │                │              │
 │       │ {title, content, etc}  │                │              │
 │       │                        │                │              │
 │       │        ┌───────────────┤                │              │
 │       │        │ Extract Token │                │              │
 │       │        ├───────────────────────────────►│              │
 │       │        │ Verify Signature & Expiry      │              │
 │       │        │◄───────────────────────────────┤              │
 │       │        │ Valid ✓ Return User Data       │              │
 │       │        │                                 │              │
 │       │        ├─ Validate Input Data           │              │
 │       │        │ (title, content, city, etc)    │              │
 │       │        │                                 │              │
 │       │        ├────────────────────────────────►│              │
 │       │        │ Insert Post Document            │              │
 │       │        │ {userId, title, city, rating}  │              │
 │       │        │                                 │              │
 │       │        │◄────────────────────────────────┤              │
 │       │        │ Post ID (_id), Timestamp        │              │
 │       │        │                                 │              │
 │       │◄───────┤ 201 Created                     │              │
 │       │ {success, post}                         │              │
 │       │                                         │              │
 │◄──────┤ Success Message                         │              │
 │ "Post │ Post Added to Feed                      │              │
 │Created"                                         │              │
 │       │                                         │              │
 └───────┴─────────┴─────────────┴─────────────────┴──────────────┘
```

---

## Data Flow Diagrams

### User Registration & Login Flow

```
[Frontend: Signup Form]
          │
          ▼
POST /api/auth/signup
{email, name, password}
          │
          ▼
[Backend: authController.signup()]
  1. Validate input
  2. Check email doesn't exist
  3. Hash password (bcryptjs)
  4. Create user record
          │
          ▼
[MongoDB: Insert User]
          │
          ▼
[Generate JWT Token]
  - Payload: {userId, role}
  - Secret: JWT_SECRET
          │
          ▼
[Response with Token]
          │
          ▼
[Frontend: Store Token + Redirect]
```

### Creating a Post (Community Review)

```
[User fills form]
  Title, Content, City, Rating, Image
          │
          ▼
[Frontend: POST /api/posts]
+ Authorization: Bearer <token>
          │
          ▼
[Backend: protect middleware]
  1. Extract token
  2. Verify signature
  3. Validate expiration
  4. Attach userId to request
          │
          ▼
[postController.createPost()]
  1. Validate input
  2. Create post object
  3. Associate with user
  4. Save to database
          │
          ▼
[MongoDB: Insert Post]
          │
          ▼
[Response with post data]
          │
          ▼
[Frontend: Display success message]
```

### Fetching Places with Filters

```
[User selects filters]
  City: Goa, Category: Hostel, MinRating: 4
          │
          ▼
[Frontend: GET /api/places?city=Goa&category=Hostel&minRating=4]
          │
          ▼
[Backend: placeController.getPlaces()]
  1. Parse query parameters
  2. Build MongoDB filter object:
     { city: "Goa", category: "Hostel", rating: { $gte: 4 } }
  3. Execute paginated query
  4. Return sorted results
          │
          ▼
[MongoDB: Query & Return Places]
          │
          ▼
[Response with pagination metadata]
          │
          ▼
[Frontend: Display places on map/list]
```

---

## Technical Decisions & Rationale

| Decision | Why | Trade-offs |
|----------|-----|-----------|
| **Stateless JWT** | No persistent sessions; scales on serverless | Token can't be revoked immediately |
| **MongoDB (NoSQL)** | Flexible schemas for diverse content types | No complex joins; normalization overhead |
| **TypeScript Backend** | Type safety catches bugs early | Compilation step adds build time |
| **Vite Frontend** | Fast HMR for developer experience | Smaller ecosystem vs Webpack |
| **Monorepo Structure** | Shared issues & docs; easier coordination | Single deployment pipeline |
| **Separate Routes** | Modularity & maintainability | More files to manage |
| **Middleware Layer** | Centralized auth; DRY principle | Additional request processing |

---

## Security Architecture

### 1. **Authentication**
- JWT tokens with 24-hour expiration (configurable)
- Passwords hashed with bcryptjs (10 salt rounds)
- No password stored in plain text

### 2. **Authorization**
- Role-based access control (RBAC)
  - `user`: Default role
  - `admin`: Full administrative access
- Route-level protection with middleware

### 3. **API Security**
- CORS configured to allow frontend origin
- Input validation on all endpoints
- Request body size limits (Express middleware)

### 4. **Data Protection**
- Sensitive fields excluded from responses (passwords)
- User isolation: Users can only modify their own content
- Admin override for moderation

---

## Scalability Considerations

### Horizontal Scaling
- **Stateless backend**: Can run multiple Express instances
- **Load balancing**: Vercel handles auto-scaling
- **Database indexing**: MongoDB indexes on frequently queried fields

### Vertical Scaling
- Caching layer (Redis) for frequently accessed data
- Database connection pooling
- CDN for static assets and images

### Current Bottlenecks
- Single MongoDB instance (free tier)
- No caching layer
- No image optimization

### Future Improvements
1. Add Redis cache for tips, places
2. Implement database connection pooling
3. Add image CDN (e.g., Cloudinary)
4. Database sharding for collections >100MB

---

## Error Handling Strategy

### Backend Error Flow

```
[Request arrives]
          │
          ▼
[Route handler]
  1. Try-catch block
  2. Validate input
  3. Execute business logic
          │
          ├─ [No error] ──▶ Send success response
          │
          └─ [Error] ──▶ [Error handler middleware]
                           1. Categorize error
                           2. Log error
                           3. Return appropriate status code
                           4. Send error message
```

### HTTP Status Codes

```
✅ 2xx: Success
  200 OK             - Request successful
  201 Created        - Resource created
  204 No Content     - Success, no response body

⚠️ 4xx: Client Error
  400 Bad Request    - Invalid input
  401 Unauthorized   - Missing/invalid token
  403 Forbidden      - Insufficient permissions
  404 Not Found      - Resource doesn't exist
  409 Conflict       - Duplicate resource

🔴 5xx: Server Error
  500 Internal Error - Unexpected server error
  503 Unavailable    - Service temporarily down
```

---

## Database Indexing Strategy

```javascript
// Recommended indexes for performance

// Users collection
db.users.createIndex({ email: 1 });              // Quick email lookup
db.users.createIndex({ createdAt: -1 });        // Recent users

// Posts collection
db.posts.createIndex({ userId: 1 });            // User's posts
db.posts.createIndex({ city: 1, rating: -1 });  // Filter & sort
db.posts.createIndex({ createdAt: -1 });        // Recent posts

// Places collection
db.places.createIndex({ city: 1 });             // City filtering
db.places.createIndex({ rating: -1 });          // Rating sort
db.places.createIndex({ verified: 1 });         // Verified filter

// Tips collection
db.tips.createIndex({ city: 1, category: 1 });  // City + category

// TravelPlans collection
db.travelPlans.createIndex({ userId: 1 });      // User's plans
db.travelPlans.createIndex({ city: 1 });        // Plans by city

// EmergencyLogs collection
db.emergencyLogs.createIndex({ timestamp: -1 }); // Recent alerts
db.emergencyLogs.createIndex({ userId: 1 });     // User alerts
```

---

## Testing Architecture

### Unit Testing
- Test individual controllers and models
- Mock MongoDB with jest mocks
- Framework: Jest

### Integration Testing
- Test API endpoints with real database
- Use test database instance
- Framework: Supertest + Jest

### Frontend Testing
- Component testing with React Testing Library
- Integration tests with Axios mocks
- E2E testing with Cypress

---

## Deployment Architecture

### Vercel Serverless

```
[User Request]
    │
    ▼
[Vercel Edge Network]
  1. Route to nearest region
  2. Load serverless function
    │
    ▼
[Express App Cold Start]
  1. Initialize environment
  2. Connect to MongoDB
  3. Handle request
    │
    ▼
[Response Sent]
  1. Keep-alive timeout
  2. Function terminates
```

### Environment Separation

```
Development          Staging              Production
├─ localhost:5001    ├─ staging.vercel    ├─ api.solosphere.vercel
├─ MongoDB Atlas     ├─ MongoDB Atlas     ├─ MongoDB Atlas
│  (dev cluster)     │  (staging cluster) │  (prod cluster)
└─ React HMR         └─ Vercel Preview    └─ CDN
```

---

## Performance Metrics

### Target Performance

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time | < 200ms | ~150ms |
| Database Query Time | < 50ms | ~40ms |
| Frontend Load Time | < 3s | ~2.5s |
| Lighthouse Score | > 90 | ~88 |

### Optimization Strategies

1. **Frontend**
   - Code splitting with React lazy loading
   - Image optimization & compression
   - CSS-in-JS for smaller bundle
   - Vite's tree-shaking

2. **Backend**
   - Database pagination (limit results)
   - Field projection (only fetch needed fields)
   - Caching headers
   - Request compression (gzip)

3. **Database**
   - Proper indexing
   - Connection pooling
   - Query optimization
   - Denormalization where needed

---

## Future Architecture Enhancements

### Phase 1: Caching & CDN
- Redis cache for tips, popular places
- Cloudinary for image optimization
- CloudFlare CDN for static assets

### Phase 2: Microservices
- Separate auth service
- Notification service (email/SMS)
- Image processing service

### Phase 3: Real-time Features
- WebSocket for live SOS alerts
- Real-time companion matching
- Live chat with matched travelers

### Phase 4: Advanced Features
- Machine learning for companion matching
- Recommendation engine
- Analytics dashboard

---

See also:
- [Main README](../README.md)
- [Complete Documentation](./DOCUMENTATION.md)
- [API Reference](./API_REFERENCE.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
