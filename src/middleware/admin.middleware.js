import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const adminMiddleware = (...requiredPermissions) => {
    return asyncHandler(async (req, res, next) => {
        const { role, permissions = [] } = req.user;

        // Admin has full access
        if (role === "admin") {
            return next();
        }

        // Check sub-admin role
        if (role !== "sub-admin") {
            throw new AppError("Admin access required", 403);
        }

        // Check permissions
        const hasPermission = requiredPermissions.every(permission =>
            permissions.includes(permission)
        );

        if (!hasPermission) {
            throw new AppError("Admin access required", 403);
        }

        next();
    });
};