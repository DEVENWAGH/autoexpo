import mongoose, { Schema, Document } from "mongoose";
import { emailRegex, usernameRegex, passwordRegex, nameRegex, verifyCodeRegex } from "../utils/regex";

// Interface for TypeScript
export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    verifyCode?: string;
    verifyExpiry?: Date;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const mongooseUserSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
            validator: (email: string) => emailRegex.test(email),
            message: "Invalid email format"
        }
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        validate: {
            validator: (username: string) => usernameRegex.test(username),
            message: "Username can only contain letters, numbers, dots, and underscores"
        },
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [50, "Username cannot exceed 50 characters"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        validate: {
            validator: (password: string) => passwordRegex.test(password),
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        },
        minlength: [6, "Password must be at least 6 characters"]
    },
    firstName: { 
        type: String,
        validate: {
            validator: (name: string) => !name || nameRegex.test(name),
            message: "First name can only contain letters"
        }
    },
    lastName: { 
        type: String,
        validate: {
            validator: (name: string) => !name || nameRegex.test(name),
            message: "Last name can only contain letters"
        }
    },
    verifyCode: {
        type: String,
        required: [true, "Verification code is required"],
        validate: {
            validator: (code: string) => verifyCodeRegex.test(code),
            message: "Verification code must be 6 digits"
        }
    },
    verifyExpiry: {
        type: Date,
        required: [true, "Verification expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: [true, "Verification status is required"]
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export default mongoose.models.User as mongoose.Model<IUser> || mongoose.model<IUser>("User", mongooseUserSchema);
