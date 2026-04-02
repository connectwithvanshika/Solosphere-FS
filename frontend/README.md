# Solosphere Frontend

**Safe Journeys & Like-Minded Connections** 🌍

A modern, responsive React.js application enabling solo travelers to discover verified safe destinations, connect with like-minded travelers, and access curated travel guidance. Built with Vite for optimal performance and developer experience.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Build for Production](#build-for-production)
- [Key Pages & Components](#key-pages--components)
- [API Integration](#api-integration)
- [Styling & Design](#styling--design)
- [Performance Optimization](#performance-optimization)
- [Contributing](#contributing)
- [Support & Resources](#support--resources)

---

## Project Overview

**Solosphere** is the frontend application of a comprehensive travel safety and community platform. It provides a beautiful, intuitive interface for solo travelers to:

- **Discover Safe Places** - Browse verified accommodations, cafés, and travel destinations
- **Share Experiences** - Create and publish safety reviews and travel recommendations
- **Find Companions** - Match with like-minded travelers based on travel plans and preferences
- **Learn Safety Tips** - Access curated travel guidance organized by city and category
- **Emergency Support** - Activate SOS features with geolocation for quick assistance
- **Plan Journeys** - Create and manage personalized travel itineraries

The frontend coordinates with a robust Node.js/Express.js backend API to provide seamless data synchronization and real-time updates.

---

## Features

### User Experience

| Feature | Description | Status |
|---------|-------------|--------|
| **User Authentication** | Login, signup, and logout with JWT token management | ✅ Implemented |
| **Responsive Design** | Mobile-first responsive UI compatible with all devices | ✅ Implemented |
| **Safe Place Discovery** | Browse, filter, and search verified accommodations | ✅ Implemented |
| **Travel Companion Matching** | Discover travelers with matching dates and preferences | ✅ Implemented |
| **Safety Ratings** | View and submit verified safety scores and reviews | ✅ Implemented |
| **Travel Planning** | Create, manage, and share travel itineraries | ✅ Implemented |
| **Travel Tips Library** | Access curated safety tips by city and category | ✅ Implemented |
| **Emergency SOS** | Geolocation-enabled emergency feature | ✅ Implemented |
| **Interactive Maps** | Visualize locations using embedded map integrations | ✅ Implemented |
| **Real-time Updates** | Live notifications for companion matches and messages | 🔄 In Progress |
| **Multi-language Support** | Language localization for diverse user base | 🔄 Planned |
| **Dark Mode** | Eye-friendly dark theme option | 🔄 Planned |

### Accessibility & Performance

- ♿ **WCAG 2.1 Compliant** - Semantic HTML and ARIA attributes for screen readers
- ⚡ **Fast Load Times** - Vite-powered development with instant HMR
- 🎯 **Optimized Bundle** - Code splitting and lazy loading for performance
- 📱 **Mobile Optimized** - Touch-friendly and optimized for small screens
- 🔒 **Secure** - XSS protection, CSRF tokens, and secure API communication

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | React.js | 18.x | UI library and component architecture |
| **Build Tool** | Vite | 5.x | Lightning-fast build tool and dev server |
| **Styling** | TailwindCSS | 3.x | Utility-first CSS framework |
| **Routing** | React Router | 6.x | Client-side routing and navigation |
| **HTTP Client** | Axios | 1.x | Promise-based HTTP requests to backend |
| **State Management** | Context API | (built-in) | Global state for auth and user data |
| **Development Tools** | ESLint | 9.x | Code quality and consistency |
| **Package Manager** | npm | Latest | Dependency and package management |
| **Hosting** | Vercel / Netlify | - | Cloud deployment and CDN |

---

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx                    # Main application component
│   ├── App.css                    # Application-level styles
│   ├── main.jsx                   # React DOM entry point
│   ├── index.css                  # Global styles
│   ├── api.js                     # Axios instance and API endpoints
│   ├── assets/                    # Images, fonts, icons
│   │   └── [static resources]
│   ├── pages/                     # Page components (routes)
│   │   ├── Home.jsx               # Landing page
│   │   ├── Login.jsx              # User login form
│   │   ├── Signup.jsx             # User registration form
│   │   ├── Explore.jsx            # Browse safe places
│   │   ├── Gallery.jsx            # Place image gallery
│   │   ├── Map.jsx                # Interactive map view
│   │   ├── MyPosts.jsx            # User's created posts
│   │   ├── TravelCompanion.jsx    # Find travel companions
│   │   ├── TravelTips.jsx         # View travel tips
│   │   ├── EmergencyMode.jsx      # Emergency SOS feature
│   │   ├── Footer.jsx             # Footer component
│   │   └── SOSButton.jsx          # Emergency button
│   └── styles/                    # Component-specific styles
│       ├── companion.css
│       ├── explore.css
│       ├── footer.css
│       ├── gallery.css
│       ├── home.css
│       ├── login.css
│       ├── map.css
│       ├── myposts.css
│       ├── signup.css
│       ├── sos.css
│       └── travel-tips.css
├── index.html                     # HTML entry point
├── vite.config.js                 # Vite configuration
├── eslint.config.js               # ESLint configuration
├── package.json                   # Dependencies and scripts
├── tailwind.config.js             # TailwindCSS configuration
└── README.md                      # This file
```

---

## Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Step 1: Clone the Repository

```bash
git clone https://github.com/connectwithvanshika/Solosphere-FS.git
cd Solosphere-FS/frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages including React, Vite, TailwindCSS, and Axios.

### Step 3: Configure Environment Variables

Create a `.env.local` file in the frontend root with:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Verify Setup

```bash
npm -v
node -v
```

Ensure both commands return valid version numbers.

---

## Environment Configuration

### Frontend Environment Variables

Create `.env.local` file with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Optional: Analytics and third-party services
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Environment Variable Requirements

| Variable | Type | Required | Example | Purpose |
|----------|------|----------|---------|---------|
| `VITE_API_URL` | String | ✅ Yes | `http://localhost:5000/api` | Backend API base URL |
| `VITE_GOOGLE_MAPS_API_KEY` | String | ❌ No | `AIzaSy...` | Google Maps integration |

**Note**: All `VITE_*` prefix variables are accessible in the browser. Never commit `.env.local` to version control.

---

## Running the Application

### Development Mode (with Hot Module Reload)

```bash
npm run dev
```

**Output:**
```
VITE v5.0.0 ready in 245 ms

➜  Local:   http://localhost:5173/
➜  Press h + enter to show help
```

Access the application at `http://localhost:5173` with automatic page refresh on code changes.

### Build for Production

```bash
npm run build
```

Creates an optimized production build in the `dist/` directory with:
- Minified JavaScript and CSS
- Tree-shaking for unused code removal
- Asset compression and hashing

### Preview Production Build Locally

```bash
npm run preview
```

Serves the built application locally to test production behavior.

### Lint Code Quality

```bash
npm run lint
```

Checks code for style issues and inconsistencies using ESLint.

---

## Key Pages & Components

### 📍 Home Page (`Home.jsx`)
- Landing page with hero section
- Feature highlights and call-to-action
- Navigation to core features
- Links to authentication pages

**Styling**: `styles/home.css`

### 🔐 Authentication Pages

#### Login (`Login.jsx`)
- Email and password input fields
- "Remember me" functionality
- Link to signup for new users
- Error handling and validation feedback

**Styling**: `styles/login.css`

#### Signup (`Signup.jsx`)
- New user registration form
- Email verification
- Password strength validation
- Redirect to login on success

**Styling**: `styles/signup.css`

### 🌍 Explore Safe Places (`Explore.jsx`)
- Browse verified safe accommodations
- Filter by:
  - City
  - Accommodation type (Hostel, Apartment, etc.)
  - Rating and safety score
  - Availability dates
- Search functionality
- Pagination for large datasets
- Each listing shows:
  - Title and description
  - Photos and ratings
  - Guest capacity
  - Night safety score

**Styling**: `styles/explore.css`

### 📸 Gallery (`Gallery.jsx`)
- Image gallery view of places
- Lightbox functionality for full-size viewing
- Filtering by city/category
- Search within gallery

**Styling**: `styles/gallery.css`

### 🗺️ Interactive Map (`Map.jsx`)
- Map visualization of safe locations
- Geolocation support
- Click on map pins to view place details
- Filter locations by category
- Real-time location updates

**Styling**: `styles/map.css`

### ✍️ My Posts (`MyPosts.jsx`)
- View user's created safety reviews and posts
- Edit or delete own posts
- View post statistics (likes, comments)
- Drafts and published filter

**Styling**: `styles/myposts.css`

### 👥 Travel Companion Matching (`TravelCompanion.jsx`)
- Find travelers with matching:
  - Destination city
  - Travel dates
  - Interests and preferences
- Send connection requests
- View match profiles
- Accept/decline requests
- Communication features

**Styling**: `styles/companion.css`

### 📚 Travel Tips Library (`TravelTips.jsx`)
- Browse curated travel safety tips
- Filter by:
  - City (Goa, Jaipur, Delhi, Mumbai, Manali)
  - Category (Safety, Transport, Wellness, Helplines)
  - Verified status
- Search functionality
- Pagination and sorting options

**Styling**: `styles/travel-tips.css`

### 🆘 Emergency SOS (`EmergencyMode.jsx` + `SOSButton.jsx`)
- Geolocation-enabled emergency feature
- One-tap SOS activation
- Automatic location capture
- Emergency contact sharing
- Real-time alert to support team

**Styling**: `styles/sos.css`

### 🔗 Footer (`Footer.jsx`)
- Links to all main pages
- Social media integration
- Contact information
- Privacy policy and terms
- Copyright information

**Styling**: `styles/footer.css`

---

## API Integration

The frontend communicates with the backend through the Axios HTTP client configured in `api.js`.

### Axios Instance Configuration

```javascript
// api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Key API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **POST** | `/auth/signup` | User registration |
| **POST** | `/auth/login` | User authentication |
| **GET** | `/posts` | Fetch travel posts |
| **POST** | `/posts` | Create new post |
| **GET** | `/places` | Get safe places list |
| **GET** | `/companions/match` | Find travel companions |
| **GET** | `/tips` | Get travel tips |
| **POST** | `/emergency/sos` | Emergency SOS submission |

For complete API documentation, see [Backend README](../backend/README.md).

---

## Styling & Design

### TailwindCSS

The project uses TailwindCSS for utility-first styling:

```javascript
// tailwind.config.js configuration
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        danger: '#FF6B6B'
      }
    }
  }
};
```

### Component-Specific Styles

Each major page has its own CSS file in `styles/` directory for:
- Custom animations
- Responsive breakpoints
- Complex layouts
- Page-specific themes

### Design System

- **Color Palette**: Vibrant, accessible colors for solo traveler theme
- **Typography**: Clear hierarchy with readable font sizes
- **Spacing**: Consistent padding and margins
- **Responsive**: Mobile-first design approach
- **Animations**: Smooth transitions and microinteractions

---

## Performance Optimization

### Vite Optimizations

✅ **Instant HMR** - Hot Module Reload for zero-delay updates during development  
✅ **Code Splitting** - Automatic route-based code splitting  
✅ **Tree Shaking** - Removes unused code from production builds  
✅ **Asset Optimization** - Images, fonts, and static files are optimized  
✅ **Lazy Loading** - Route components load on-demand  

### React Optimizations

- ⚡ **React.memo()** - Prevents unnecessary re-renders of components
- 🔄 **useCallback** - Memoizes callback functions to prevent child re-renders
- 📍 **useMemo** - Caches computed values across renders
- 🛂 **Code Splitting** - Dynamic imports for route components

### Build Output

```bash
npm run build

✓ 42 modules transformed
✓ built in 2.34s

dist/
├── index.html (15.5 kB)
├── assets/
│   ├── main-abc123.js (150 kB)
│   └── style-def456.css (85 kB)
```

---

## Folder Naming Conventions

- **pages/** - Full page components (typically mapped to routes)
- **styles/** - Component styles (one per major page)
- **assets/** - Static resources (images, fonts, icons)
- **components/** - Reusable components (if added in future)

---

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/amazing-feature
```

### 2. Make Changes with Hot Reload

```bash
npm run dev
```

### 3. Test Changes

- Manual testing in browser at `http://localhost:5173`
- Verify responsive design at multiple breakpoints
- Test API integrations with running backend

### 4. Lint Before Commit

```bash
npm run lint
```

### 5. Build for Verification

```bash
npm run build
```

### 6. Commit and Push

```bash
git add .
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

### 7. Submit Pull Request

Create a PR with:
- Clear description of changes
- Screenshots for UI changes
- Link to related issues
- Testing checklist

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Connect Repository**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configure Environment**
   - Set `VITE_API_URL` in Vercel dashboard
   - Point to production backend URL

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Deploy to Netlify

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy via Web Interface**
   - Log in to Netlify
   - Drag-and-drop `dist/` folder
   - Or connect GitHub for auto-deploy

3. **Configure Environment**
   - Set `VITE_API_URL` in build settings
   - Enable cache invalidation

---

## Troubleshooting

### Port 5173 Already in Use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### API Connection Issues

1. Verify backend is running on correct port
2. Check `VITE_API_URL` in `.env.local`
3. Ensure CORS is enabled on backend
4. Check browser console for detailed error messages

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

### Hot Module Reload Not Working

- Restart dev server: `npm run dev`
- Clear browser cache (Cmd+Shift+R on macOS)
- Check that file changes are saved

---

## Browser Support

| Browser | Min Version | Status |
|---------|-------------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| IE | Any | ❌ Not Supported |

---

## Contributing

We welcome contributions from the community! Please follow these steps:

1. **Fork the repository** on GitHub
2. **Create a feature branch** (`git checkout -b feature/your-feature`)
3. **Make your changes** with clear, descriptive commits
4. **Follow the style guide** (run `npm run lint`)
5. **Test thoroughly** (manual testing in browser)
6. **Push to your fork** and submit a Pull Request
7. **Include screenshots** for UI changes

### Code Standards

- Use functional components with hooks
- Keep components focused and reusable
- Add comments for complex logic
- Follow existing naming conventions
- Ensure responsive design works on all breakpoints

---

## Support & Resources

### Documentation

- **Frontend Repository**: [Solosphere-FS/frontend](https://github.com/connectwithvanshika/Solosphere-FS/tree/main/frontend)
- **Backend Repository**: [Solosphere-FS/backend](https://github.com/connectwithvanshika/Solosphere-FS/tree/main/backend)
- **Vite Documentation**: [vitejs.dev](https://vitejs.dev/)
- **React Documentation**: [react.dev](https://react.dev/)
- **TailwindCSS Documentation**: [tailwindcss.com](https://tailwindcss.com/)
- **Axios Documentation**: [axios-http.com](https://axios-http.com/)

### Getting Help

- **Issues & Discussions**: [GitHub Issues](https://github.com/connectwithvanshika/Solosphere-FS/issues)
- **Recommendations**: Use search feature to check existing issues
- **Bug Reports**: Include steps to reproduce and browser details

---

## License

This project is licensed under the MIT License. See LICENSE file in root directory for details.

---

## Acknowledgments

- Built with ❤️ for solo travelers prioritizing safety
- Thanks to the React and Vite communities for excellent tooling
- Special thanks to contributors who help make travel safer

---

**Made with ❤️ for safer travels worldwide.**
