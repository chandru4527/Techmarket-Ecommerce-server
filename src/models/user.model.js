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
            required: [true, "Username is required"],
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
            minlength: 8,
            select: false,
        },
        mobile: {
            type: String,
            trim: true,
            default: "",
        },
        profileImage: {
            url: {
                type: String,
                default: ""
            },
            publicId: {
                type: String,
                default: ""
            }
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
        address: [
            {
                address: {
                    type: String,
                    trim: true,
                },
                city: {
                    type: String,
                    trim: true,
                },
                state: {
                    type: String,
                    trim: true,
                },
                pincode: {
                    type: String,
                    trim: true,
                },
                country: {
                    type: String,
                    trim: true,
                    default: "India",
                },
                isDefault: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
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
            default: "",
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