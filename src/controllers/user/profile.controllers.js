import { z } from "zod";
import bcrypt from "bcryptjs";

// models
import Users from "../../models/user.model.js";

// utils
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

// response
import { userRes } from "../../utils/responses.js";

// validation
const updateProfileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name cannot exceed 50 characters"),

    userName: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username cannot exceed 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),

    mobile: z
        .string()
        .trim()
        .regex(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .or(z.literal(""))
        .optional(),

    gender: z
        .enum(["male", "female", "other"])
        .optional(),

    dateOfBirth: z
        .string()
        .nullable()
        .optional(),

    address: z.object({
        street: z.string().trim().optional(),
        city: z.string().trim().optional(),
        state: z.string().trim().optional(),
        pincode: z.string().trim().optional(),
        country: z.string().trim().optional(),
    }).optional(),
});

const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(64, "Password cannot exceed 64 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

// update profile
export const updateProfile = asyncHandler(async (req, res) => {
    // Zod validation
    const validation = updateProfileSchema.safeParse(req.body);

    if (!validation.success) {
        throw new AppError(validation.error.issues[0].message, 400);
    }

    const { name, userName, mobile, gender, dateOfBirth, address, } = validation.data;

    // Find logged-in user
    const user = await Users.findById(req.user._id);

    if (!user || user.isDeleted) {
        throw new AppError("User not found", 404);
    }

    // Check username availability
    const formattedUsername = userName.toLowerCase();

    if (formattedUsername !== user.userName) {
        const existingUser = await Users.findOne({
            userName: formattedUsername,
            _id: { $ne: user._id },
        });

        if (existingUser) {
            throw new AppError("Username already exists", 409);
        }
    }

    // Update profile
    user.name = name;
    user.userName = formattedUsername;
    user.mobile = mobile || "";
    user.gender = gender || "";
    user.dateOfBirth = dateOfBirth || null;

    // Update address
    if (address) {
        user.address = {
            street: address.street || "",
            city: address.city || "",
            state: address.state || "",
            pincode: address.pincode || "",
            country: address.country || "India",
        };
    }

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully!",
        result: userRes(user),
    });
});

// update password
export const updatePassword = asyncHandler(async (req, res) => {
    // Zod validation
    const validation = updatePasswordSchema.safeParse(req.body);

    if (!validation.success) {
        throw new AppError(validation.error.issues[0].message, 400);
    }

    const { currentPassword, newPassword } = validation.data;

    // Find logged-in user
    const user = await Users.findById(req.user._id).select("+password");

    if (!user || user.isDeleted) {
        throw new AppError("User not found", 404);
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
        throw new AppError("Current password is incorrect", 400);
    }

    // Check new password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
        throw new AppError("New password must be different from current password", 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Password updated successfully!",
    });
});