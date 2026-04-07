## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Problem Statement](#-problem-statement)
3. [Tech Stack](#-tech-stack)
4. [Architecture](#-architecture)
5. [Features](#-features)
6. [Project Structure](#-project-structure)
7. [Database Models](#-database-models)
8. [API Reference](#-api-reference)
9. [Setup & Installation](#-setup--installation)
10. [Running the Project](#-running-the-project)
11. [Environment Variables](#-environment-variables)
12. [Deployment](#-deployment)
13. [Team Members & Contributions](#-team-members--contributions)

---

## 🌐 Project Overview

**SoloSphere** is a full-stack web application built for solo travelers. It provides a **verified, community-curated** ecosystem where users can:

- 🗺️ Discover **verified safe destinations** — hostels, cafés, apartments, camps, and nature spots
- 📝 Share and read **real safety travel posts & reviews**
- 🧳 Browse **city-wise travel tips** categorised by Safety, Transport, Wellness, and Helplines
- 🤝 Find **travel companions** who share similar itineraries and travel dates
- 🆘 Trigger a **geolocation-enabled SOS alert** in emergencies
- 🔐 Authenticate securely via **JWT-based login/signup**
- 🛡️ Report/block users and flag inappropriate content

Built with a React + Vite frontend, an Express + TypeScript backend, and MongoDB Atlas as the cloud database — all deployable on Vercel.

---

## ❗ Problem Statement

Solo travel, particularly for women and first-time explorers, presents significant challenges:

| Challenge | Impact |
|-----------|--------|
| Unverified accommodation reviews | Risk of unsafe stays |
| Fragmented, unreliable local guidance | Poor travel decisions |
| No safety-focused travel community | Isolation and anxiety |
| Lack of women-centric travel resources | Disproportionate risk for female travelers |
| No emergency tools built into travel apps | Delayed help in critical situations |

**SoloSphere** bridges this gap by creating a secure, community-driven platform where every piece of content is authentic, user-generated, and safety-first.

---

## 🧰 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React.js** | 19.x | UI component library |
| **React Router DOM** | 7.x | Client-side routing |
| **Axios** | 1.x | HTTP API communication |
| **Leaflet + React-Leaflet** | 1.9.x / 5.x | Interactive maps & geolocation |
| **Vite** | 7.x | Fast dev server & bundler |
| **Vanilla CSS / CSS Modules** | — | Styling |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x | JavaScript runtime |
| **Express.js** | 5.x | RESTful API framework |
| **TypeScript** | 5.x / 6.x | Type-safe server-side code |
| **Mongoose** | 8.x | MongoDB ODM |
| **jsonwebtoken** | 9.x | JWT authentication |
| **bcryptjs** | 3.x | Password hashing |
| **dotenv** | 16.x | Environment variable management |
| **cors** | 2.x | Cross-Origin Resource Sharing |
| **tsx + nodemon** | — | Dev server with hot reload |

### Database & Infrastructure

| Tool | Purpose |
|------|---------|
| **MongoDB Atlas** | Cloud-hosted NoSQL document database |
| **Vercel** | Frontend & backend serverless deployment |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────┐
│         CLIENT (Browser)             │
│   React 19 + Vite + React Router     │
│   Leaflet Maps · Axios HTTP Client   │
└──────────────┬───────────────────────┘
               │  REST API (HTTP/HTTPS)
               ▼
┌──────────────────────────────────────┐
│        BACKEND API SERVER            │
│   Node.js 18 · Express 5            │
│   TypeScript · JWT Middleware        │
│   Routes: Auth · Posts · Places ·   │
│           Tips · Companions · SOS    │
└──────────────┬───────────────────────┘
               │  Mongoose ODM
               ▼
┌──────────────────────────────────────┐
│          MongoDB Atlas               │
│   Collections: Users · Posts ·      │
│   Places · Tips · TravelPlans ·     │
│   ConnectionRequests · EmergencyLogs │
│   Blocks · Reports                  │
└──────────────────────────────────────┘
```

### Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Stateless JWT Auth** | No server-side sessions; scales easily across serverless deployments |
| **MongoDB (NoSQL)** | Flexible schemas for diverse content types (posts, tips, places) |
| **TypeScript on Backend** | Enforces type safety and catches bugs at compile time |
| **Vite on Frontend** | Lightning-fast HMR and optimized production builds |
| **Monorepo Structure** | Keeps frontend and backend in one repository for easier development |

---

## ✨ Features

### 🔐 Authentication & Authorization
- User **signup / login / logout** with JWT token management
- **Role-based access control**: `user` and `admin` roles
- Protected API routes via middleware
- Secure **bcrypt** password hashing

### 📝 Posts (Community Safety Reviews)
- Full **CRUD** — Create, Read, Update, Delete posts
- Fields: Title, City, Category, Rating, Description, Image URL
- **Author-only** editing and deletion (or admin override)

### 🗺️ Safe Places Discovery
- Browse verified safe places: Hostels, Cafés, Apartments, Camps, Nature Spots
- **Multi-criteria filtering**: city, category, minimum rating
- **Sorting**: by rating, review count, or most recent
- Backend **pagination** for performance

### 💡 Travel Tips Module
- 60+ curated tips across 5 major cities
- Categories: **Safety · Transport · Wellness · Helplines**
- Paginated tips with full modal read view
- Admin-seeded and community-curated

### 🤝 Travel Companion Matching
- Find companions by: **City, Date Range, Gender Preference**
- View and send **connection requests**
- Browse others' travel plans

### 🆘 Emergency SOS
- One-tap SOS button visible on all pages
- Logs **GPS coordinates** (lat/lng + city) to the database
- Accessible even without full login (guest-friendly)

### 🔎 Search, Filter, Sort & Pagination
- Global search by city, keyword, category
- Category and rating filters
- Configurable sort order
- Efficient pagination across all list endpoints

### 🛡️ Safety Features
- **Block users** to prevent unwanted contact
- **Report** inappropriate content or users
- **Verified badges** applied by admins to trusted places

---

## 📁 Project Structure

```
solosphere/                        ← Root of the repository
├── README.md                      ← This file
├── vercel.json                    ← Vercel deployment config
├── package-lock.json
│
├── backend/                       ← Express + TypeScript API server
│   ├── package.json
│   ├── src/
│   │   ├── app.ts                 ← Express app setup, middleware
│   │   ├── server.ts              ← Entry point, DB connection, server listen
│   │   ├── config/
│   │   │   └── db.ts              ← MongoDB Atlas connection
│   │   ├── controllers/
│   │   │   └── authController.ts  ← Signup / Login handlers
│   │   ├── middlewares/
│   │   │   └── protect.ts         ← JWT auth middleware
│   │   ├── models/                ← Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   ├── Place.js
│   │   │   ├── Tip.js
│   │   │   ├── TravelPlan.js
│   │   │   ├── ConnectionRequest.js
│   │   │   ├── EmergencyLog.js
│   │   │   ├── Block.js
│   │   │   └── Report.js
│   │   ├── routes/                ← Express route handlers
│   │   │   ├── GlobalRouter.ts
│   │   │   ├── authRoutes.ts
│   │   │   ├── postRoutes.ts
│   │   │   ├── placesRoutes.ts
│   │   │   ├── tipsRoutes.ts
│   │   │   ├── companionRoutes.ts
│   │   │   └── emergencyRoutes.ts
│   │   ├── scripts/               ← Seeding & maintenance scripts
│   │   │   ├── clearTips.ts
│   │   │   └── seed/
│   │   │       ├── seedTips.ts
│   │   │       └── seedPlaces.ts
│   │   └── utils/
│   │       └── generateToken.ts   ← JWT token generation helper
│   └── .env                       ← Backend environment variables (not committed)
│
└── frontend/                      ← React + Vite client app
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx               ← Vite entry point
        ├── App.jsx                ← Router & route definitions
        ├── api.js                 ← Axios base URL config
        ├── index.css
        ├── App.css
        ├── pages/
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── Home.jsx
        │   ├── Gallery.jsx
        │   ├── MyPosts.jsx
        │   ├── TravelCompanion.jsx
        │   ├── TravelTips.jsx
        │   ├── Explore.jsx
        │   ├── Map.jsx
        │   ├── EmergencyMode.jsx
        │   ├── Footer.jsx
        │   └── SOSButton.jsx
        ├── styles/
        └── assets/
```

---

## 🗄️ Database Models

### User
```js
{
  name:      String  (required),
  email:     String  (required, unique),
  password:  String  (required, bcrypt hashed),
  role:      String  (default: "user" | "admin"),
  createdAt: Date,
  updatedAt: Date
}
```

### Post (Safety Review)
```js
{
  userId:    ObjectId → User,
  title:     String,
  excerpt:   String,
  content:   String,
  city:      String,
  category:  String,
  rating:    Number (0–5),
  imageUrl:  String,
  verified:  Boolean,
  likes:     [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Place (Safe Destination)
```js
{
  name:        String,
  city:        String,
  category:    String  (Hostel | Café | Apartment | Camp | Nature),
  description: String,
  rating:      Number,
  verified:    Boolean,
  imageUrl:    String,
  createdAt:   Date
}
```

### Tip (Travel Guidance)
```js
{
  city:      String,
  category:  String  (Safety | Transport | Wellness | Helplines),
  title:     String,
  excerpt:   String,
  content:   String,
  verified:  Boolean,
  image:     String,
  createdAt: Date
}
```

### TravelPlan
```js
{
  userId:        ObjectId → User,
  city:          String,
  startDate:     Date,
  endDate:       Date,
  description:   String,
  guestCapacity: Number,
  isPublic:      Boolean,
  createdAt:     Date
}
```

### EmergencyLog
```js
{
  userId:    ObjectId → User  (optional / guest),
  location:  { lat: Number, lng: Number, city: String },
  timestamp: Date
}
```

### ConnectionRequest
```js
{
  fromUser: ObjectId → User,
  toUser:   ObjectId → User,
  status:   String  (pending | accepted | rejected),
  createdAt: Date
}
```

### Block / Report
```js
// Block
{ blocker: ObjectId → User, blocked: ObjectId → User }

// Report
{ reporter: ObjectId → User, reported: ObjectId → User, reason: String }
```

---

## 📡 API Reference

All protected routes require:
```http
Authorization: Bearer <JWT_TOKEN>
```

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/signup` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT | ❌ |

### Posts

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/posts` | Get all posts (paginated) | ✅ |
| `POST` | `/api/posts` | Create a new post | ✅ |
| `GET` | `/api/posts/mine` | Get logged-in user's posts | ✅ |
| `GET` | `/api/posts/:id` | Get post by ID | ✅ |
| `PUT` | `/api/posts/:id` | Update post (owner/admin) | ✅ |
| `DELETE` | `/api/posts/:id` | Delete post (owner/admin) | ✅ |

### Places

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/places` | Browse safe places with filters | ❌ |
| `GET` | `/api/places/:id` | Get place details | ❌ |
| `POST` | `/api/verify/:id` | Mark place as verified | ✅ Admin |

### Tips

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/tips` | Get tips (filter by city/category) | ❌ |

### Travel Companions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/companions/match` | Find companions by city/date | ✅ |
| `POST` | `/api/companions/request` | Send connection request | ✅ |

### Emergency

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/emergency/sos` | Log emergency + geolocation | Optional |

---

## ⚙️ Setup & Installation

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **npm** v9 or higher (bundled with Node.js)
- **MongoDB Atlas** account — [Create free cluster](https://www.mongodb.com/atlas)
- **Git** — [Download](https://git-scm.com/)

### Step 1 — Clone the Repository

```sh
git clone https://github.com/connectwithvanshika/Solosphere-FS.git
cd Solosphere-FS
```

### Step 2 — Install Backend Dependencies

```sh
cd backend
npm install
```

### Step 3 — Install Frontend Dependencies

```sh
cd ../frontend
npm install
```

### Step 4 — Configure Environment Variables

See the [Environment Variables](#-environment-variables) section below and create the required `.env` files.

### Step 5 — Seed the Database (Optional but Recommended)

```sh
# From backend directory
npm run seed:tips     # Seeds 60+ travel tips
npm run seed:places   # Seeds 16 verified safe places
```

---

## 🚀 Running the Project

Open **two terminal windows** — one for backend, one for frontend.

### Terminal 1 — Start the Backend

```sh
cd backend
npm run dev
```

Backend runs at → **http://localhost:5001**

### Terminal 2 — Start the Frontend

```sh
cd frontend
npm run dev
```

Frontend runs at → **http://localhost:5173**

### Production Build

```sh
# Backend
cd backend
npm run build && npm start

# Frontend
cd frontend
npm run build
npm run preview
```

---

## 🔑 Environment Variables

### Backend — `backend/.env`

```env
# MongoDB Connection (required)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/solosphere?retryWrites=true&w=majority

# JWT Secret Key (required — use a long, random string in production)
JWT_SECRET=your_super_secret_jwt_key_here

# Server Port (optional, defaults to 5001)
PORT=5001

# Node Environment
NODE_ENV=development
```

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✅ Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ Yes | Secret key for signing JWTs |
| `PORT` | ❌ No | Server port (default: 5001) |
| `NODE_ENV` | ❌ No | `development` or `production` |

### Frontend — `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5001
```

> ⚠️ **Never commit `.env` files to version control.** Both are already listed in `.gitignore`.

---

## ☁️ Deployment

| Service | What it hosts |
|---------|---------------|
| **Vercel** | Frontend (React/Vite) |
| **Vercel Serverless** | Backend (Express API) |
| **MongoDB Atlas** | Cloud Database |

The `vercel.json` at the project root configures routing for the serverless backend deployment.

---

## 👥 Team Members & Contributions

| Name | Role | Contributions |
|------|------|---------------|
| **Vanshika Yadav** | Full Stack Developer & Project Lead | End-to-end architecture design, MongoDB schema design, all backend API routes (auth, posts, places, tips, companions, emergency), JWT middleware, React frontend pages (Home, MyPosts, Gallery, TravelCompanion, TravelTips, EmergencyMode, Map), database seeding scripts, Vercel deployment configuration |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your fork: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please make sure your code follows the existing style and that all APIs are tested before submission.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 💬 Support

- **Issues & Bug Reports**: [GitHub Issues](https://github.com/connectwithvanshika/Solosphere-FS/issues)
- **MongoDB Docs**: [docs.mongodb.com](https://docs.mongodb.com)
- **Express.js Guide**: [expressjs.com](https://expressjs.com)
- **React Docs**: [react.dev](https://react.dev)

---
