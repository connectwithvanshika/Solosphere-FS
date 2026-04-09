# Solosphere Frontend

**Safe Journeys & Like-Minded Connections** 🌍

[![React](https://img.shields.io/badge/React-18.x-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Axios](https://img.shields.io/badge/Axios-1.x-671ddf?style=flat-square&logo=axios)](https://axios-http.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

Modern React.js UI for solo travelers to discover safe destinations, connect with companions, and access travel guidance.

## Quick Links

| Documentation | Topic |
|---|---|
| [📚 Full Setup Guide](../docs/SETUP.md) | Installation, configuration, deployment |
| [🏗️ Architecture & Design](../docs/ARCHITECTURE.md) | System design, component structure |
| [📋 Project Structure](../docs/PROJECT_STRUCTURE.md) | Codebase organization and file layout |
| [🔌 API Reference](../docs/API_REFERENCE.md) | Backend endpoints and integration |
| [📖 Complete Documentation](../docs/DOCUMENTATION.md) | Features, models, and system overview |

## Quick Start

---

## Core Features

🔐 User Authentication | 🌍 Safe Place Discovery | 👥 Companion Matching | 📚 Travel Tips | 🗺️ Interactive Maps | 🆘 Emergency SOS | ✍️ Reviews & Posts | 📱 Responsive Design

---

## Tech Stack

**Frontend Stack**: React 18 · Vite 5 · TailwindCSS 3 · React Router 6 · Axios 1 · ESLint 9

---

## Development

```bash
# Install dependencies
npm install

# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

Server runs at `http://localhost:5173`

---

## Environment Configuration

Create `.env.local` in the frontend root:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

See [Setup Guide](../docs/SETUP.md) for detailed configuration.

---

## Project Structure

```
frontend/
├── src/
│   ├── pages/              # Route components
│   ├── styles/             # Component styles
│   ├── assets/             # Static files
│   ├── api.js              # Axios configuration
│   └── App.jsx             # Root component
├── package.json
├── vite.config.js
└── README.md
```

See [Project Structure](../docs/PROJECT_STRUCTURE.md) for full breakdown.

---

## Contributing

1. Fork the repository on GitHub
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Follow the code standards (run `npm run lint`)
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
