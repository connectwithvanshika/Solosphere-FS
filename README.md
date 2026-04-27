<div align="center">
  <h1>SoloSphere</h1>
  <p><strong>A community-driven safety platform for solo travelers</strong></p>

  ![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js)
  ![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)
  ![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.x%2B-3178C6?style=flat-square&logo=typescript)
  ![MongoDB](https://img.shields.io/badge/MongoDB-8.x-13AA52?style=flat-square&logo=mongodb)
  ![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite)
  ![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
  ![Deployment](https://img.shields.io/badge/Deployment-Vercel-000000?style=flat-square&logo=vercel)

</div>

---

## 📋 Quick Links

| Link | Description |
|------|-------------|
| [Full Documentation](./docs/DOCUMENTATION.md) | Complete setup, architecture, and detailed features |
| [Architecture Overview](./docs/ARCHITECTURE.md) | System design, UML diagrams, and technical decisions |
| [API Reference](./docs/API_REFERENCE.md) | All endpoints and request/response formats |
| [Setup & Installation](./docs/SETUP.md) | Step-by-step installation guide |
| [Project Structure](./docs/PROJECT_STRUCTURE.md) | Codebase organization and file layout |

---

## Project Overview

**SoloSphere** is a full-stack web application designed to empower solo travelers with verified, community-curated information and safety tools.

### Key Features

- **Verified Safe Places** — Hostels, cafés, apartments, camps, and nature spots with community ratings
- **Safety Reviews** — Share and read real travel experiences from verified community members
- **Interactive Maps** — Discover destinations with geolocation-enabled features
- **Travel Companions** — Find companions by city, dates, and preferences
- **Emergency SOS** — One-tap emergency alert with GPS tracking
- **Travel Tips** — 60+ curated tips across Safety, Transport, Wellness, and Helplines
- **Safety Controls** — Block users, report content, and community moderation
- **Secure Authentication** — JWT-based login/signup with role-based access control

### Problem Solved

Solo travel presents safety challenges, especially for women and first-time travelers:
- Unverified accommodation reviews
- Fragmented local guidance
- Lack of safety-focused communities
- Limited access to emergency resources

**SoloSphere** creates a secure, authentic platform where every piece of content is user-generated, community-verified, and safety-first.

---

## Contributions

Rohan Singh – System Design & SDLC
Vanshika Yadav – OOP & Frontend
Riya Garg – Database & UML
Ronit Singh – Design Patterns & SOLID
Prakhar Srivastava – Testing & Documentation


---

## Quick Start

### Prerequisites
- **Node.js** v18+ | **npm** v9+
- **MongoDB Atlas** (free tier available)
- **Git**

### Installation

```bash
# Clone repository
git clone https://github.com/connectwithvanshika/Solosphere-FS.git
cd Solosphere-FS

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### Run Locally

```bash
# Terminal 1 — Backend (port 5001)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

**For detailed setup instructions**, see [Setup & Installation](./SETUP.md)

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, React Router, Axios, Leaflet Maps, Vite |
| **Backend** | Node.js, Express 5, TypeScript, JWT, bcryptjs |
| **Database** | MongoDB Atlas, Mongoose 8 |
| **Deployment** | Vercel (Frontend & Serverless Backend) |

---

## Project Organization

```
solosphere/
├── Documentation
│   ├── README.md (this file)
│   ├── DOCUMENTATION.md (full details)
│   ├── ARCHITECTURE.md (system design)
│   ├── API_REFERENCE.md (endpoints)
│   └── PROJECT_STRUCTURE.md (codebase)
│
├── backend/                  ← Express API Server
│   ├── src/
│   │   ├── controllers/     ← Business logic
│   │   ├── routes/          ← API endpoints
│   │   ├── models/          ← Database schemas
│   │   ├── middlewares/     ← Auth & utilities
│   │   └── config/          ← DB connection
│   └── package.json
│
└── frontend/                ← React + Vite Client
    ├── src/
    │   ├── pages/          ← Route components
    │   ├── styles/         ← Component styles
    │   ├── api.js          ← Axios config
    │   └── main.jsx        ← Entry point
    └── package.json
```

 **View full structure**: [Project Structure](./PROJECT_STRUCTURE.md)

---

## Documentation

For more information, explore these documents:

- **[Full Documentation](./DOCUMENTATION.md)** — Complete overview, all features, database models
- **[Architecture Guide](./ARCHITECTURE.md)** — System design, technical decisions, data flow
- **[API Reference](./API_REFERENCE.md)** — All endpoints, request/response formats, examples
- **[Setup Guide](./SETUP.md)** — Installation, environment variables, running locally
- **[Project Structure](./PROJECT_STRUCTURE.md)** — File organization and module breakdown

---

## Contributing

We welcome contributions! Follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m "feat: add amazing feature"`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure code follows existing patterns and includes tests.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## All Contributors

Thanks to all the amazing people who contributed to this project! 

<a href="https://github.com/connectwithvanshika/Solosphere-FS/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=connectwithvanshika/Solosphere-FS" alt="Contributors" />
</a>

**Want to see your profile here?** [Contribute to SoloSphere](https://github.com/connectwithvanshika/Solosphere-FS/blob/main/CONTRIBUTING.md)

---

## Support & Resources

- **GitHub Issues** — [Report bugs](https://github.com/connectwithvanshika/Solosphere-FS/issues)
- **MongoDB** — [docs.mongodb.com](https://docs.mongodb.com)
- **Express.js** — [expressjs.com](https://expressjs.com)
- **React** — [react.dev](https://react.dev)
- **Vite** — [vitejs.dev](https://vitejs.dev)

---

<div align="center">
  <p><strong>Built with ❤️ for solo travelers everywhere</strong></p>
  <p>
    <a href="https://github.com/connectwithvanshika/Solosphere-FS">Star us on GitHub</a> •
    <a href="https://github.com/connectwithvanshika/Solosphere-FS/issues">Report Bug</a> •
    <a href="https://github.com/connectwithvanshika/Solosphere-FS/pulls">Request Feature</a>
  </p>
</div>

---
