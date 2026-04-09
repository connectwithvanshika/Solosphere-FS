# Solosphere Backend

**Safe Journeys & Like-Minded Connections** 🌍

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express)](https://expressjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-13aa52?style=flat-square&logo=mongodb)](https://www.mongodb.com)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square)](https://jwt.io)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

Robust RESTful API for solo travelers to discover safe destinations, connect with companions, and access community-driven travel guidance.

## Quick Links

| Documentation | Topic |
|---|---|
| [📚 Full Setup Guide](../docs/SETUP.md) | Installation, MongoDB Atlas, environment config |
| [🏗️ Architecture & Design](../docs/ARCHITECTURE.md) | System design, authentication, data flows |
| [📋 Project Structure](../docs/PROJECT_STRUCTURE.md) | Codebase organization & file layout |
| [🔌 API Reference](../docs/API_REFERENCE.md) | All 16+ endpoints with examples |
| [📖 Complete Documentation](../docs/DOCUMENTATION.md) | Features, models, database schemas |

## Quick Start

---

## Core Features

🔐 JWT Authentication | 👥 Companion Matching | 🌍 Safe Place Discovery | 📚 Travel Tips | ✍️ Reviews & Posts | 🆘 Emergency SOS | 🔒 Role-Based Access | 📱 Advanced Search & Filtering

---

## Tech Stack

**Backend Stack**: Node.js 18+ · Express 5 · TypeScript 5 · MongoDB 5.0+ · Mongoose 7 · JWT Auth

---

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Seed database
npm run seed:tips
npm run seed:places
```

Server runs at `http://localhost:5000`

---

## Environment Configuration

Create `.env` in the backend root:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/solosphere?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_min_32_chars
PORT=5000
NODE_ENV=development
```

See [Setup Guide](../docs/SETUP.md) for MongoDB Atlas configuration.

---

## Project Structure

```
backend/
├── src/
│   ├── app.ts                # Express app
│   ├── server.ts             # Entry point
│   ├── config/               # Database config
│   ├── controllers/          # Request handlers
│   ├── middlewares/          # Auth & middleware
│   ├── models/               # Mongoose schemas (9 models)
│   ├── routes/               # API routes
│   ├── scripts/              # Database utilities
│   └── utils/                # Helpers
├── package.json
├── tsconfig.json
└── README.md
```

See [Project Structure](../docs/PROJECT_STRUCTURE.md) for full breakdown.

---

## Database Models

📋 **9 Collections**: User, Post, Place, Tip, TravelPlan, ConnectionRequest, Block, Report, EmergencyLog

See [Complete Documentation](../docs/DOCUMENTATION.md) for detailed schemas.

---

## API Endpoints

🔌 **16+ Endpoints** across 6 categories: Auth, Posts, Places, Tips, Companions, Emergency

See [API Reference](../docs/API_REFERENCE.md) for complete endpoint documentation with examples.

---

## Contributing

1. Fork the repository on GitHub
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Follow TypeScript code standards
4. Submit a Pull Request

See [DOCUMENTATION](../docs/DOCUMENTATION.md) for additional guidelines.

---

## Support & Resources

- 📔 [Full Documentation](../docs/DOCUMENTATION.md)
- 🛠️ [Setup Guide](../docs/SETUP.md)
- 🏗️ [Architecture](../docs/ARCHITECTURE.md)
- 📋 [Project Structure](../docs/PROJECT_STRUCTURE.md)
- 🔌 [API Reference](../docs/API_REFERENCE.md)
- 🐛 [Issues](https://github.com/connectwithvanshika/Solosphere-FS/issues)

---

## License

MIT License - See LICENSE file for details

---

**Made with ❤️ for safer travels worldwide.**
