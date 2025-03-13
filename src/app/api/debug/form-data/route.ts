import { NextResponse } from "next/server";
import { auth } from "@/auth";  // Changed from authOptions to auth

// This is a debug endpoint to check what data is being submitted
export async function POST(request: Request) {
  try {
    // Update to use auth() instead of getServerSession(authOptions)
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the raw data
    const data = await request.json();
    
    // Log it for debugging
    console.log("Form data received:", JSON.stringify(data, null, 2));
    
    // Return the data back for client-side debugging
    return NextResponse.json({ 
      success: true,
      message: "Form data received",
      data: data
    });
    
  } catch (error) {
    console.error("Error processing debug data:", error);
    return NextResponse.json({ 
      error: "Failed to process debug data",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
