import { NextRequest, NextResponse } from "next/server";
import {dbConnect} from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }
    await dbConnect();

    const existingUserByEmail = await User.findOne({ email });

    if (existingUserByEmail) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already registered",
          },
          { status: 400 }
        );
      }
      await User.create({
          email,
          password,
        });
        return NextResponse.json(
          {
            success: true,
            message: "User registered successfully",
          },
          { status: 201 }
        );
} catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to register user",
      },
      { status: 500 }
    );
  }
}