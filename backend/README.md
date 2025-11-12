1. SoloSphere
So – Safe Journeys & Like-Minded Connections 

2. Problem Statement
Traveling solo, especially for women, often comes with uncertainty about safety, trust, and reliable local guidance. Many travelers rely on random online reviews that don’t specifically focus on safety experiences.
 SafeSteps aims to create a secure, community-driven platform where solo travelers can share, rate, and discover verified safe cafés, accommodations, and travel tips based on real user experiences. This platform bridges the gap between travel exploration and personal safety by building a trusted digital community.

3. System Architecture
Flow:
 Frontend → Backend (API) → Database
Architecture Description:
Frontend: React.js with React Router for smooth page navigation and data fetching using Axios.


Backend: Node.js + Express.js for API handling and business logic.


Database: MongoDB Atlas (Non-relational) to store users, reviews, posts, and ratings.


Authentication: JWT-based secure login and signup.


Hosting:


Frontend: Vercel / Netlify


Backend: Render / Railway


Database: MongoDB Atlas



4. Key Features
Category
Features
Authentication & Authorization
User registration, login, logout with JWT; Role-based access (User/Admin)
CRUD Operations
Create, Read, Update, and Delete safety posts, reviews, and travel tips
Frontend Routing
Pages: Home, Login, Register, Explore, Add Post, City Details, Profile
Filtering & Searching
Filter safe places by city, category (café, hostel, spot), or rating
Map Integration
Google Maps / Leaflet API for location visualization
Verified Badges
Admin can verify trusted places for credibility
Community Interaction
Users can like/comment on posts to support others
Hosting
Fully deployed frontend and backend with live database


5. Tech Stack
Layer
Technologies
Frontend
React.js, React Router, Axios, TailwindCSS
Backend
Node.js, Express.js
Database
MongoDB Atlas
Authentication
JWT (JSON Web Token)
Hosting
Frontend → Vercel / Netlify Backend → Render / Railway Database → MongoDB Atlas
APIs / Integrations
Google Maps / Leaflet API for location display


6. API Overview
Endpoint
Method
Description
Access
/api/auth/signup
POST
Register a new user
Public
/api/auth/login
POST
Authenticate user and return JWT
Public
/api/posts
GET
Get all travel safety posts
Authenticated
/api/posts
POST
Create a new post/review
Authenticated
/api/posts/:id
PUT
Update a post
Authenticated (Owner/Admin)
/api/posts/:id
DELETE
Delete a post
Admin only
/api/posts/search
GET
Search/filter posts by city or category
Authenticated
/api/verify/:id
PATCH
Mark a place as “Verified Safe”
Admin only


7. Impact
SafeSteps empowers solo travelers by giving them a trusted digital space to explore, share, and stay safe.
 By combining community experiences with verified information, it promotes safer, more confident travel — especially for women travelers and first-time explorers .

Additional Functionalities


SafeSteps has been designed with scalability and user convenience in mind. The platform effectively integrates key features like Searching, Sorting, Filtering, and Pagination to enhance user experience and data accessibility.
Searching: Users can easily find safe cafés, hostels, and travel spots by city name, category, or keyword through the /api/posts/search endpoint.


Filtering: Advanced filters allow users to refine results based on criteria like city, place type (café, hostel, spot), or safety ratings, ensuring relevant and efficient exploration.


Sorting: Posts can be sorted dynamically — for example, by highest rating, most recent, or most liked — providing a customizable browsing experience.


Pagination: To optimize performance and navigation, data is displayed in pages (e.g., 10 posts per view), ensuring smooth content loading and better usability even with large datasets.


Together, these functionalities make SafeSteps a feature-rich, user-focused, and efficient travel safety platform, combining trusted community insights with modern web technologies to create safer journeys and meaningful traveler connections.

