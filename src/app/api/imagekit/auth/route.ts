import { imageKit, verifyImageKitConfig } from "@/lib/imageKit";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    verifyImageKitConfig();
    const result = imageKit.getAuthenticationParameters();
    return NextResponse.json(result);
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
