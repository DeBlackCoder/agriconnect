import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import OrderTracking from '@/models/OrderTracking';
import Product from '@/models/Product';
import Notification from '@/models/Notification';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const fulfillOrderSchema = z.object({
  orderId: z.string(),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  estimatedDelivery: z.string().optional(),
  notes: z.string().optional(),
});

// POST /api/orders/fulfill - Mark order as fulfilled and ready to ship
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
    const validatedData = fulfillOrderSchema.parse(body);

    await connectDB();

    // Get order
    const order = await Order.findById(validatedData.orderId)
      .populate('buyerId', 'fullName email')
      .populate('farmerId', 'fullName');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check authorization - only farmer can fulfill
    if (order.farmerId._id.toString() !== session.id) {
      return NextResponse.json(
        { error: 'Only the seller can fulfill orders' },
        { status: 403 }
      );
    }

    // Check if order is in fulfillable state
    if (!['CONFIRMED', 'PROCESSING'].includes(order.status)) {
      return NextResponse.json(
        { 
          error: `Order must be CONFIRMED or PROCESSING to fulfill. Current status: ${order.status}`,
        },
        { status: 400 }
      );
    }

    // Update order status to SHIPPED
    order.status = 'SHIPPED';
    
    // Add shipping metadata
    const shippingInfo: any = {};
    if (validatedData.trackingNumber) shippingInfo.trackingNumber = validatedData.trackingNumber;
    if (validatedData.carrier) shippingInfo.carrier = validatedData.carrier;
    if (validatedData.estimatedDelivery) shippingInfo.estimatedDelivery = validatedData.estimatedDelivery;
    if (validatedData.notes) shippingInfo.notes = validatedData.notes;
    
    order.shippingInfo = shippingInfo;
    await order.save();

    // Deduct stock from products
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      
      if (product) {
        if (product.availableStock < item.quantity) {
          return NextResponse.json(
            { 
              error: `Insufficient stock for ${product.name}. Available: ${product.availableStock}, Required: ${item.quantity}`,
            },
            { status: 400 }
          );
        }

        product.availableStock -= item.quantity;
        await product.save();
      }
    }

    // Create tracking entry
    let trackingDescription = 'Order has been fulfilled and shipped';
    if (validatedData.trackingNumber) {
      trackingDescription += `. Tracking number: ${validatedData.trackingNumber}`;
    }

    await OrderTracking.create({
      orderId: order._id,
      status: 'SHIPPED',
      description: trackingDescription,
      metadata: shippingInfo,
    });

    // Create notification for buyer
    let buyerMessage = `Your order ${order.orderNumber} has been shipped!`;
    if (validatedData.trackingNumber) {
      buyerMessage += ` Tracking: ${validatedData.trackingNumber}`;
    }

    await Notification.create({
      userId: order.buyerId._id,
      title: 'Order Shipped',
      message: buyerMessage,
      type: 'order',
      link: `/orders/${order._id}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Order fulfilled successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        shippingInfo,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Fulfill order error:', error);
    return NextResponse.json(
      { error: 'Failed to fulfill order' },
      { status: 500 }
    );
  }
}
