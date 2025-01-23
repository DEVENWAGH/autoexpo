import { z } from "zod";
import { emailRegex, usernameRegex, passwordRegex, nameRegex } from "../utils/regex";

export const signUpSchema = z.object({
    email: z.string()
        .regex(emailRegex, "Invalid email format")
        .min(5, "Email must be at least 5 characters")
        .max(255, "Email cannot exceed 255 characters"),
    username: z.string()
        .regex(usernameRegex, "Username can only contain letters, numbers, dots, and underscores")
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username cannot exceed 50 characters"),
    password: z.string()
        .regex(passwordRegex, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
        .min(6, "Password must be at least 6 characters"),
    firstName: z.string()
        .regex(nameRegex, "First name can only contain letters")
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name cannot exceed 50 characters")
        .optional(),
    lastName: z.string()
        .regex(nameRegex, "Last name can only contain letters")
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name cannot exceed 50 characters")
        .optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
