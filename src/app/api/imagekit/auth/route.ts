import { NextResponse } from "next/server";
import { getAuthenticationParameters } from "@/lib/imageKit";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = getAuthenticationParameters();
    return NextResponse.json(params);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}
