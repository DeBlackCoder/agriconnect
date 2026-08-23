import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import PriceHistory from '@/models/PriceHistory';
import mongoose from 'mongoose';

// GET /api/pricing/benchmark - Get price benchmark for a specific product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'Invalid productId' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get the product
    const product = await Product.findById(productId).populate('categoryId', 'name');

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get similar products (same category)
    const similarProducts = await Product.find({
      categoryId: product.categoryId,
      _id: { $ne: product._id },
      isActive: true,
    }).select('pricePerUnit');

    // Calculate market statistics
    if (similarProducts.length === 0) {
      return NextResponse.json({
        product: {
          id: product._id,
          name: product.name,
          currentPrice: product.pricePerUnit,
          unit: product.unit,
        },
        benchmark: null,
        message: 'No comparable products found',
        recommendation: 'Be the first to set competitive pricing',
      });
    }

    const prices = similarProducts.map(p => p.pricePerUnit);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    // Calculate median
    const sortedPrices = [...prices].sort((a, b) => a - b);
    const medianPrice = sortedPrices.length % 2 === 0
      ? (sortedPrices[sortedPrices.length / 2 - 1] + sortedPrices[sortedPrices.length / 2]) / 2
      : sortedPrices[Math.floor(sortedPrices.length / 2)];

    // Calculate percentile rank
    const lowerPriced = prices.filter(p => p < product.pricePerUnit).length;
    const percentileRank = (lowerPriced / prices.length) * 100;

    // Get price history for this product
    const priceHistory = await PriceHistory.find({
      productId: product._id,
    })
      .sort({ recordedAt: -1 })
      .limit(30)
      .select('price marketAvg recordedAt');

    // Determine pricing strategy recommendation
    let recommendation = '';
    let competitive = 'average';
    
    if (product.pricePerUnit < avgPrice * 0.9) {
      recommendation = 'Your price is below market average. Consider increasing to maximize profit.';
      competitive = 'below_average';
    } else if (product.pricePerUnit > avgPrice * 1.1) {
      recommendation = 'Your price is above market average. Consider lowering to attract more buyers.';
      competitive = 'above_average';
    } else {
      recommendation = 'Your price is competitive with the market average.';
      competitive = 'competitive';
    }

    // Calculate optimal price range (between 25th and 75th percentile)
    const q1Index = Math.floor(sortedPrices.length * 0.25);
    const q3Index = Math.floor(sortedPrices.length * 0.75);
    const optimalRange = {
      min: sortedPrices[q1Index],
      max: sortedPrices[q3Index],
    };

    return NextResponse.json({
      product: {
        id: product._id,
        name: product.name,
        currentPrice: product.pricePerUnit,
        unit: product.unit,
        category: product.categoryId?.name || 'Uncategorized',
      },
      benchmark: {
        average: parseFloat(avgPrice.toFixed(2)),
        median: parseFloat(medianPrice.toFixed(2)),
        min: parseFloat(minPrice.toFixed(2)),
        max: parseFloat(maxPrice.toFixed(2)),
        sampleSize: similarProducts.length,
      },
      analysis: {
        percentileRank: parseFloat(percentileRank.toFixed(1)),
        competitive,
        priceDifferenceFromAverage: parseFloat((((product.pricePerUnit - avgPrice) / avgPrice) * 100).toFixed(2)),
        recommendation,
      },
      optimalPriceRange: {
        min: parseFloat(optimalRange.min.toFixed(2)),
        max: parseFloat(optimalRange.max.toFixed(2)),
      },
      priceHistory: priceHistory.map(h => ({
        price: h.price,
        marketAvg: h.marketAvg,
        date: h.recordedAt,
      })),
    });
  } catch (error) {
    console.error('Price benchmark error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate price benchmark' },
      { status: 500 }
    );
  }
}
