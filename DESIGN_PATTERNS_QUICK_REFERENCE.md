# Quick Reference: Design Patterns Summary

## 🎯 18 Design Patterns Used in Solosphere

### 1️⃣ MVC (Model-View-Controller)
**Purpose**: Separation of concerns
**Code**: Models/ → Controllers/ → Routes/
**Example**: User model + AuthController + authRoutes

### 2️⃣ 3-Layer Architecture  
**Purpose**: Enhanced MVC with validation
**Layers**: Validator → Service → Controller
**Example**: PostValidator → PostService → PostController

### 3️⃣ Dependency Injection
**Purpose**: Loose coupling, testability
```typescript
constructor(service: PostService) {
  this.service = service;
}
```

### 4️⃣ Factory Pattern
**Purpose**: Centralized object creation
```typescript
function createPostRouter(): Router { ... }
function createAuthRoutes(): Router { ... }
```

### 5️⃣ Middleware Pattern
**Purpose**: Request pipeline processing
**Stack**: CORS → Body Parser → Auth → Routes → Errors

### 6️⃣ Singleton Pattern
**Purpose**: One instance across app
```typescript
export default new AuthController();
```

### 7️⃣ Strategy Pattern
**Purpose**: Runtime algorithm selection
**Example**: Sort by rating/reviews/recent

### 8️⃣ Repository Pattern
**Purpose**: Data access abstraction
```typescript
class UserRepository {
  async findById(id: string) { ... }
}
```

### 9️⃣ Observer Pattern
**Purpose**: Event-driven behavior
```typescript
process.on("SIGTERM", () => gracefulShutdown());
```

### 🔟 Type Safety Pattern
**Purpose**: Compile-time error prevention
```typescript
interface IPost { ... }
function validate(payload: any): asserts payload is IPost
```

### 1️⃣1️⃣ Pagination Pattern
**Purpose**: Large dataset handling
```typescript
skip((page-1) * limit).limit(limit)
```

### 1️⃣2️⃣ Chain of Responsibility
**Purpose**: Handler chain
```typescript
app.use(cors) → app.use(json) → app.use(auth) → routes
```

### 1️⃣3️⃣ Facade Pattern
**Purpose**: Complex subsystem simple interface
```typescript
async logEmergency() { /* handles everything internally */ }
```

### 1️⃣4️⃣ DTO (Data Transfer Object)
**Purpose**: Data transfer between layers
```typescript
interface ICreatePostPayload { ... }
interface IPostsPaginatedResponse { ... }
```

### 1️⃣5️⃣ Async/Await Pattern
**Purpose**: Clean async code
```typescript
const [data, count] = await Promise.all([...])
```

### 1️⃣6️⃣ Input Validation Pattern
**Purpose**: Data integrity, security
```typescript
validateCreatePostPayload(req.body)
```

### 1️⃣7️⃣ Error Delegation Pattern
**Purpose**: Centralized error handling
```typescript
try { ... } catch(e) { next(e); }
```

### 1️⃣8️⃣ Builder Pattern
**Purpose**: Complex object construction
```typescript
const options = {
  definition: { openapi: '3.0.0', info: {...} }
}
```

---

## 🏗️ Architecture Layers

```
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)         │
│    Makes HTTP requests to backend       │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Express Server                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          Middleware Pipeline (Chain of Resp.)       │  │
│  │  CORS → Body Parser → Auth Middleware → Routes      │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Routes Layer (MVC - V)                 │   │
│  │ auth/ | posts/ | places/ | tips/ | companion/ | ... │   │
│  └────────────────┬─────────────────────────────────────┘   │
│                   ▼                                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Controller Layer (Factory Pattern)             │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  Validator → Service → Controller            │   │   │
│  │  │  (DI Pattern: Service injected)              │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └────────────────┬─────────────────────────────────────┘   │
│                   ▼                                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Service Layer (Business Logic)                │   │
│  │  - Filtering (Strategy Pattern)                    │   │
│  │  - Pagination (Pagination Pattern)                 │   │
│  │  - Repository (Data Access Abstraction)            │   │
│  │  - Parallel Queries (Promise.all)                  │   │
│  └────────────────┬─────────────────────────────────────┘   │
│                   ▼                                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │    Model Layer (MVC - M, Mongoose Schemas)         │   │
│  │  - User | Post | Place | Tip | TravelPlan | ...    │   │
│  └────────────────┬─────────────────────────────────────┘   │
│                   ▼                                          │
│           Error Middleware (Facade)                         │
│           (Error Delegation Pattern)                        │
└──────────────┬──────────────────────────────────────────────┘
               │ Response
               ▼
┌─────────────────────────────────────────┐
│    Frontend Receives JSON Response      │
│    (DTO Pattern - clean data transfer)  │
└─────────────────────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│    MongoDB Database                     │
│    (Repository Pattern - abstracted)    │
└─────────────────────────────────────────┘
```

---

## 💡 Key Performance Optimizations

