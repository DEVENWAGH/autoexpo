import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";

// GET handler to fetch reviews for a vehicle
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const vehicleId = searchParams.get("vehicleId");

  if (!vehicleId) {
    return NextResponse.json(
      { message: "Vehicle ID is required" },
      { status: 400 }
    );
  }

  try {
    const conn = await dbConnect();
    const db = conn.connection.db;
    
    const reviews = await db
      .collection("reviews")
      .find({ vehicleId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST handler to create a new review
export async function POST(request: NextRequest) {
  const session = await auth();

  // Check if user is authenticated
  if (!session || !session.user) {
    return NextResponse.json(
      { message: "You must be signed in to post a review" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { userId, userName, rating, comment, vehicleId } = body;

    // Validate required fields
    if (!vehicleId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Vehicle ID and valid rating (1-5) are required" },
        { status: 400 }
      );
    }

    // Ensure the userId matches the authenticated user
    if (userId !== session.user.id) {
      return NextResponse.json(
        { message: "User ID mismatch" },
        { status: 403 }
      );
    }

    const conn = await dbConnect();
    const db = conn.connection.db;

    // Check if the user has already reviewed this vehicle
    const existingReview = await db
      .collection("reviews")
      .findOne({ userId, vehicleId });

    if (existingReview) {
      return NextResponse.json(
        { message: "You have already reviewed this vehicle" },
        { status: 400 }
      );
    }

    // Create and insert the review
    const review = {
      userId,
      userName,
      rating,
      comment,
      vehicleId,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("reviews").insertOne(review);

    // Return the created review with the generated ID
    return NextResponse.json({
      message: "Review submitted successfully",
      review: {
        ...review,
        id: result.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json(
      { message: "Failed to create review" },
      { status: 500 }
    );
  }
}
