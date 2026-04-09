# ⚙️ Setup & Installation Guide

Complete step-by-step guide to get SoloSphere running locally.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Repository Setup](#repository-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Database Configuration](#database-configuration)
6. [Running Locally](#running-locally)
7. [Seeding Data](#seeding-data)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

- **macOS**, **Linux**, or **Windows**
- **Node.js** v18 or higher
- **npm** v9 or higher
- **Git** for version control
- **MongoDB Atlas** account (free tier available)

### Verify Installations

```bash
# Check Node.js version (should be v18+)
node --version

# Check npm version (should be v9+)
npm --version

# Check Git installation
git --version
```

If any are missing, install from:
- [Node.js](https://nodejs.org/) — Includes npm
- [Git](https://git-scm.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — Cloud database

---

## Repository Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/connectwithvanshika/Solosphere-FS.git
cd Solosphere-FS
```

### Step 2: Verify Repository Structure

```bash
# Should see:
ls -la

# Expected output:
# backend/
# frontend/
# README.md
# vercel.json
# ...
```

---

## Backend Setup

### Step 1: Navigate to Backend

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- express
- typescript
- mongoose
- jsonwebtoken
- bcryptjs
- dotenv
- cors
- And other required packages

### Step 3: Create `.env` File

Create `backend/.env`:

```bash
touch .env
```

Add these variables:

```env
# MongoDB Connection (Required)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/solosphere?retryWrites=true&w=majority

# JWT Secret (Required - use a random string at least 32 characters)
JWT_SECRET=your_super_secret_jwt_key_here_at_least_32_characters_long

# Server Port (Optional - defaults to 5001)
PORT=5001

# Node Environment (Optional - development or production)
NODE_ENV=development
```

### Step 4: Verify Backend Setup

```bash
# Install TypeScript globally (optional but recommended)
npm install -g typescript

# Check if TypeScript compiles
npx tsc --version
```

---

## Frontend Setup

### Step 1: Navigate to Frontend

```bash
# From project root
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- react
- react-router-dom
- axios
- leaflet
- react-leaflet
- vite
- And other required packages

### Step 3: Create `.env` File

Create `frontend/.env`:

```bash
touch .env
```

Add:

```env
# Backend API URL for development
VITE_API_BASE_URL=http://localhost:5001
```

For production:
```env
VITE_API_BASE_URL=https://api.solosphere.vercel.app
```

### Step 4: Verify Frontend Setup

```bash
# Navigate back to frontend directory (if needed)
cd frontend

# Verify Vite configuration
cat vite.config.js
```

---

## Database Configuration

### Creating MongoDB Atlas Account & Cluster

#### Step 1: Sign Up for MongoDB Atlas

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Sign Up"
3. Create account with email/password or Google
4. Verify email

#### Step 2: Create Free Cluster

1. After sign-up, create a new organization
2. Create a project (e.g., "Solosphere")
3. Click "Create Deployment"
4. Choose **"Free Tier"** (M0)
5. Select preferred region (e.g., `us-east-1`)
6. Click "Create Deployment"

#### Step 3: Create Database User

1. Go to "Database Access" tab
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `solosphere_user`
5. Generate secure password (copy it)
6. Click "Create User"

#### Step 4: Get Connection String

1. Go to "Databases" tab
2. Click "Connect" button next to your cluster
3. Select "Drivers"
4. Choose "Node.js" and version 5.x
5. Copy the connection string
6. Replace `<password>` with the password from Step 3
7. Replace `<myFirstDatabase>` with `solosphere`

Example connection string:
```
mongodb+srv://solosphere_user:myPassword123@cluster.mongodb.net/solosphere?retryWrites=true&w=majority
```

#### Step 5: Whitelist IP Address

1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (for development)
   - **Security Note**: In production, add specific IP
4. Click "Confirm"

#### Step 6: Update Backend .env

Add the connection string to `backend/.env`:

```env
MONGO_URI=mongodb+srv://solosphere_user:myPassword123@cluster.mongodb.net/solosphere?retryWrites=true&w=majority
```

---

## Running Locally

### Setup: Terminal 1 (Backend)

```bash
# From project root
cd backend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Expected output:**
```
🚀 Backend server running on http://localhost:5001
📚 Docs available at http://localhost:5001/docs
✅ MongoDB connected
```

### Setup: Terminal 2 (Frontend)

```bash
# From project root (open new terminal)
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Expected output:**
```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Access Application

1. Open browser: [http://localhost:5173](http://localhost:5173)
2. Frontend loads with live hot reload
3. Backend API accessible at `http://localhost:5001/api`

---

## Seeding Data

### Seed Travel Tips

```bash
# From backend directory
npm run seed:tips
```

**Output:**
```
✅ Successfully seeded 60+ travel tips
✅ Tips added for: Delhi, Goa, Bali, Bangkok, Paris
```

### Seed Safe Places

```bash
# From backend directory
npm run seed:places
```

**Output:**
```
✅ Successfully seeded 16 verified safe places
✅ Places added across multiple cities
```

### Clear Tips (Reset)

```bash
# From backend directory
npm run clear:tips
```

---

## Environment Variables Summary

### Backend `.env`

| Variable | Required | Default | Example |
|----------|----------|---------|---------|
| `MONGO_URI` | ✅ Yes | — | `mongodb+srv://user:pass@cluster.mongodb.net/solosphere` |
| `JWT_SECRET` | ✅ Yes | — | `your_secret_key_here_32char_min` |
| `PORT` | ❌ No | 5001 | `5001` |
| `NODE_ENV` | ❌ No | `development` | `development` or `production` |

### Frontend `.env`

| Variable | Required | Default | Example |
|----------|----------|---------|---------|
| `VITE_API_BASE_URL` | ❌ No | — | `http://localhost:5001` |

---

## Npm Scripts

### Backend Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm start            # Run compiled JavaScript
npm run seed:tips    # Seed travel tips
npm run seed:places  # Seed safe places
npm run clear:tips   # Clear travel tips
```

### Frontend Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
```

---

## Troubleshooting

### Issue: "Cannot find module 'mongoose'"

**Solution:**
```bash
cd backend
npm install
```

### Issue: "MongoDB Connection Failed"

**Possible causes:**
1. Wrong connection string in `.env`
2. Database user not created
3. IP not whitelisted in MongoDB Atlas

**Solution:**
1. Verify connection string format
2. Check database user credentials
3. Whitelist your IP in MongoDB Atlas → Network Access

### Issue: "Port 5001 already in use"

**Solution:**
```bash
# Kill process on port 5001
# macOS/Linux:
lsof -i :5001
kill -9 <PID>

# Windows:
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

Or change PORT in `backend/.env`:
```env
PORT=5002
```

### Issue: "Port 5173 already in use"

**Solution:**
```bash
# macOS/Linux:
lsof -i :5173
kill -9 <PID>

# Or specify different port:
npm run dev -- --port 5174
```

### Issue: "CORS Error"

**Error message:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Verify `VITE_API_BASE_URL` in frontend `.env`
2. Check backend CORS configuration
3. Ensure backend is running on correct port

### Issue: "Cannot GET /api/..."

**Cause:** Backend isn't running

**Solution:**
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Wait for "🚀 Backend server running..." message
```

### Issue: Seed Script Not Found

**Solution:**
```bash
# Ensure you're in backend directory
cd backend

# Check package.json for scripts
cat package.json | grep -A 10 '"scripts"'

# Run with npm
npm run seed:tips
```

### Issue: TypeScript Compilation Errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear TypeScript cache
rm -rf dist/
```

---

## Quick Start Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB Atlas account created
- [ ] Repository cloned
- [ ] Backend `.env` configured with MONGO_URI
- [ ] Frontend `.env` configured with API_BASE_URL
- [ ] Dependencies installed (`npm install` in both folders)
- [ ] Backend started (`npm run dev` in backend/)
- [ ] Frontend started (`npm run dev` in frontend/)
- [ ] Backend reachable at `http://localhost:5001`
- [ ] Frontend reachable at `http://localhost:5173`
- [ ] Can create user account
- [ ] Database seeding complete (optional)

---

## Next Steps

1. **Explore Features**
   - Create an account
   - Browse safe places
   - Read travel tips
   - Create a post

2. **Review API**
   - See [API Reference](./API_REFERENCE.md)
   - Test endpoints with Postman/curl

3. **Understand Architecture**
   - Read [Architecture Guide](./ARCHITECTURE.md)
   - Review code in `backend/src/`

4. **Run Tests** (Optional)
   ```bash
   npm test
   ```

---

## Getting Help

- **Check logs**: Look at terminal output for error messages
- **See troubleshooting**: Section above for common issues
- **Read documentation**: See [Complete Documentation](./DOCUMENTATION.md)
- **GitHub Issues**: [Report problems](https://github.com/connectwithvanshika/Solosphere-FS/issues)

---

For more information, see:
- [Main README](../README.md)
- [Complete Documentation](./DOCUMENTATION.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [API Reference](./API_REFERENCE.md)
