import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import OrderTracking from '@/models/OrderTracking';
import { getSession } from '@/lib/auth';

// GET /api/orders/tracking - Get tracking information for an order
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get order to check authorization
    const order = await Order.findById(orderId)
      .populate('buyerId', 'fullName')
      .populate('farmerId', 'fullName')
      .populate('items.productId', 'name');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (
      session.role !== 'ADMIN' &&
      order.buyerId._id.toString() !== session.id &&
      order.farmerId._id.toString() !== session.id
    ) {
      return NextResponse.json(
        { error: 'Unauthorized to view this order tracking' },
        { status: 403 }
      );
    }

    // Get all tracking events for this order
    const tracking = await OrderTracking.find({ orderId })
      .sort({ createdAt: 1 })
      .select('status description location createdAt metadata');

    // Calculate order progress
    const statusOrder = ['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'];
    const currentStatusIndex = statusOrder.indexOf(order.status);
    const progress = currentStatusIndex >= 0 
      ? ((currentStatusIndex + 1) / statusOrder.length) * 100 
      : 0;

    // Estimate delivery date (if not delivered)
    let estimatedDelivery = null;
    if (order.status !== 'DELIVERED' && order.status !== 'COMPLETED') {
      const confirmedTracking = tracking.find(t => t.status === 'CONFIRMED');
      if (confirmedTracking) {
        const deliveryDate = new Date(confirmedTracking.createdAt);
        deliveryDate.setDate(deliveryDate.getDate() + 5); // Add 5 days estimate
        estimatedDelivery = deliveryDate;
      }
    }

    // Get actual delivery date
    const deliveredTracking = tracking.find(t => t.status === 'DELIVERED');
    const actualDelivery = deliveredTracking?.createdAt || null;

    return NextResponse.json({
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
      },
      tracking: tracking.map(t => ({
        status: t.status,
        description: t.description,
        location: t.location,
        timestamp: t.createdAt,
        metadata: t.metadata,
      })),
      progress: Math.round(progress),
      estimatedDelivery,
      actualDelivery,
      timeline: {
        placed: order.createdAt,
        confirmed: tracking.find(t => t.status === 'CONFIRMED')?.createdAt || null,
        shipped: tracking.find(t => t.status === 'SHIPPED')?.createdAt || null,
        delivered: actualDelivery,
      },
    });
  } catch (error) {
    console.error('Order tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order tracking' },
      { status: 500 }
    );
  }
}
