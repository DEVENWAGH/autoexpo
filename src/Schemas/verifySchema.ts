import { z } from "zod";
import { emailRegex, verifyCodeRegex } from "../utils/regex";

export const verifySchema = z.object({
    email: z.string()
        .regex(emailRegex, "Invalid email format"),
    verifyCode: z.string()
        .regex(verifyCodeRegex, "Verification code must be 6 digits"),
});

export type VerifyInput = z.infer<typeof verifySchema>;
