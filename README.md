<div align="center">

<img src="https://img.shields.io/badge/SoloSphere-Safety%20for%20Solo%20Travelers-0F2044?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0xIDE3aC0ydi0yaDJ2MnptMC00aC0yVjdoMnY4eiIvPjwvc3ZnPg==" alt="SoloSphere" />

# 🌍 SoloSphere

### *A Community-Driven Safety Platform for Solo Travelers*

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-13AA52?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel)](https://solosphere-fs.vercel.app)

<br/>

**[🚀 Live Demo](https://solosphere-fs.vercel.app)** &nbsp;·&nbsp; **[📖 Documentation](docs/DOCUMENTATION.md)** &nbsp;·&nbsp; **[🏗️ Architecture](docs/ARCHITECTURE.md)** &nbsp;·&nbsp; **[📡 API Reference](docs/API_REFERENCE.md)**

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="divider" />

</div>

<br/>

## 📋 Table of Contents

- [Overview](#-overview)
- [The Problem We Solve](#-the-problem-we-solve)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Setup & Installation](#-setup--installation)
- [Running the Project](#-running-the-project)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Team & Contributions](#-team--contributions)
- [License](#-license)

---

## 🌐 Overview

**SoloSphere** is a full-stack web application purpose-built for solo travelers — especially women and first-time travelers — who need a trusted, safety-first community to plan and navigate their journeys with confidence.

Every feature in SoloSphere is designed around a single philosophy: **real experiences, verified information, and community-powered safety**. Users share authentic safety reviews, discover verified safe places, find compatible travel companions, and access emergency tools — all from one authenticated platform.

> *Built as a full-stack academic project demonstrating MVC architecture, OOP principles, SOLID design, and enterprise-grade design patterns in a real-world context.*

---

## 🎯 The Problem We Solve

Solo travel is growing rapidly, yet digital tools remain fragmented and unsafe:

| Pain Point | How SoloSphere Solves It |
|---|---|
| 🔴 Unverified accommodation reviews | Community-submitted & admin-verified safe places with safety ratings |
| 🔴 No centralised emergency resources | One-tap SOS logging with GPS coordinates + admin visibility |
| 🔴 Fragmented local safety guidance | 60+ curated tips across Safety, Transport, Wellness & Helplines |
| 🔴 No safe way to find travel companions | Companion matching filtered by city, date range & gender preference |
| 🔴 Harmful content & bad actors | Block users, report content, and admin moderation layer |

---

## ✨ Key Features

### 🏨 Verified Safe Places
Browse community-rated hostels, cafés, campsites, apartments and nature spots filtered by city, category, minimum rating, and safety score. Admin-verified badges distinguish trusted entries.

### 📝 Safety Community Posts
Write and read authentic travel safety reviews tied to real accounts. Like, filter by city/tags, and sort by rating or recency. Owners can edit or delete their own posts.

### 🗺️ Interactive Map
Explore destinations with Leaflet-powered geolocation maps. View safe places plotted on a real map with location pins and safety metadata.

### 👥 Travel Companion Matching
Create a travel plan (city, dates, capacity, gender preference) and discover compatible solo travelers planning the same destinations. Send, accept, or decline connection requests.

### 🚨 Emergency SOS
One-tap emergency alert logging with GPS coordinates (latitude, longitude, city). Logs are timestamped and visible to admins for monitoring and response coordination.

### 💡 Travel Tips
60+ curated tips across four categories — Safety, Transport, Wellness, and Helplines — searchable by keyword and filterable by city and category.

### 🛡️ Safety Controls
Block users to prevent unwanted contact. Report posts or profiles with a reason. Admins review and action all reports from a dedicated dashboard.

### 🔐 Secure Authentication
JWT-based stateless authentication with bcrypt password hashing (10 salt rounds). Role-based access control distinguishes `user` and `admin` permissions at the route level.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI component framework |
| **Vite** | 7.x | Build tool & HMR dev server |
| **React Router** | 7.x | Client-side routing |
| **Axios** | 1.x | HTTP client with interceptors |
| **Leaflet / React-Leaflet** | 4.x | Interactive maps |
| **CSS Modules** | — | Scoped component styling |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | JavaScript runtime |
| **Express** | 5.x | HTTP server & routing framework |
| **TypeScript** | 5.x | Static typing & compile-time safety |
| **JSON Web Token (jsonwebtoken)** | 9.x | Stateless auth tokens |
| **bcryptjs** | 2.x | Password hashing |
| **Swagger / OpenAPI** | 3.0 | API documentation |

### Database & Deployment
| Technology | Purpose |
|---|---|
| **MongoDB Atlas** | Cloud-hosted NoSQL document database |
| **Mongoose** | ODM — schema definition, validation, query building |
| **Vercel** | Serverless deployment (frontend + backend) |

---

## 📁 Project Structure

```
solosphere/
│
├── 📄 README.md                        ← You are here
├── 📄 DESIGN_PATTERNS_ANALYSIS.md      ← Deep-dive on all design patterns
├── 📄 vercel.json                      ← Vercel deployment configuration
│
├── 📁 docs/
│   ├── DOCUMENTATION.md                ← Complete feature documentation
│   ├── ARCHITECTURE.md                 ← System design & UML diagrams
│   ├── API_REFERENCE.md                ← All endpoints with examples
│   ├── SETUP.md                        ← Detailed setup guide
│   └── PROJECT_STRUCTURE.md            ← Codebase breakdown
│
├── 📁 diagrams/                        ← UML & architecture diagrams
│
├── 📁 backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app.ts                      ← Express app setup & middleware stack
│       ├── server.ts                   ← Server startup & graceful shutdown
│       ├── swagger.ts                  ← OpenAPI spec builder
│       │
│       ├── config/
│       │   └── db.ts                   ← MongoDB Atlas connection
│       │
│       ├── controllers/
│       │   └── authController.ts       ← Register & login logic (Singleton)
│       │
│       ├── middlewares/
│       │   └── protect.ts              ← JWT auth middleware (DI + Repository)
│       │
│       ├── models/                     ← Mongoose schemas
│       │   ├── User.js
│       │   ├── Post.js
│       │   ├── Place.js
│       │   ├── TravelPlan.js
│       │   ├── ConnectionRequest.js
│       │   ├── Block.js
│       │   ├── Report.js
│       │   ├── EmergencyLog.js
│       │   └── Tip.js
│       │
│       └── routes/                     ← Validator → Service → Controller per module
│           ├── authRoutes.ts
│           ├── postRoutes.ts
│           ├── placesRoutes.ts
│           ├── tipsRoutes.ts
│           ├── companionRoutes.ts
│           └── emergencyRoutes.ts
│
└── 📁 frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx                    ← React entry point
        ├── api.js                      ← Axios base config & interceptors
        │
        ├── pages/                      ← Route-level components
        │   ├── Home.jsx
        │   ├── Login.jsx / Signup.jsx
        │   ├── Explore.jsx
        │   ├── Gallery.jsx
        │   ├── Map.jsx
        │   ├── TravelTips.jsx
        │   ├── Companion.jsx
        │   ├── Emergency.jsx
        │   └── Profile.jsx
        │
        └── styles/                     ← Component-scoped CSS
```

---

## 🏗️ Architecture

SoloSphere implements a strict **Three-Tier Architecture** with an enhanced **Validator → Service → Controller** pattern on the backend.

```
┌────────────────────────────────────────────┐
│          CLIENT TIER  —  React + Vite      │
│  Pages  ·  Axios HTTP Client  ·  JWT Store  │
└─────────────────┬──────────────────────────┘
                  │  REST API  (HTTP/HTTPS)
┌─────────────────▼──────────────────────────┐
│         SERVER TIER  —  Express + TS       │
│                                            │
│  app.ts → GlobalRouter                     │
│      ↓                                     │
│  Middleware Stack                          │
│    cors()  →  express.json()  →  protect   │
│      ↓                                     │
│  Per-Module Route Files                    │
│    [Validator]  →  [Service]  →  [Controller]│
└─────────────────┬──────────────────────────┘
                  │  Mongoose ODM
┌─────────────────▼──────────────────────────┐
│      DATA TIER  —  MongoDB Atlas           │
│  9 Collections  ·  Compound Indexes        │
└────────────────────────────────────────────┘
```

### Key Architectural Decisions

**Stateless JWT Authentication** — No server-side sessions. Any instance handles any request, enabling horizontal scaling without sticky sessions.

**Three-Layer Route Modules** — Every route file is split into three internal classes: `Validator` (input validation), `Service` (business logic), `Controller` (HTTP mapping). Services are reusable across transports.

**Dependency Injection** — Controllers receive Service instances via constructor injection, making each layer independently unit-testable.

**Strategy Pattern for Filtering & Sorting** — Sort and filter logic is expressed as interchangeable strategy maps, allowing new options to be added without modifying existing code paths (Open/Closed Principle).

**Parallel DB Queries** — `Promise.all([find(), countDocuments()])` halves round-trip latency on all paginated endpoints.

**Lean Queries** — `.lean().exec()` on read endpoints returns plain JS objects (~2× faster than full Mongoose Documents).

For the complete architecture breakdown including UML diagrams, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## ⚙️ Setup & Installation

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **npm** v9 or higher (ships with Node.js)
- **Git** — [Download](https://git-scm.com)
- A free **MongoDB Atlas** account — [Sign Up](https://www.mongodb.com/atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/connectwithvanshika/Solosphere-FS.git
cd Solosphere-FS
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend/` directory:

```bash
cd ../backend
cp .env.example .env   # if example exists, otherwise create manually
```

Edit `.env` with your values (see [Environment Variables](#-environment-variables) below).

### 5. (Optional) Seed the Database

If a seed script is provided:

```bash
cd backend
npm run seed
```

---

## 🚀 Running the Project

### Development Mode (Recommended)

Open **two terminal windows**:

**Terminal 1 — Backend** (runs on port `5001`):
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend** (runs on port `5173`):
```bash
cd frontend
npm run dev
```

Then open your browser at **[http://localhost:5173](http://localhost:5173)**.

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production mode
cd ../backend
npm start
```

### Vercel Deployment

The project is pre-configured for Vercel via `vercel.json`. To deploy your own instance:

```bash
npm install -g vercel
vercel login
vercel --prod
```

Set the required environment variables in your Vercel project dashboard before deploying.

---

## 🔑 Environment Variables

Create `backend/.env` with the following keys:

```env
# MongoDB Atlas connection string
# Get this from: Atlas Dashboard → Cluster → Connect → Drivers
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/solosphere?retryWrites=true&w=majority

# JWT secret — use a long, random string (min 32 characters)
JWT_SECRET=your_super_secret_key_here_minimum_32_chars

# Server port (optional — defaults to 5001)
PORT=5001

# Frontend URL for CORS (development)
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

**Getting your MongoDB URI:**
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Click **Connect** → **Drivers**
4. Copy the connection string and replace `<password>` with your database user's password

---

## 📡 API Overview

All API routes are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Login, receive JWT |
| `GET` | `/api/posts` | ❌ | Search & filter posts |
| `POST` | `/api/posts` | ✅ | Create a safety post |
| `PUT` | `/api/posts/:id` | ✅ | Update own post |
| `DELETE` | `/api/posts/:id` | ✅ | Delete own post |
| `GET` | `/api/places` | ❌ | Browse safe places (filter/sort) |
| `GET` | `/api/tips` | ❌ | Search travel tips |
| `POST` | `/api/companions/plans` | ✅ | Create travel plan |
| `GET` | `/api/companions/plans` | ✅ | List travel plans |
| `POST` | `/api/companions/connect` | ✅ | Send connection request |
| `POST` | `/api/emergency/log` | ❌ | Log SOS with GPS |
| `POST` | `/api/safety/block` | ✅ | Block a user |
| `POST` | `/api/safety/report` | ✅ | Report content |

Full request/response examples are documented in [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md).  
Interactive Swagger docs are available at `/api-docs` when the backend is running.

---

## 👥 Team & Contributions

SoloSphere was built collaboratively by a five-member team, each owning a distinct engineering domain:

<br/>

<table>
  <tr>
    <th align="center">Member</th>
    <th align="center">Role</th>
    <th>Responsibilities & Contributions</th>
    <th align="center">Commits</th>
  </tr>
  <tr>
    <td align="center"><b>Rohan Singh</b></td>
    <td align="center">
      <img src="https://img.shields.io/badge/System%20Design%20Lead-FF6B6B?style=flat-square" />
    </td>
    <td>
      • Designed the three-tier architecture and GlobalRouter pattern<br/>
      • Implemented Express app setup, middleware stack, and graceful shutdown<br/>
      • Performance optimisations: parallel queries, lean(), database indexing strategy<br/>
      • Vercel serverless deployment and CI/CD pipeline<br/>
      • Scalability roadmap and technical decision documentation
    </td>
    <td align="center"><b>34</b></td>
  </tr>
  <tr>
    <td align="center"><b>Vanshika Yadav</b></td>
    <td align="center">
      <img src="https://img.shields.io/badge/Frontend%20%26%20OOP-4ECDC4?style=flat-square" />
    </td>
    <td>
      • Built all React pages: Home, Explore, Map, Companion, Emergency, Profile<br/>
      • Implemented Axios base configuration with JWT interceptors<br/>
      • Applied OOP principles (Encapsulation, Abstraction) to component design<br/>
      • Leaflet map integration and geolocation features<br/>
      • CSS styling and responsive layout across all pages
    </td>
    <td align="center"><b>28</b></td>
  </tr>
  <tr>
    <td align="center"><b>Riya Garg</b></td>
    <td align="center">
      <img src="https://img.shields.io/badge/Database%20Expert-FFE66D?style=flat-square" />
    </td>
    <td>
      • Designed all nine Mongoose schemas with validation and defaults<br/>
      • ER modelling — logical relationships between collections<br/>
      • Query optimisation: compound indexes, projection, skip/limit pagination<br/>
      • MongoDB Atlas cluster configuration and connection pooling setup<br/>
      • Data seeding scripts for development and testing
    </td>
    <td align="center"><b>19</b></td>
  </tr>
  <tr>
    <td align="center"><b>Ronit Singh</b></td>
    <td align="center">
      <img src="https://img.shields.io/badge/Patterns%20%26%20SOLID-A8E6CF?style=flat-square" />
    </td>
    <td>
      • Implemented Factory, DI, Strategy, Repository, Singleton, and Middleware patterns<br/>
      • Enforced SOLID principles across all backend route modules<br/>
      • TypeScript interface design — DTOs, validator types, response contracts<br/>
      • Wrote DESIGN_PATTERNS_ANALYSIS.md with code-level evidence<br/>
      • Code quality reviews and refactoring for maintainability
    </td>
    <td align="center"><b>22</b></td>
  </tr>
  <tr>
    <td align="center"><b>Prakhar Srivastava</b></td>
    <td align="center">
      <img src="https://img.shields.io/badge/QA%20%26%20Docs-C9B1FF?style=flat-square" />
    </td>
    <td>
      • Wrote and executed 30 test cases across all 6 API modules (100% pass rate)<br/>
      • Authored complete API_REFERENCE.md with request/response examples<br/>
      • Configured Swagger/OpenAPI documentation (auto-generated at /api-docs)<br/>
      • Wrote DOCUMENTATION.md, SETUP.md, and PROJECT_STRUCTURE.md<br/>
      • Bug reporting, issue tracking, and final integration testing
    </td>
    <td align="center"><b>15</b></td>
  </tr>
</table>

<br/>

### Contribution Statistics

```
Module Ownership
─────────────────────────────────────────────────────
System Design & Backend Arch  ████████████░░░  Rohan
Frontend & UX                 ██████████░░░░░  Vanshika
Database & Schema             ███████░░░░░░░░  Riya
Design Patterns & SOLID       █████████░░░░░░  Ronit
QA, Testing & Docs            ██████░░░░░░░░░  Prakhar
─────────────────────────────────────────────────────
Total Commits: 118  |  Issues Fixed: 33  |  PRs Merged: 24
```

---

## 🗺️ Roadmap

- [ ] Redis cache layer for tips and popular places
- [ ] Real-time SOS WebSocket alerts to admin dashboard
- [ ] Cloudinary CDN integration for image uploads
- [ ] Email/SMS notification service
- [ ] ML-based companion recommendation engine
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: describe your change"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main`

Please ensure your code follows the existing Validator → Service → Controller pattern and includes relevant test cases.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

<br/>

**Built with ❤️ for solo travelers everywhere**

<br/>

[![GitHub stars](https://img.shields.io/github/stars/connectwithvanshika/Solosphere-FS?style=social)](https://github.com/connectwithvanshika/Solosphere-FS/stargazers)
&nbsp;&nbsp;
[![GitHub forks](https://img.shields.io/github/forks/connectwithvanshika/Solosphere-FS?style=social)](https://github.com/connectwithvanshika/Solosphere-FS/network/members)

<br/>

[⭐ Star this repo](https://github.com/connectwithvanshika/Solosphere-FS) · [🐛 Report a Bug](https://github.com/connectwithvanshika/Solosphere-FS/issues) · [💡 Request a Feature](https://github.com/connectwithvanshika/Solosphere-FS/pulls)

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="divider" />

*SoloSphere — Because every journey deserves a safe start.*

</div>
