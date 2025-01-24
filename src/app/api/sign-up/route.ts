import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    if (existingUserByEmail) {
      if(existingUserByEmail.isVerified){
        return NextResponse.json(
          {
            success: false,
            message: "Email already registered",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyExpiry: expiry,
      });
      await newUser.save();
    }

    //send verification email
    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    if(!emailResponse.success){
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully and please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/sign-up:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred in registering user.",
      },
      { status: 500 }
    );
  }
}
