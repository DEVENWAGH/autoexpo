import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dbConnect } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get reviewId after authentication is complete
    const reviewId = params.id;
    
    // Validate ObjectId format
    if (!ObjectId.isValid(reviewId)) {
      return NextResponse.json({ error: 'Invalid review ID format' }, { status: 400 });
    }
    
    // Connect to MongoDB
    await dbConnect();
    
    // Access the database directly through Mongoose
    const db = mongoose.connection.db;
    
    // Find the review
    const review = await db
      .collection("reviews")
      .findOne({ _id: new ObjectId(reviewId) });
    
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    
    // Check if the user is the owner of the review or an admin
    if (review.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized to delete this review' }, { status: 403 });
    }
    
    // Delete the review
    const result = await db
      .collection("reviews")
      .deleteOne({ _id: new ObjectId(reviewId) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the review' },
      { status: 500 }
    );
  }
}
