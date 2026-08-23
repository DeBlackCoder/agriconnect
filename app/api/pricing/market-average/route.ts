import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import PriceHistory from '@/models/PriceHistory';
import mongoose from 'mongoose';

// GET /api/pricing/market-average - Get market average price for a product category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const productName = searchParams.get('productName');
    const days = parseInt(searchParams.get('days') || '30'); // Default 30 days

    if (!categoryId && !productName) {
      return NextResponse.json(
        { error: 'Either categoryId or productName is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const query: any = { isActive: true };
    
    if (categoryId) {
      query.categoryId = new mongoose.Types.ObjectId(categoryId);
    }
    
    if (productName) {
      query.name = { $regex: productName, $options: 'i' };
    }

    // Calculate date range
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    // Get all active products matching criteria
    const products = await Product.find(query).select('_id pricePerUnit unit');

    if (products.length === 0) {
      return NextResponse.json({
        marketAverage: null,
        productCount: 0,
        priceRange: { min: null, max: null },
        message: 'No products found matching criteria',
      });
    }

    // Calculate current market average
    const currentPrices = products.map(p => p.pricePerUnit);
    const currentAverage = currentPrices.reduce((a, b) => a + b, 0) / currentPrices.length;
    const minPrice = Math.min(...currentPrices);
    const maxPrice = Math.max(...currentPrices);

    // Get historical price data for trend analysis
    const productIds = products.map(p => p._id);
    const historicalPrices = await PriceHistory.aggregate([
      {
        $match: {
          productId: { $in: productIds },
          recordedAt: { $gte: dateFrom },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$recordedAt' },
          },
          avgPrice: { $avg: '$price' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Calculate price trend (increasing, decreasing, stable)
    let trend = 'stable';
    if (historicalPrices.length >= 2) {
      const firstWeekAvg = historicalPrices.slice(0, 7).reduce((sum, item) => sum + item.avgPrice, 0) / Math.min(7, historicalPrices.length);
      const lastWeekAvg = historicalPrices.slice(-7).reduce((sum, item) => sum + item.avgPrice, 0) / Math.min(7, historicalPrices.slice(-7).length);
      
      const percentChange = ((lastWeekAvg - firstWeekAvg) / firstWeekAvg) * 100;
      
      if (percentChange > 5) trend = 'increasing';
      else if (percentChange < -5) trend = 'decreasing';
    }

    return NextResponse.json({
      marketAverage: parseFloat(currentAverage.toFixed(2)),
      productCount: products.length,
      priceRange: {
        min: parseFloat(minPrice.toFixed(2)),
        max: parseFloat(maxPrice.toFixed(2)),
      },
      unit: products[0]?.unit || 'unit',
      trend,
      historicalData: historicalPrices.map(item => ({
        date: item._id,
        avgPrice: parseFloat(item.avgPrice.toFixed(2)),
        sampleSize: item.count,
      })),
      analysis: {
        belowAverage: products.filter(p => p.pricePerUnit < currentAverage).length,
        aboveAverage: products.filter(p => p.pricePerUnit > currentAverage).length,
        atAverage: products.filter(p => Math.abs(p.pricePerUnit - currentAverage) < 0.5).length,
      },
    });
  } catch (error) {
    console.error('Market average error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate market average' },
      { status: 500 }
    );
  }
}
