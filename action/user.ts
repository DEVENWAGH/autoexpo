'use server'
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";
import { hash } from "bcryptjs";
const register = async (formData: FormData) => {
    try {
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email')?.toString().toLowerCase(), // normalize email
            password: formData.get('password')?.toString()
        };
        
        if (!data.firstName || !data.lastName || !data.email || !data.password) {
            return { error: 'All fields are required' };
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.exec(data.password || '')) {
            return {
                error: 'Password must contain at least 6 characters, one uppercase, one lowercase, one number and one special character'
            };
        }

        await dbConnect();

        // Case-insensitive email check
        const existingUser = await User.findOne({ 
            email: { $regex: new RegExp(`^${data.email}$`, 'i') }
        });

        if (existingUser) {
            return { error: 'This email is already registered' };
        }
        // Hash password
        const hashedPassword = await hash(data.password, 10);
        await User.create({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
            role: 'user'
        });

        console.log('User registered successfully');
        return { success: true };
    } catch (error: any) {
        console.error('Registration error:', error);
        return { 
            error: error.code === 11000 
                ? 'This email is already registered' 
                : 'Registration failed. Please try again.'
        };
    }
};

export { register };