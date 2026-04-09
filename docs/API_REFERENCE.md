# 📡 API Reference

## Base URL

```
http://localhost:5001    (Development)
https://api.solosphere.vercel.app    (Production)
```

## Authentication

All protected routes require:
```http
Authorization: Bearer <JWT_TOKEN>
```

Obtain JWT token from `/api/auth/login` endpoint.

---

## Table of Contents

1. [Authentication](#authentication-endpoints)
2. [Posts](#posts-endpoints)
3. [Places](#places-endpoints)
4. [Tips](#tips-endpoints)
5. [Travel Companions](#travel-companions-endpoints)
6. [Emergency](#emergency-endpoints)
7. [Error Codes](#error-codes)

---

## Authentication Endpoints

### Register User

**POST** `/api/auth/signup`

Register a new user account.

**Request Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error (400 Bad Request)**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

### Login User

**POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Request Body**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error (401 Unauthorized)**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## Posts Endpoints

### Get All Posts

**GET** `/api/posts`

Retrieve all community safety reviews with pagination.

**Query Parameters**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | Number | Page number (default: 1) |
| `limit` | Number | Items per page (default: 10) |
| `city` | String | Filter by city |
| `category` | String | Filter by category |

**Authentication** ✅ Required

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": { "_id": "507f1f77bcf86cd799439012", "name": "John Doe" },
      "title": "Safe Hostel in Goa",
      "excerpt": "Great hostel with friendly staff",
      "city": "Goa",
      "category": "Accommodation",
      "rating": 4.5,
      "likes": ["507f1f77bcf86cd799439013"],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50
  }
}
```

---

### Create Post

**POST** `/api/posts`

Create a new community safety review.

**Authentication** ✅ Required

**Request Body**
```json
{
  "title": "Safe Hostel in Goa",
  "excerpt": "Great hostel with friendly staff",
  "content": "This hostel was amazing. The staff was very helpful...",
  "city": "Goa",
  "category": "Accommodation",
  "rating": 4.5,
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "title": "Safe Hostel in Goa",
    "rating": 4.5,
    "verified": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get User's Posts

**GET** `/api/posts/mine`

Retrieve all posts created by the logged-in user.

**Authentication** ✅ Required

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "title": "Safe Hostel in Goa",
      "rating": 4.5,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Get Post by ID

**GET** `/api/posts/:id`

Retrieve a specific post by its ID.

**Authentication** ✅ Required

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": { "_id": "507f1f77bcf86cd799439011", "name": "John Doe" },
    "title": "Safe Hostel in Goa",
    "content": "This hostel was amazing...",
    "rating": 4.5,
    "verified": false,
    "likes": [],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Update Post

**PUT** `/api/posts/:id`

Update a post (owner or admin only).

**Authentication** ✅ Required

**Request Body**
```json
{
  "title": "Updated Title",
  "rating": 5,
  "content": "Updated content..."
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "title": "Updated Title",
    "rating": 5,
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

---

### Delete Post

**DELETE** `/api/posts/:id`

Delete a post (owner or admin only).

**Authentication** ✅ Required

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

## Places Endpoints

### Get All Places

**GET** `/api/places`

Browse verified safe places with filtering and sorting.

**Query Parameters**
| Parameter | Type | Description |
|-----------|------|-------------|
| `city` | String | Filter by city |
| `category` | String | Filter by category (Hostel, Café, Apartment, Camp, Nature) |
| `minRating` | Number | Minimum rating (0-5) |
| `sortBy` | String | Sort by: `rating`, `reviewCount`, `recent` |
| `page` | Number | Page number (default: 1) |
| `limit` | Number | Items per page (default: 10) |

**Authentication** ❌ Not required

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "name": "Blue Ocean Hostel",
      "city": "Goa",
      "category": "Hostel",
      "description": "Beachfront hostel with great views",
      "rating": 4.8,
      "reviewCount": 42,
      "verified": true,
      "imageUrl": "https://example.com/hostel.jpg"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25
  }
}
```

---

### Get Place by ID

**GET** `/api/places/:id`

Retrieve details of a specific place.

**Authentication** ❌ Not required

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Blue Ocean Hostel",
    "city": "Goa",
    "category": "Hostel",
    "description": "Beachfront hostel with great views...",
    "rating": 4.8,
    "reviewCount": 42,
    "verified": true,
    "coordinates": {
      "lat": 15.4909,
      "lng": 73.8278
    }
  }
}
```

---

### Verify Place (Admin)

**POST** `/api/places/verify/:id`

Mark a place as verified (admin only).

**Authentication** ✅ Required (Admin)

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Place verified successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "verified": true
  }
}
```

---

## Tips Endpoints

### Get Travel Tips

**GET** `/api/tips`

Retrieve travel tips with filtering by city and category.

**Query Parameters**
| Parameter | Type | Description |
|-----------|------|-------------|
| `city` | String | Filter by city (Delhi, Goa, Bali, Bangkok, Paris) |
| `category` | String | Filter by category (Safety, Transport, Wellness, Helplines) |
| `page` | Number | Page number (default: 1) |
| `limit` | Number | Items per page (default: 10) |

**Authentication** ❌ Not required

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "city": "Goa",
      "category": "Safety",
      "title": "Night Travel Safety",
      "excerpt": "Tips for traveling safely at night in Goa",
      "content": "1. Always use registered taxis...",
      "verified": true,
      "image": "https://example.com/tip.jpg"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 15
  }
}
```

---

## Travel Companions Endpoints

### Find Travel Companions

**GET** `/api/companions/match`

Find potential travel companions by city and dates.

**Query Parameters**
| Parameter | Type | Description |
|-----------|------|-------------|
| `city` | String | Travel destination |
| `startDate` | Date | Travel start date (YYYY-MM-DD) |
| `endDate` | Date | Travel end date (YYYY-MM-DD) |
| `genderPref` | String | Gender preference (optional) |

**Authentication** ✅ Required

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439017",
      "name": "Sarah",
      "city": "Goa",
      "startDate": "2024-02-15",
      "endDate": "2024-02-25",
      "description": "First time solo traveler...",
      "guestCapacity": 2
    }
  ]
}
```

---

### Send Connection Request

**POST** `/api/companions/request`

Send a connection request to another traveler.

**Authentication** ✅ Required

**Request Body**
```json
{
  "toUserId": "507f1f77bcf86cd799439017"
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "message": "Connection request sent",
  "data": {
    "_id": "507f1f77bcf86cd799439018",
    "fromUser": "507f1f77bcf86cd799439011",
    "toUser": "507f1f77bcf86cd799439017",
    "status": "pending"
  }
}
```

---

## Emergency Endpoints

### Trigger SOS Alert

**POST** `/api/emergency/sos`

Log an emergency with GPS geolocation.

**Authentication** Optional (works for guests too)

**Request Body**
```json
{
  "latitude": 15.4909,
  "longitude": 73.8278,
  "city": "Goa"
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "message": "Emergency alert logged",
  "data": {
    "_id": "507f1f77bcf86cd799439019",
    "userId": "507f1f77bcf86cd799439011",
    "location": {
      "lat": 15.4909,
      "lng": 73.8278,
      "city": "Goa"
    },
    "timestamp": "2024-01-15T10:35:00Z"
  }
}
```

---

## Error Codes

| Code | Message | Meaning |
|------|---------|---------|
| **200** | OK | Request successful |
| **201** | Created | Resource created successfully |
| **400** | Bad Request | Invalid request data |
| **401** | Unauthorized | Missing or invalid authentication token |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Resource not found |
| **409** | Conflict | Resource already exists |
| **500** | Server Error | Internal server error |

**Error Response Format**
```json
{
  "success": false,
  "message": "Error description here"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider adding:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

---

## Response Headers

All responses include:
```
Content-Type: application/json
```

---

For more information, see:
- [Main README](../README.md)
- [Complete Documentation](./DOCUMENTATION.md)
- [Setup Guide](./SETUP.md)
