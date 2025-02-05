import mongoose, { Schema, model, models } from "mongoose";

export type UserRole = 'user' | 'admin' | 'Brands';

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    image: string;
    authProviderId: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"]
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"]
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'Brands'],
            default: 'user'
        },
        image: { type: String},
        //auth providers like google, facebook, etc
        authProviderId: { type: String}
    },
    { timestamps: true }
);

const User = models?.User || model<IUser>("User", userSchema);
export default User;
