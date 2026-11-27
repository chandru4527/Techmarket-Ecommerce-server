import jwt from "jsonwebtoken";

// models
import Users from "../models/user.model.js";

// utils
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const accessTokenKey = process.env.ACCESS_TOKEN_SECRETKEY;

export const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        throw new AppError("Authentication required", 401);
    }

    const decoded = jwt.verify(token, accessTokenKey);

    const user = await Users.findById(decoded.id).select("-password");

    if (!user) {
        throw new AppError("User not found", 401);
    }

    if (!user.isActive) {
        throw new AppError("Your account is inactive", 403);
    }

    req.user = user;

    next();
});