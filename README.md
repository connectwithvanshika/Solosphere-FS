````markdown
# SoloSphere – Safe Journeys & Meaningful Connections

SoloSphere is a community-driven platform designed to help solo travelers, especially women, travel confidently and safely. It enables users to discover, share, and review verified safe places such as cafés, hostels, apartments, camps, and travel safety tips.

Built using React, Express, and MongoDB, SoloSphere creates a trusted digital ecosystem where real travelers contribute meaningful insights.

---

## 1. Overview

Solo travel often involves uncertainty related to safety, trust, and reliable information. Most travel platforms do not prioritize safety from a solo traveler’s perspective.

SoloSphere addresses this gap by providing:

- Verified safe places  
- Real user-generated safety posts  
- City-wise travel tips  
- Categorized safety guides  
- Search, filter, and pagination for efficient discovery  

It is a platform built by travelers, for travelers.

---

## 2. Problem Statement

Solo travelers, particularly women, face several challenges:

- Unsafe accommodations  
- Unreliable or misleading online reviews  
- Lack of safety-focused travel guidance  
- Difficulty identifying trustworthy local places  

SoloSphere provides a solution by offering a secure, community-driven platform where users can:

- Share real safety experiences  
- Discover and rate trusted places  
- Access verified travel tips  
- Travel with increased confidence  

---

## 3. System Architecture

Frontend (React.js) → Backend (Express.js API) → Database (MongoDB Atlas)

### Architecture Components

| Layer          | Technology                    |
|----------------|-----------------------------|
| Frontend       | React.js, Axios, React Router |
| Backend        | Node.js, Express.js          |
| Database       | MongoDB Atlas                |
| Authentication | JWT                          |
| Deployment     | Vercel (Frontend & Backend)  |
| APIs           | REST APIs                    |

---

## 4. Key Features

### Authentication & Authorization

- User signup, login, logout  
- JWT-based authentication  
- Protected routes  
- Role-based access control  

---

### CRUD Functionality

Users can create, read, update, and delete posts.

**Create**
```js
axios.post("/api/posts", formData, authConfig());
````

**Read**

```js
axios.get("/api/posts/mine", authConfig());
```

**Update**

```js
axios.put(`/api/posts/${id}`, formData, authConfig());
```

**Delete**

```js
axios.delete(`/api/posts/${id}`, authConfig());
```

---

### Search, Filter, Sort, and Pagination

* Search by city, keywords, or category
* Filter by categories such as Hostel, Café, Apartment, Camp
* Sort by rating, reviews, or recency
* Backend-powered pagination

```bash
/api/places?search=&category=&sort=&page=&limit=
```

---

## 5. Tech Stack

### Frontend

* React.js
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* JWT Authentication

### Database

* MongoDB Atlas

---

## 6. Installation & Setup

### Clone Repository

```bash
git clone https://github.com/connectwithvanshika/Solosphere-FS.git
cd solosphere
```

### Install Backend

```bash
cd backend
npm install
```

### Install Frontend

```bash
cd frontend
npm install
```

### Environment Variables

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5001
```

### Run Backend

```bash
npm start
```

### Run Frontend

```bash
npm run dev
```

```


