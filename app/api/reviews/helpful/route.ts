import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import { getSession } from '@/lib/auth';

// POST /api/reviews/helpful - Mark review as helpful
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { reviewId } = await request.json();

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const review = await Review.findById(reviewId);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Initialize helpfulVotes if not exists
    if (!review.helpfulVotes) {
      review.helpfulVotes = [];
    }

    // Check if user already marked this review as helpful
    const userIndex = review.helpfulVotes.findIndex(
      (userId: any) => userId.toString() === session.id
    );

    if (userIndex !== -1) {
      // Remove vote (unlike)
      review.helpfulVotes.splice(userIndex, 1);
      await review.save();

      return NextResponse.json({
        success: true,
        message: 'Vote removed',
        helpfulCount: review.helpfulVotes.length,
        isHelpful: false,
      });
    } else {
      // Add vote (like)
      review.helpfulVotes.push(session.id);
      await review.save();

      return NextResponse.json({
        success: true,
        message: 'Marked as helpful',
        helpfulCount: review.helpfulVotes.length,
        isHelpful: true,
      });
    }
  } catch (error) {
    console.error('Mark review helpful error:', error);
    return NextResponse.json(
      { error: 'Failed to mark review as helpful' },
      { status: 500 }
    );
  }
}