### 1. Parallel Queries (Promise.all)
```typescript
// ❌ Sequential (2x latency)
const tips = await Tip.find(filters);
const count = await Tip.countDocuments(filters);

// ✅ Parallel (half latency)
const [tips, count] = await Promise.all([
  Tip.find(filters).lean().exec(),
  Tip.countDocuments(filters)
]);
```

### 2. Lean Queries
```typescript
// ❌ Returns Mongoose documents (larger, slower)
Tip.find().exec()

// ✅ Returns plain objects (faster)
Tip.find().lean().exec()
```

### 3. Query Optimization
```typescript
// Skip/Limit for pagination (doesn't load all)
Tip.find().skip((page-1)*limit).limit(limit)

// Regex for flexible searching
{ name: { $regex: searchTerm, $options: "i" } }

// Filters for precise querying
{ category: { $regex: category, $options: "i" }, city: cityName }
```

### 4. Type Safety
```typescript
// Compile-time checks prevent runtime errors
interface IPost { title: string; }
function create(post: IPost) { ... }
```

---

## 🔐 Security Patterns

### 1. Input Validation
```typescript
// Validator catches bad data early
PostValidator.validateCreatePostPayload(req.body)
```

### 2. Type Safety
```typescript
// TypeScript prevents weird type coercions
email: string  // Can't pass number by mistake
```

### 3. JWT Authentication
```typescript
// Stateless, can't be forged
Bearer <jwt_token>
```

### 4. Graceful Shutdown
```typescript
// Clean connection close prevents data loss
process.on("SIGTERM", () => gracefulShutdown())
```

### 5. CORS Protection
```typescript
// Only allowed origins can access API
cors({ origin: ["http://localhost:5173", "..."] })
```

---

## 🎓 Interview Talking Points

### "Why 3-Layer Architecture?"
- **Validator**: Input validation before processing
- **Service**: Pure business logic (reusable in webhooks, jobs)
- **Controller**: HTTP handling (not reusable)
- **Benefit**: Decoupled layers can be tested independently

### "Why Dependency Injection?"
- Makes testing easy (inject mock services)
- Reduces coupling (Controller doesn't create Service)
- Enables flexibility (swap implementations later)

### "Why Factory Pattern?"
- Centralized object creation
- Consistent initialization
- Single point to add initialization logic

### "Why Middleware Pattern?"
- Request processing pipeline
- Each middleware has single responsibility
- Reusable across routes

### "Why Strategy Pattern?"
- Different sort/filter options without code duplication
- Easy to add new strategies
- Extensible design

### "Why Repository Pattern?"
- Swapping MongoDB for PostgreSQL only affects Repository
- Easy to add caching layer
- Isolates data access concerns

### "Why Async/Await?"
- Cleaner than callback hell
- Try/catch error handling
- Sequential/parallel with Promise.all()

### "Why Parallel Queries?"
- Database round-trip is expensive
- count + find in parallel cuts latency by ~50%
- Better user experience

### "Why Pagination?"
- Don't load entire database into memory
- Send only what user needs
- Scales to millions of records

---

## 📝 Quick Cheat Sheet for Viva

**When asked about design patterns, mention:**

1. We use **MVC architecture** for separation of concerns
2. Enhanced with **3-layer pattern** (Validator → Service → Controller)
3. **Dependency Injection** makes controllers testable
4. **Factory pattern** for consistent object creation
5. **Middleware pattern** for request processing
6. **Type Safety** prevents runtime errors
7. **Pagination** for scalability
8. **Async/Await** for clean async code
9. **Error delegation** for consistency
10. **Strategy pattern** for flexible filtering/sorting

**When asked why these patterns:**
- "Maintainability: Easy to find and fix bugs"
- "Testability: Each layer can be tested separately"
- "Scalability: Handles growing users and data"
- "Extensibility: New features without breaking existing code"
- "Reusability: Services can be used in different contexts"

---

## 🚀 Advanced Talking Points

### Your Service Layer is Reusable
```typescript
// Service logic can be used in:
// 1. REST API Controllers
const post = await postService.createPost(data);

// 2. GraphQL Resolvers
resolver: async () => postService.getPost(id)

// 3. Job Queues/Webhooks
queue.add(() => postService.deleteExpiredPosts())

// 4. CLI Commands
cli.command('delete-old', () => postService.deleteOldPosts())
```

### Your Validators Ensure Data Quality
```typescript
// Not just format validation, but semantic validation
- Email exists check
- Dates make sense (endDate > startDate)
- String lengths not empty
- Arrays have elements
- Numbers in valid ranges
```

### Your Error Handling is Centralized
```typescript
// One place for all error logic:
// - Logging
// - Error formatting
// - Status codes
// - Rate limiting
```

---

## Final Thoughts 💭

Your backend demonstrates:
- ✅ Understanding of enterprise patterns
- ✅ Production-ready code
- ✅ Scalable architecture
- ✅ Security awareness
- ✅ Performance optimization
- ✅ Testability and maintainability
- ✅ Clean code principles

These aren't patterns for the sake of patterns—they solve real problems in building safe, scalable applications. Your professor will be impressed! 🎓
