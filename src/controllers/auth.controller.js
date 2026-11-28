import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// models
import Users from "../models/user.model.js";

// config
// import { firebaseAdminAuth } from "../config/firebaseAdmin.js";

// utils
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

import { userRes } from "../utils/responses.js"

import { generateAccessToken, generateRefreshToken, } from "../utils/generateToken.js";
import { sendWelcomeEmail } from "../utils/sendEmail.js";

// validation schemas
const registerSchema = z.object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    // confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((value) => value === true, {
        message: "Please accept the terms and conditions",
    }),
})

const loginSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password is required"),
});

// Configuration environment variables
const refreshTokenKey = process.env.REFRESH_TOKEN_SECRETKEY;
const isProduction = process.env.NODE_ENV === "production";

const accessCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/v1/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
};

// register controller
export const register = asyncHandler(async (req, res) => {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
        throw new AppError(validation.error.issues[0].message, 400);
    }

    const { name, email, password } = validation.data;

    const existingUser = await Users.findOne({
        $or: [{ email }],
    });

    if (existingUser) {
        throw new AppError("Email or username already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await Users.create({
        name,
        email,
        password: hashedPassword,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("accessToken", accessToken, {
        ...accessCookieOptions,
    });

    res.cookie("refreshToken", refreshToken, {
        ...refreshCookieOptions,
    });

    // sendWelcomeEmail(name, email).catch((error) => {
    //     console.error("Welcome email failed:", error.message);
    // });

    return res.status(201).json({
        success: true,
        message: "Register successfully!",
        result: userRes(user),
    });

});

// login controller
export const login = asyncHandler(async (req, res) => {

    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
        throw new AppError(validation.error.issues[0].message, 400);
    }

    const { email, password } = validation.data;

    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    if (!user.isActive) {
        throw new AppError("Your account has been blocked or deactivated", 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.lastLogin = new Date();

    await user.save();

    res.cookie("accessToken", accessToken, {
        ...accessCookieOptions,
    });

    res.cookie("refreshToken", refreshToken, {
        ...refreshCookieOptions,
    });

    return res.status(200).json({
        success: true,
        message: "Login successful",
        result: userRes(user),
    });
});

// google login controller
export const googleLogin = asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        throw new AppError("ID token is required", 400);
    }

    const decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);

    const { email, name, picture, uid } = decodedToken;

    let user = await Users.findOne({ email });

    if (!user) {
        user = await Users.create({
            name,
            email,
            uid,
            profileImage: {
                url: picture,
            },
        });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("accessToken", accessToken, {
        ...accessCookieOptions,
    });

    res.cookie("refreshToken", refreshToken, {
        ...refreshCookieOptions,
    });

    // sendWelcomeEmail(name, email).catch((error) => {
    //     console.error("Welcome email failed:", error.message);
    // });

    return res.status(200).json({
        success: true,
        message: "Login successfully!",
        result: userRes(user),
    });
});

// get logged-in user controller
export const getMe = asyncHandler(async (req, res) => {

    const user = await Users.findById(req?.user?.id).select("-password");

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return res.status(200).json({
        success: true,
        result: userRes(user),
    });
});

// refresh, access token controller
export const refreshAccessToken = asyncHandler(async (req, res) => {

    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        throw new AppError("Refresh token is required", 401);
    }

    if (!refreshTokenKey) {
        return res.status(500).json({
            success: false,
            message: "Refresh token configuration is missing",
        });
    }

    let decoded;

    try {
        decoded = jwt.verify(refreshToken, refreshTokenKey);
    } catch {
        return res.status(401).json({
            success: false,
            message: "Refresh token expired or invalid. Please log in again.",
        });
    }

    const user = await Users.findById(decoded?.id);

    if (!user || !user.isActive) {
        return res.status(401).json({
            success: false,
            message: "User not found or inactive. Please login again.",
        });
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);


    res.cookie("accessToken", newAccessToken, {
        ...accessCookieOptions,
    });

    res.cookie("refreshToken", newRefreshToken, {
        ...refreshCookieOptions,
    });

    return res.status(200).json({
        success: true,
        message: "Access token refreshed successfully",
    });
});

// Logout controller
export const logout = asyncHandler(async (req, res) => {

    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    };

    res.clearCookie("accessToken", {
        ...cookieOptions,
        path: "/",
    });

    res.clearCookie("refreshToken", {
        ...cookieOptions,
        path: "/v1/auth",
    });

    return res.status(200).json({
        success: true,
        message: "Logout successfully!",
    });
});
