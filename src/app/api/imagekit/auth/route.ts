import { imageKit } from "@/lib/imageKit";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = imageKit.getAuthenticationParameters();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
