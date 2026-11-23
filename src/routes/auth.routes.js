import { Router } from "express";

import { register, login, googleLogin, getMe, refreshAccessToken, logout } from "../controllers/auth.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Register
router.route("/register").post(register);

// Login
router.route("/login").post(login);

// Google login
router.route("/google-login").post(googleLogin);

// Get logged-in user
router.route("/me").get(authMiddleware, getMe);

// Refresh access token
router.route("/refresh-token").post(refreshAccessToken);

// Logout
router.route("/logout").post(logout);

export default router;