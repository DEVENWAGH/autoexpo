import { NextResponse } from "next/server";
import { auth } from "@/auth";

// In-memory storage for form state (in production, use Redis or another persistent store)
const formStates = new Map();

export async function POST(request: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { formId, formState } = await request.json();
    if (!formId) {
      return NextResponse.json({ error: "Form ID is required" }, { status: 400 });
    }
    
    const userId = session.user.id;
    const stateKey = `${userId}-${formId}`;
    
    console.log(`Saving form state for user ${userId}, form ${formId}`);
    formStates.set(stateKey, formState);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving form state:", error);
    return NextResponse.json({ error: "Failed to save form state" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const formId = url.searchParams.get('formId');
  
  if (!formId) {
    return NextResponse.json({ error: "Form ID is required" }, { status: 400 });
  }

  const userId = session.user.id;
  const stateKey = `${userId}-${formId}`;
  const formState = formStates.get(stateKey);
  
  console.log(`Retrieved form state for user ${userId}, form ${formId}:`, formState ? "Found" : "Not found");
  
  return NextResponse.json({ 
    formState,
    found: !!formState
  });
}
