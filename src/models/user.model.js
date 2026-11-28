import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        userName: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false,
        },
        mobile: {
            type: String,
            trim: true,
            default: "",
        },
        gender: {
            type: String,
            // enum: ["Male", "Female", "Other"],
            default: "",
        },
        dateOfBirth: {
            type: Date,
            default: null,
        },
        profileImage: {
            url: {
                type: String,
                default: "https://res.cloudinary.com/dhlflr2cc/image/upload/v1795767305/profile_vtxb82.webp"
            },
            publicId: {
                type: String,
                default: ""
            }
        },
        address: {
            street: {
                type: String,
                trim: true,
                default: "",
            },
            city: {
                type: String,
                trim: true,
                default: "",
            },
            state: {
                type: String,
                trim: true,
                default: "",
            },
            pincode: {
                type: String,
                trim: true,
                default: "",
            },
            country: {
                type: String,
                trim: true,
                default: "India",
            },
        },
        role: {
            type: String,
            enum: ["user", "admin", "sub-admin"],
            default: "user",
        },
        permissions: {
            type: [String],
            default: [],
        },
        // isEmailVerified: {
        //     type: Boolean,
        //     default: false,
        // },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        uid: {
            type: String,
            default: null,
        },
        passwordChangedAt: Date,
        lastLogin: Date,
    },
    {
        timestamps: true,
    }
);

const Users = mongoose.model("User", userSchema);

export default Users;