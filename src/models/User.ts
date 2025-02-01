import mongoose, { Schema, Document, model , models } from "mongoose";
import bycrptjs from "bcryptjs";
import { emailRegex, passwordRegex } from "../utils/regex";

// Interface for TypeScript
export interface IUser extends Document {
    email: string;
    password: string;
    _id: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
            validator: (email: string) => emailRegex.test(email),
            message: "Invalid email format"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        validate: {
            validator: (password: string) => passwordRegex.test(password),
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        },
        minlength: [6, "Password must be at least 6 characters"]
    }
}, { timestamps: true });
userSchema.pre<IUser>("save", async function(next){
    if(this.isModified("password")){
        this.password = await bycrptjs.hash(this.password, 10);
    }
    next();
});

const User = models?.User || model<IUser>("User", userSchema);
export default User;