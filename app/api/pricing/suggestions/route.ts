import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { getSession } from '@/lib/auth';

// POST /api/pricing/suggestions - Get AI-powered pricing suggestions
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
    const { categoryId, productName, basePrice, stock, isOrganic, location } = body;

    if (!categoryId || !basePrice) {
      return NextResponse.json(
        { error: 'categoryId and basePrice are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get similar products for comparison
    const similarProducts = await Product.find({
      categoryId,
      isActive: true,
    }).select('pricePerUnit isOrganic location availableStock');

    if (similarProducts.length === 0) {
      return NextResponse.json({
        suggestedPrice: basePrice,
        confidence: 'low',
        reasoning: 'No comparable products found. Your price will set the market benchmark.',
        adjustments: [],
      });
    }

    // Calculate base market average
    const prices = similarProducts.map(p => p.pricePerUnit);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    let suggestedPrice = avgPrice;
    const adjustments: Array<{ factor: string; impact: string; change: number }> = [];

    // Adjustment 1: Organic premium (10-20% higher)
    if (isOrganic) {
      const organicProducts = similarProducts.filter(p => p.isOrganic);
      if (organicProducts.length > 0) {
        const organicAvg = organicProducts.reduce((sum, p) => sum + p.pricePerUnit, 0) / organicProducts.length;
        const premium = ((organicAvg - avgPrice) / avgPrice) * 100;
        suggestedPrice *= (1 + premium / 100);
        adjustments.push({
          factor: 'Organic Certification',
          impact: 'positive',
          change: premium,
        });
      } else {
        suggestedPrice *= 1.15; // Default 15% premium
        adjustments.push({
          factor: 'Organic Certification',
          impact: 'positive',
          change: 15,
        });
      }
    }

    // Adjustment 2: Stock availability (scarcity pricing)
    if (stock && stock < 50) {
      const scarcityPremium = 5; // 5% premium for low stock
      suggestedPrice *= 1.05;
      adjustments.push({
        factor: 'Low Stock (Scarcity)',
        impact: 'positive',
        change: scarcityPremium,
      });
    } else if (stock && stock > 200) {
      const excessDiscount = -5; // 5% discount for excess stock
      suggestedPrice *= 0.95;
      adjustments.push({
        factor: 'High Stock (Quick Sale)',
        impact: 'negative',
        change: excessDiscount,
      });
    }

    // Adjustment 3: Location-based pricing
    if (location) {
      const sameLocationProducts = similarProducts.filter(p => 
        p.location && p.location.toLowerCase().includes(location.toLowerCase())
      );
      
      if (sameLocationProducts.length >= 3) {
        const locationAvg = sameLocationProducts.reduce((sum, p) => sum + p.pricePerUnit, 0) / sameLocationProducts.length;
        const locationDiff = ((locationAvg - avgPrice) / avgPrice) * 100;
        
        if (Math.abs(locationDiff) > 5) {
          suggestedPrice = locationAvg;
          adjustments.push({
            factor: 'Local Market Price',
            impact: locationDiff > 0 ? 'positive' : 'negative',
            change: locationDiff,
          });
        }
      }
    }

    // Adjustment 4: Competition density
    const competitionDensity = similarProducts.length;
    if (competitionDensity > 20) {
      suggestedPrice *= 0.97; // Slight discount in highly competitive market
      adjustments.push({
        factor: 'High Competition',
        impact: 'negative',
        change: -3,
      });
    } else if (competitionDensity < 5) {
      suggestedPrice *= 1.05; // Premium in low competition
      adjustments.push({
        factor: 'Low Competition',
        impact: 'positive',
        change: 5,
      });
    }

    // Calculate confidence level
    let confidence = 'medium';
    if (similarProducts.length >= 20) {
      confidence = 'high';
    } else if (similarProducts.length < 5) {
      confidence = 'low';
    }

    // Price range recommendation
    const priceRange = {
      min: parseFloat((suggestedPrice * 0.9).toFixed(2)),
      recommended: parseFloat(suggestedPrice.toFixed(2)),
      max: parseFloat((suggestedPrice * 1.1).toFixed(2)),
    };

    // Generate reasoning
    let reasoning = `Based on ${similarProducts.length} similar products, `;
    if (adjustments.length > 0) {
      reasoning += `we've applied ${adjustments.length} adjustment(s): `;
      reasoning += adjustments.map(a => a.factor).join(', ');
      reasoning += '. ';
    }
    reasoning += `This positions you competitively in the market.`;

    return NextResponse.json({
      suggestedPrice: priceRange.recommended,
      priceRange,
      confidence,
      reasoning,
      adjustments,
      marketContext: {
        averagePrice: parseFloat(avgPrice.toFixed(2)),
        competitorCount: similarProducts.length,
        priceSpread: {
          min: Math.min(...prices),
          max: Math.max(...prices),
        },
      },
    });
  } catch (error) {
    console.error('Price suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate price suggestions' },
      { status: 500 }
    );
  }
}
