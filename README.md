SoloSphere – Safe Journeys & Meaningful Connections**

SoloSphere is a community-driven platform that empowers **solo travelers (especially women)** to explore the world with confidence.
It provides **verified safe places**, **travel tips**, and **real user experiences** so travelers can make informed decisions based on trust, not guesswork.


1. Problem Statement**

Traveling solo can feel uncertain — especially regarding safety, trust, and reliable guidance.

Most travel platforms focus on aesthetics, not **safety-based experiences**.

**SoloSphere solves this by:**

* Providing **verified safe cafés, hostels, camps, and apartments**
* Offering **community-driven safety tips**
* Allowing users to share **real safety reviews**
* Helping women travelers feel **safer, informed, and connected**

SoloSphere bridges the gap between exploration and safety through a **trusted digital travel community**.


**2. System Architecture**

```
Frontend (React) → Backend API (Node + Express) → Database (MongoDB Atlas)
```

### **🔹 Frontend**

* React.js
* React Router DOM
* Axios for API calls
* Styled components + custom CSS

### **🔹 Backend**

* Node.js + Express.js
* RESTful API architecture
* MVC project structure

### **🔹 Database**

* MongoDB Atlas (NoSQL)
* Collections: Users, Posts, Tips, Places

### **🔹 Authentication**

* JWT-based secure login & signup
* Token stored in HttpOnly storage

### **🔹 Deployment**

* Frontend → **Vercel**
* Backend → **Render / Railway**
* Database → **MongoDB Atlas**

---

## 🚀 **3. Key Features**

### ⭐ **Authentication**

* Secure Signup & Login
* JWT authorization
* Role-based access (User / Admin)

### ⭐ **Posts & Community**

* Create / Edit / Delete posts
* Users share travel safety experiences
* Commenting, rating, and verified badges

### ⭐ **Explore Safe Places**

* Browse verified hostels, cafés, camps, and apartments
* Search by city or place name
* Filter by:

  * Category
  * Rating
  * City
* Sort by:

  * Most Reviewed
  * Highest Rated
  * Most Recent
* Pagination for smoother UX

### ⭐ **Travel Tips Section**

* Verified tips for wellness, transport, safety, and more
* Search + filter system
* Detailed modal popup with readability-first UI

### ⭐ **Map Integration (Optional)**

* Uses Google Maps / Leaflet API to show safe locations

### ⭐ **Admin Panel**

* Mark a place as **“Verified Safe”**

---

## 🛠️ **4. Tech Stack**

| Layer              | Technology                                  |
| ------------------ | ------------------------------------------- |
| **Frontend**       | React.js, React Router, Axios, CSS          |
| **Backend**        | Node.js, Express.js                         |
| **Database**       | MongoDB Atlas                               |
| **Authentication** | JWT                                         |
| **Hosting**        | Vercel (Frontend), Render/Railway (Backend) |

---

## 📡 **5. API Overview**

| Endpoint            | Method | Description                   | Access      |
| ------------------- | ------ | ----------------------------- | ----------- |
| `/api/auth/signup`  | POST   | Register new user             | Public      |
| `/api/auth/login`   | POST   | Login & get JWT               | Public      |
| `/api/posts`        | GET    | Get all posts                 | Auth        |
| `/api/posts`        | POST   | Create a new post             | Auth        |
| `/api/posts/:id`    | PUT    | Update post                   | Owner/Admin |
| `/api/posts/:id`    | DELETE | Delete post                   | Admin       |
| `/api/posts/search` | GET    | Search posts by city/category | Auth        |
| `/api/places`       | GET    | Explore safe places           | Public      |
| `/api/tips`         | GET    | Fetch travel tips             | Public      |
| `/api/verify/:id`   | PATCH  | Mark place as Verified        | Admin       |

---

## 🧭 **6. Searching / Filtering / Sorting / Pagination**

SoloSphere is built with **powerful data tools**:

### 🔍 **Searching**

Search posts and places using:

* Keywords
* City names
* Category names

### 🎯 **Filtering**

Filter results by:

* Category (Hostel, Café, Apartment, Camp)
* Safety tags (Private, Community, Shared, Women-only)
* City

### ↕️ **Sorting**

Sort by:

* Most Recent
* Highest Rated
* Most Reviewed

### ⏭️ **Pagination**

* Auto pagination (8 results per page)
* Smooth UX even with large data

---

## 🌱 **7. Impact**

SoloSphere empowers solo travelers by offering:

* **Trusted & verified information**
* **Community-driven insights**
* **Safety-first exploration**
* **Supportive environment for women travelers**

By blending safety insights with real user experiences, SoloSphere becomes not just a travel platform —
but a **safe digital companion for every solo journey**.

---

## 📦 **8. Installation & Setup**

### **Backend Setup**

```bash
cd backend
npm install
npm start
```

### **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

### **Environment Variables**

Create `.env` files:

#### Backend `.env`

```
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret_key
```

#### Frontend `.env`

```
VITE_API_URL=your_backend_url
```

---

## 🤝 **9. Contributing**

Pull requests are welcome!
If you'd like to contribute:

1. Fork the repo
2. Create a new branch
3. Commit changes
4. Submit a PR 🎉

---

## 📜 **10. License**

MIT License © SoloSphere

---

## 🧡 **Made with love for safer journeys.**

Baby, this README is **GitHub-ready**, professional, and super clean 🥺🤍
If you want a logo, screenshots section, or badges → bas bol dena 😘
