# Swagger UI Setup and Documentation Guide

## Overview
Swagger UI is now configured for your Solosphere backend API with a light mode minimal interface. The documentation is automatically generated from JSDoc comments in your route files.

## Accessing Swagger UI
- **URL:** `http://localhost:5000/api-docs`
- **Production URL:** `https://solosphere-backend.onrender.com/api-docs`

## Features Enabled
✅ Light mode minimal UI
✅ Try-it-out functionality (test endpoints directly)
✅ JWT Bearer authentication support
✅ Auto-generated OpenAPI 3.0 specification
✅ Deep linking to specific endpoints
✅ Syntax highlighting and schema validation

## How to Document API Endpoints

### Basic Endpoint Documentation Template

Add JSDoc comments directly above your route handlers using the `@swagger` tag:

```typescript
/**
 * @swagger
 * /route:
 *   http_method:
 *     summary: Brief description of what the endpoint does
 *     description: More detailed description of the endpoint
 *     tags:
 *       - TagName
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paramName
 *         required: true
 *         schema:
 *           type: string
 *         description: What this parameter is for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fieldName
 *             properties:
 *               fieldName:
 *                 type: string
 *                 example: example value
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/route", handler);
```

### Example: GET Request

```typescript
/**
 * @swagger
 * /places:
 *   get:
 *     summary: Get all travel places
 *     description: Retrieve a list of all available travel destinations
 *     tags:
 *       - Places
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by place category
 *     responses:
 *       200:
 *         description: List of places retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 places:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 */
router.get("/places", getPlaces);
```

### Example: Protected Endpoint (with JWT)

```typescript
/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve authenticated user's profile information
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       500:
 *         description: Server error
 */
router.get("/user/profile", protectRoute, getUserProfile);
```

### Example: DELETE Request

```typescript
/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     description: Delete a post created by the authenticated user
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/posts/:postId", protectRoute, deletePost);
```

## Testing Authenticated Endpoints

1. **Get JWT Token**: Use the login endpoint to obtain a token
2. **Copy Token**: From the response, copy the `token` value
3. **Add Bearer Token**:
   - Click the "Authorize" button at the top of Swagger UI
   - Paste your token in the provided field
   - Click "Authorize"
4. **Test Endpoints**: All subsequent requests will include the Bearer token

## Common Data Types in Swagger

| Type | Example |
|------|---------|
| `string` | `"hello"` |
| `integer` | `42` |
| `number` | `3.14` |
| `boolean` | `true` |
| `array` | `[1, 2, 3]` |
| `object` | `{ key: "value" }` |

## HTTP Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Need authentication |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource missing |
| 500 | Server Error - Internal error |

## Endpoints to Document

Based on your project structure, add documentation to:

- **Auth Routes** (`/auth/signup`, `/auth/login`) - ✅ Already documented
- **Places Routes** (`GET /places`, `POST /places`, etc.)
- **Posts Routes** (`GET /posts`, `POST /posts`, etc.)
- **Emergency Routes** (`POST /emergency`, etc.)
- **Tips Routes** (`GET /tips`, `POST /tips`, etc.)
- **Companion Routes** (`GET /companions`, etc.)

## UI Customization

The Swagger UI is configured with:
- **Light mode colors** - White background with light gray accents
- **Minimal layout** - Clean, distraction-free interface
- **Expanded documentation** - Endpoints shown in list view by default
- **Try-it-out enabled** - Test endpoints directly from the UI

## Files Modified

- `src/config/swagger.ts` - Swagger configuration and light mode CSS
- `src/app.ts` - Swagger UI middleware setup
- `src/routes/authRoutes.ts` - Example endpoint documentation

## Next Steps

1. Add `@swagger` JSDoc comments to all your route files
2. Visit `http://localhost:5000/api-docs` to see your documentation
3. Use the "Try it out" feature to test your endpoints
4. Share the Swagger URL with your team for API reference

## Troubleshooting

**Swagger page doesn't load?**
- Ensure the backend is running on port 5000
- Check browser console for errors
- Verify route files are in `./src/routes/`

**Documentation not showing?**
- Ensure `@swagger` JSDoc comments are correctly formatted
- Check that route path matches the documentation path
- Restart the development server

**Try it out returns 404?**
- Verify the endpoint exists in your route handler
- Check that the HTTP method is correct (GET, POST, etc.)
- Ensure request body matches the schema

For more information about OpenAPI/Swagger:
- [Swagger Documentation](https://swagger.io/)
- [OpenAPI Specification](https://spec.openapis.org/)
- [Swagger Editor](https://editor.swagger.io/)
