import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

// GET /api/sellers/reputation - Get seller reputation score
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json(
        { error: 'Seller ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if seller exists
    const seller = await User.findById(sellerId);
    if (!seller) {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      );
    }

    // Get all products by seller
    const products = await Product.find({ farmerId: sellerId }).select('_id');
    const productIds = products.map(p => p._id);

    // Get all reviews for seller's products
    const reviews = await Review.find({ productId: { $in: productIds } });

    // Calculate average rating
    let averageRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = totalRating / reviews.length;
    }

    // Get order statistics
    const [totalOrders, completedOrders, cancelledOrders] = await Promise.all([
      Order.countDocuments({ 
        farmerId: sellerId,
        status: { $ne: 'PLACED' },
      }),
      Order.countDocuments({ 
        farmerId: sellerId,
        status: { $in: ['DELIVERED', 'COMPLETED'] },
      }),
      Order.countDocuments({ 
        farmerId: sellerId,
        status: 'CANCELLED',
      }),
    ]);

    // Calculate fulfillment rate
    const fulfillmentRate = totalOrders > 0 
      ? (completedOrders / totalOrders) * 100 
      : 0;

    // Calculate response metrics (orders confirmed within 24h)
    const confirmedOnTime = await Order.aggregate([
      {
        $match: {
          farmerId: seller._id,
          status: { $ne: 'PLACED' },
        },
      },
      {
        $lookup: {
          from: 'ordertrackings',
          localField: '_id',
          foreignField: 'orderId',
          as: 'tracking',
        },
      },
      {
        $project: {
          createdAt: 1,
          confirmedTracking: {
            $filter: {
              input: '$tracking',
              as: 'track',
              cond: { $eq: ['$$track.status', 'CONFIRMED'] },
            },
          },
        },
      },
      {
        $addFields: {
          confirmedAt: { $arrayElemAt: ['$confirmedTracking.createdAt', 0] },
        },
      },
      {
        $addFields: {
          hoursDiff: {
            $divide: [
              { $subtract: ['$confirmedAt', '$createdAt'] },
              3600000, // milliseconds to hours
            ],
          },
        },
      },
      {
        $match: {
          hoursDiff: { $lte: 24, $gte: 0 },
        },
      },
      {
        $count: 'count',
      },
    ]);

    const onTimeConfirmations = confirmedOnTime[0]?.count || 0;
    const responseRate = totalOrders > 0 
      ? (onTimeConfirmations / totalOrders) * 100 
      : 0;

    // Calculate trust score (weighted average)
    // Rating: 40%, Fulfillment: 30%, Response: 20%, Volume: 10%
    const ratingScore = (averageRating / 5) * 40;
    const fulfillmentScore = (fulfillmentRate / 100) * 30;
    const responseScore = (responseRate / 100) * 20;
    const volumeScore = Math.min((completedOrders / 50) * 10, 10); // Max at 50 orders
    
    const trustScore = Math.round(ratingScore + fulfillmentScore + responseScore + volumeScore);

    // Get badge based on trust score
    let badge = 'New Seller';
    if (trustScore >= 90) badge = 'Elite Seller';
    else if (trustScore >= 80) badge = 'Top Rated';
    else if (trustScore >= 70) badge = 'Trusted Seller';
    else if (trustScore >= 60) badge = 'Verified Seller';
    else if (completedOrders >= 5) badge = 'Active Seller';

    // Calculate rating distribution
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    return NextResponse.json({
      sellerId,
      sellerName: seller.fullName,
      trustScore,
      badge,
      reputation: {
        averageRating: parseFloat(averageRating.toFixed(2)),
        totalReviews: reviews.length,
        ratingDistribution,
      },
      performance: {
        totalOrders,
        completedOrders,
        cancelledOrders,
        fulfillmentRate: parseFloat(fulfillmentRate.toFixed(1)),
        responseRate: parseFloat(responseRate.toFixed(1)),
      },
      metrics: {
        totalProducts: products.length,
        verifiedPurchases: reviews.filter(r => r.isVerified).length,
        memberSince: seller.createdAt,
      },
    });
  } catch (error) {
    console.error('Get seller reputation error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch seller reputation' },
      { status: 500 }
    );
  }
}
