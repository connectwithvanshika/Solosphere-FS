
# 🌍 **SoloSphere – Safe Journeys & Meaningful Connections**

SoloSphere is a community-driven platform designed to help **solo travelers—especially women—travel confidently and safely**.
It allows users to discover, share, and review **verified safe places**, including cafés, hostels, apartments, camps, and general travel safety tips.

✨ Built with **React + Express + MongoDB**, SoloSphere creates a trusted digital space for real travelers to help each other.

---

## ⭐ **1. Overview**

Traveling solo often comes with uncertainty around **safety, trust, and verified information**. Generic travel sites don’t focus on safety from a solo traveler’s perspective.

SoloSphere solves this by offering:

✔ Verified safe places
✔ Real user-generated safety posts
✔ City-wise travel tips
✔ Safety guides and categories
✔ Search, filter, and pagination for efficient discovery

A platform **built by travelers, for travelers** 🧭✨

---

## ❗ **2. Problem Statement**

Solo travelers—especially women—face:

* Unsafe accommodations
* Unverified online reviews
* Lack of women-safety–focused travel guidance
* Difficulty finding trustworthy local spots

**SoloSphere** bridges this gap by providing a secure, community-driven platform where users can:

✔ Share real safety experiences
✔ Rate and discover trusted places
✔ Access verified travel tips
✔ Build confidence while exploring alone

---

## 🏗️ **3. System Architecture**

```
Frontend (React.js) → Backend (Express.js API) → Database (MongoDB Atlas)
```

### **Architecture Components**

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Frontend       | React.js, Axios, React Router                   |
| Backend        | Node.js, Express.js                             |
| Database       | MongoDB Atlas (NoSQL)                           |
| Authentication | JWT                                             |
| Deployment     | Frontend → Vercel / Backend → Vercel Serverless |
| APIs           | Internal REST APIs                              |

---

## 🚀 **4. Key Features**

### 🔐 **Authentication & Authorization**

* User signup, login, logout
* JWT token-based auth
* Protected routes
* Role-based rules (User/Admin)

---

### 📝 **CRUD Functionality (Create / Read / Update / Delete)**

Your **MyPosts** page supports full CRUD using Express APIs:

#### ✔ CREATE

Users can create a post with:

* Title
* Location
* Category
* Rating
* Description
* Image URL

```js
axios.post("/api/posts", formData, authConfig());
```

#### ✔ READ (Fetch My Posts)

Automatically fetch logged-in user’s posts.

```js
axios.get("/api/posts/mine", authConfig());
```

#### ✔ UPDATE

Users can edit a post using a modal.

```js
axios.put(`/api/posts/${id}`, formData, authConfig());
```

#### ✔ DELETE

Users can remove their posted location.

```js
axios.delete(`/api/posts/${id}`, authConfig());
```

**UI updates instantly** after all CRUD operations.

---

### 🔍 **Searching, Filtering, Sorting & Pagination**

SoloSphere includes powerful browsing tools:

| Feature        | Description                                        |
| -------------- | -------------------------------------------------- |
| **Search**     | Search by city, keywords, or category              |
| **Filter**     | Filter by category (Hostel, Café, Apartment, Camp) |
| **Sort**       | Sort by rating, reviews, or most recent            |
| **Pagination** | Smooth backend pagination for performance          |

All implemented via backend queries:

```
/api/places?search=&category=&sort=&page=&limit=
```

---

### 🧭 **Travel Tips Module**

Includes:

* City-based tips
* Category-based guides (Safety, Transport, Wellness, Helplines)
* Each city has 3 tips per category
* Pagination
* Modal for full tip reading

---

### 🪪 **Verified Badges**

Admin users can mark places as **Verified**, increasing trust for solo travelers.

---

## 🧰 **5. Tech Stack**

### **Frontend**

* React.js
* React Router
* Axios
* CSS Modules / Vanilla CSS

### **Backend**

* Node.js
* Express.js
* JWT Authentication

### **Database**

* MongoDB Atlas

### **Hosting**

| Service               | Purpose          |
| --------------------- | ---------------- |
| **Vercel**            | Frontend Hosting |
| **Vercel Serverless** | Backend Hosting  |
| **MongoDB Atlas**     | Cloud Database   |

---

## 📡 **6. API Overview**

| Endpoint           | Method | Description                           | Access             |
| ------------------ | ------ | ------------------------------------- | ------------------ |
| `/api/auth/signup` | POST   | Register user                         | Public             |
| `/api/auth/login`  | POST   | Login user (JWT)                      | Public             |
| `/api/posts`       | GET    | Get all posts                         | Auth               |
| `/api/posts`       | POST   | Create post                           | Auth               |
| `/api/posts/:id`   | PUT    | Update post                           | Auth (Owner/Admin) |
| `/api/posts/:id`   | DELETE | Delete post                           | Auth (Owner/Admin) |
| `/api/posts/mine`  | GET    | Fetch user’s own posts                | Auth               |
| `/api/places`      | GET    | Search/filter safe places             | Public             |
| `/api/tips`        | GET    | Travel tips with city/category filter | Public             |

---

## 🌟 **7. Impact**

SoloSphere creates a **trusted environment** for solo travelers by offering:

* Verified safety experiences
* Community knowledge
* Trusted local recommendations
* City-wise guidance
* Empowering women traveling alone

It encourages **safer, more confident, and meaningful travel worldwide**.

---

## 📈 **8. Additional Functionalities**

### 🔎 **Advanced Search**

Search across:

* Cities
* Place names
* Categories

### 🎯 **Filtering**

Refine results by:

* Category
* City
* Rating

### ↕ **Sorting**

Sort by:

* Highest rated
* Most reviewed
* Most recent

### 📄 **Pagination**

Provides:

* Fast loading
* Memory efficiency
* Better UX on long lists

---

## 🧪 **9. Installation & Setup**

### **Clone Repo**

```sh
git clone https://github.com/your-username/solosphere.git
cd solosphere
```

### **Install Backend**

```sh
cd backend
npm install
```

### **Install Frontend**

```sh
cd frontend
npm install
```

### **Environment Variables**

Create `.env` files:

#### Backend `.env`

```
MONGO_URI=mongodb+srv://connectwithvanshika:Vanshika%402025@cluster0.etzq1zs.mongodb.net/solosphere?
JWT_SECRET=supersecretkey
PORT=5001

```

### **Run Backend**

```sh
npm start
```

### **Run Frontend**

```sh
npm run dev
```

---

## 🧡 **10. Contributing**

Pull requests are welcome!
To contribute:

1. Fork repo
2. Create new branch
3. Submit PR

---

## 💬 **11. Contact**

Feel free to reach out for suggestions or contributions 🤍
**Built with love for solo travelers.** ✨


