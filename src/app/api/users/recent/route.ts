import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    // Fetch users, sorted by most recent first, limit to 10
    const users = await User.find({})
      .select('firstName lastName email role createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
