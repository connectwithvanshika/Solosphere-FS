import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

/**
 * User registration endpoint
 * POST /api/auth/signup
 * 
 * Why POST instead of GET:
 * - POST sends credentials in request body (hidden from logs/browser history)
 * - POST allows larger payloads for potential future fields
 * - RESTful standard for creating new resources
 * 
 * @body {name, email, password}
 */
router.post("/signup", (req, res) => authController.registerUser(req, res));

/**
 * User login endpoint
 * POST /api/auth/login
 * 
 * Why POST instead of GET:
 * - POST keeps credentials in body, not in URL
 * - GET requests are cached by browsers (security risk for auth endpoints)
 * - Express convention for actions with side effects (session creation)
 * 
 * @body {email, password}
 */
router.post("/login", (req, res) => authController.loginUser(req, res));

export default router;

