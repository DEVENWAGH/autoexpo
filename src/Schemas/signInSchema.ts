import { z } from "zod";
import { emailRegex, passwordRegex } from "../utils/regex";

export const signInSchema = z.object({
    email: z.string()
        .regex(emailRegex, "Invalid email format"),
    password: z.string()
        .regex(passwordRegex, "Invalid password format"),
});

export type SignInInput = z.infer<typeof signInSchema>;
