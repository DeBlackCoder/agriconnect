import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Notification from '@/models/Notification';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const createReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

// GET /api/reviews - Get reviews for a product or user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let query: any = {};
    if (productId) query.productId = productId;
    if (userId) query.userId = userId;

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('userId', 'fullName profilePicture')
        .populate('productId', 'name images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(query),
    ]);

    // Calculate rating distribution if getting reviews for a product
    let ratingDistribution = null;
    let averageRating = null;

    if (productId) {
      const allProductReviews = await Review.find({ productId }).select('rating');
      
      ratingDistribution = {
        1: allProductReviews.filter(r => r.rating === 1).length,
        2: allProductReviews.filter(r => r.rating === 2).length,
        3: allProductReviews.filter(r => r.rating === 3).length,
        4: allProductReviews.filter(r => r.rating === 4).length,
        5: allProductReviews.filter(r => r.rating === 5).length,
      };

      if (allProductReviews.length > 0) {
        const sum = allProductReviews.reduce((acc, r) => acc + r.rating, 0);
        averageRating = (sum / allProductReviews.length).toFixed(1);
      }
    }

    return NextResponse.json({
      reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      ...(ratingDistribution && { ratingDistribution }),
      ...(averageRating && { averageRating: parseFloat(averageRating) }),
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createReviewSchema.parse(body);

    await connectDB();

    // Check if product exists
    const product = await Product.findById(validatedData.productId)
      .populate('farmerId', 'fullName');

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      productId: validatedData.productId,
      userId: session.id,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Check if user has purchased this product (completed order)
    const purchaseOrder = await Order.findOne({
      buyerId: session.id,
      'items.productId': validatedData.productId,
      status: { $in: ['DELIVERED', 'COMPLETED'] },
    });

    const isVerified = !!purchaseOrder;

    // Create review
    const review = await Review.create({
      productId: validatedData.productId,
      userId: session.id,
      rating: validatedData.rating,
      comment: validatedData.comment,
      isVerified,
    });

    // Update product rating aggregation
    await updateProductRating(validatedData.productId);

    // Notify farmer about new review
    await Notification.create({
      userId: product.farmerId._id,
      title: 'New Review Received',
      message: `You received a ${validatedData.rating}-star review on ${product.name}`,
      type: 'review',
      link: `/products/${product._id}`,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'fullName profilePicture')
      .lean();

    return NextResponse.json({
      success: true,
      message: 'Review created successfully',
      review: populatedReview,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // Handle unique constraint violation
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

// Helper function to update product rating
async function updateProductRating(productId: string) {
  const reviews = await Review.find({ productId }).select('rating');

  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      reviewCount: 0,
    });
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await Product.findByIdAndUpdate(productId, {
    averageRating: parseFloat(averageRating.toFixed(2)),
    reviewCount: reviews.length,
  });
}
