# 📚 SoloSphere — Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Key Features](#key-features)
4. [Database Models](#database-models)
5. [Architecture](#architecture)
6. [Environment Variables](#environment-variables)
7. [Running the Project](#running-the-project)
8. [Deployment](#deployment)

---

## Overview

**SoloSphere** is a full-stack web application built for solo travelers. It provides a verified, community-curated ecosystem where users can discover safe destinations, share travel experiences, access travel tips, find companions, and access emergency tools.

### What Makes It Unique

- **Verified Content**: Every place, tip, and review is community-verified and administrator-approved
- **Safety-First Design**: Built specifically for solo travelers, especially women travelers
- **Community-Driven**: Real user experiences, authentic reviews, and peer recommendations
- **Emergency Ready**: One-tap SOS button with GPS geolocation tracking
- **Comprehensive Network**: Places, tips, companions, and social features in one platform

---

## Problem Statement

Solo travel presents significant challenges, particularly for women and first-time travelers:

| Challenge | Impact | SoloSphere Solution |
|-----------|--------|-------------------|
| **Unverified accommodation reviews** | Risk of unsafe stays | Verified place listings with community ratings |
| **Fragmented local guidance** | Poor travel decisions | City-wise curated travel tips |
| **No safety-focused community** | Isolation and anxiety | Active user community sharing safety posts |
| **Limited emergency resources** | Delayed help | One-tap SOS with GPS tracking |
| **Difficulty finding travel partners** | Traveling alone increases vulnerability | Travel companion matching system |

**SoloSphere** creates a secure, authentic platform where every piece of content is user-generated, community-verified, and safety-first.

---

## Key Features

### 🔐 Authentication & Authorization
- **Signup/Login/Logout** with JWT token management
- **Role-based access control** (user and admin roles)
- **Protected API routes** via middleware
- **Secure password hashing** with bcryptjs

### 📝 Community Safety Reviews (Posts)
- **Full CRUD** — Create, Read, Update, Delete
- **Author-only editing** (admin override allowed)
- **Sharing safety experiences** with ratings
- **Fields**: Title, City, Category, Rating, Description, Image URL

### 🏠 Safe Places Discovery
- **Browse verified safe places**: Hostels, Cafés, Apartments, Camps, Nature Spots
- **Advanced filtering**: by city, category, minimum rating
- **Sorting options**: by rating, review count, or recency
- **Pagination** for efficient data loading
- **Verified badges** for trusted locations

### 🗺️ Interactive Maps
- **Leaflet + React-Leaflet** integration
- **Geolocation-enabled features**
- **City and place visualization**
- **Emergency location tracking**

### 💡 Travel Tips Module
- **60+ curated tips** across 5 major cities
- **Categories**: Safety, Transport, Wellness, Helplines
- **Admin-seeded and community-curated**
- **Paginated tips** with full modal view
- **City-specific filtering**

### 👥 Travel Companion Matching
- **Find companions by**:
  - City
  - Travel dates
  - Gender preference (optional)
- **Connection requests** system
- **Public travel plan browsing**
- **Profile viewing** before connecting

### 🆘 Emergency SOS
- **One-tap SOS button** visible on all pages
- **GPS coordinate logging**: latitude, longitude, city
- **Accessible without full login** (guest-friendly)
- **Emergency log tracking** with timestamps
- **Real-time emergency alerts**

### 🛡️ Safety & Moderation
- **Block users** to prevent unwanted contact
- **Report inappropriate content** or users
- **Admin verification** for sensitive content
- **Community moderation**

### 🔍 Search, Filter, Sort & Pagination
- **Global search** by city, keyword, category
- **Multi-criteria filtering**
- **Configurable sorting**
- **Efficient pagination** across all endpoints

---

## Database Models

### User
```js
{
  name:      String     (required),
  email:     String     (required, unique),
  password:  String     (required, hashed with bcrypt),
  role:      String     (default: "user", options: ["user", "admin"]),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Post (Community Safety Review)
```js
{
  userId:        ObjectId  → User (required),
  title:         String    (required),
  excerpt:       String    (required),
  content:       String    (required),
  city:          String    (required),
  category:      String    (required),
  rating:        Number    (0–5, required),
  imageUrl:      String,
  verified:      Boolean   (default: false),
  likes:         [ObjectId] (array of User IDs),
  createdAt:     Timestamp,
  updatedAt:     Timestamp
}
```

### Place (Safe Destination)
```js
{
  name:           String    (required),
  city:           String    (required),
  category:       String    (required, options: ["Hostel", "Café", "Apartment", "Camp", "Nature"]),
  description:    String,
  rating:         Number    (0–5, default: 0),
  verified:       Boolean   (default: false),
  reviewCount:    Number    (default: 0),
  imageUrl:       String,
  coordinates:    { lat: Number, lng: Number },
  createdAt:      Timestamp
}
```

### Tip (Travel Guidance)
```js
{
  city:           String    (required, options: ["Delhi", "Goa", "Bali", "Bangkok", "Paris"]),
  category:       String    (required, options: ["Safety", "Transport", "Wellness", "Helplines"]),
  title:          String    (required),
  excerpt:        String    (required),
  content:        String    (required),
  verified:       Boolean   (default: false),
  image:          String,
  createdAt:      Timestamp
}
```

### TravelPlan
```js
{
  userId:        ObjectId  → User (required),
  city:          String    (required),
  startDate:     Date      (required),
  endDate:       Date      (required),
  description:   String,
  guestCapacity: Number    (default: 1),
  isPublic:      Boolean   (default: false),
  createdAt:     Timestamp
}
```

### EmergencyLog
```js
{
  userId:        ObjectId  → User (optional, nullable),
  location:      {
    lat:         Number    (required),
    lng:         Number    (required),
    city:        String    (required)
  },
  timestamp:     Timestamp (default: now)
}
```

### ConnectionRequest
```js
{
  fromUser:      ObjectId  → User (required),
  toUser:        ObjectId  → User (required),
  status:        String    (default: "pending", options: ["pending", "accepted", "rejected"]),
  createdAt:     Timestamp
}
```

### Block
```js
{
  blocker:       ObjectId  → User (required),
  blocked:       ObjectId  → User (required),
  createdAt:     Timestamp
}
```

### Report
```js
{
  reporter:      ObjectId  → User (required),
  reported:      ObjectId  → User (required),
  postId:        ObjectId  → Post (optional),
  reason:        String    (required),
  createdAt:     Timestamp
}
```

---

## Architecture

### System Architecture Diagram

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
| **Stateless JWT Auth** | No server-side sessions; scales easily on serverless deployments |
| **MongoDB (NoSQL)** | Flexible schemas for diverse content types (posts, tips, places) |
| **TypeScript Backend** | Enforces type safety and catches bugs at compile time |
| **Vite Frontend** | Lightning-fast HMR and optimized production builds |
| **Monorepo Structure** | Keeps frontend and backend in one repo for easier collaboration |
| **Middleware Layer** | Centralized authentication, error handling, and request validation |
| **Separate Routes** | Modular route organization for maintainability |

---

## Environment Variables

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

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGO_URI` | ✅ Yes | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/solosphere?retryWrites=true&w=majority` |
| `JWT_SECRET` | ✅ Yes | Secret key for signing JWTs | `your_random_string_here_min_32_chars` |
| `PORT` | ❌ No | Server port (default: 5001) | `5001` |
| `NODE_ENV` | ❌ No | Environment (`development` or `production`) | `development` |

### Frontend — `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5001
```

> **Never commit `.env` files to version control.** Both are already listed in `.gitignore`.

---

## Running the Project

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **npm** v9+ (bundled with Node.js)
- **MongoDB Atlas** account — [Create free cluster](https://www.mongodb.com/cloud/atlas)
- **Git** — [Download](https://git-scm.com/)

### Installation Steps

**Step 1 — Clone Repository**
```bash
git clone https://github.com/connectwithvanshika/Solosphere-FS.git
cd Solosphere-FS
```

**Step 2 — Install Backend Dependencies**
```bash
cd backend
npm install
```

**Step 3 — Install Frontend Dependencies**
```bash
cd ../frontend
npm install
cd ..
```

**Step 4 — Configure Environment Variables**

Create `backend/.env`:
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/solosphere?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here_at_least_32_characters
PORT=5001
NODE_ENV=development
```

Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5001
```

**Step 5 — Seed the Database (Recommended)**
```bash
cd backend
npm run seed:tips     # Seeds 60+ travel tips
npm run seed:places   # Seeds 16 verified safe places
```

### Running Locally

Open **two terminal windows**:

**Terminal 1 — Backend (port 5001)**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend (port 5173)**
```bash
cd frontend
npm run dev
```

Then open http://localhost:5173 in your browser.

### Production Build

**Backend Build & Run**
```bash
cd backend
npm run build
npm start
```

**Frontend Build & Preview**
```bash
cd frontend
npm run build
npm run preview
```

---

## Deployment

### Platforms Used

| Service | Hosts | Purpose |
|---------|-------|---------|
| **Vercel** | Frontend + Serverless Backend | Hosting and deployment |
| **MongoDB Atlas** | Database | Cloud NoSQL database |

### Vercel Configuration

The `vercel.json` file in the project root configures:
- Frontend build settings
- Backend API routing
- Serverless function configuration
- Environment variable management

### Deployment Steps

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Vercel automatically deploys on push to main branch

### Database Connection

Ensure your `MONGO_URI` in Vercel environment variables allows connections from Vercel's IP addresses (whitelist 0.0.0.0/0 in MongoDB Atlas IP Whitelist).

---

## Tech Stack Summary

### Frontend
- **React 19** — UI framework
- **React Router 7** — Client-side routing
- **Axios 1.x** — HTTP client
- **Leaflet 1.9 + React-Leaflet 5** — Maps and geolocation
- **Vite 7** — Build tool and dev server
- **CSS Modules & Vanilla CSS** — Styling

### Backend
- **Node.js 18** — JavaScript runtime
- **Express 5** — API framework
- **TypeScript 5+** — Type safety
- **Mongoose 8** — MongoDB ODM
- **JWT (jsonwebtoken)** — Authentication
- **bcryptjs** — Password hashing
- **CORS** — Cross-origin support
- **dotenv** — Environment management
- **tsx + nodemon** — Dev server with auto-reload

### Database & Infrastructure
- **MongoDB Atlas** — Cloud document database
- **Vercel** — Deployment and hosting

---

For more information, refer to:
- [API Reference](./API_REFERENCE.md)
- [Architecture Deep Dive](./ARCHITECTURE.md)
- [Setup Guide](./SETUP.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Main README](../README.md)
