import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import OrderTracking from '@/models/OrderTracking';
import Notification from '@/models/Notification';
import Product from '@/models/Product';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const updateStatusSchema = z.object({
  orderId: z.string(),
  status: z.enum([
    'PLACED',
    'CONFIRMED', 
    'PROCESSING',
    'SHIPPED',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'COMPLETED',
    'CANCELLED',
  ]),
  description: z.string().optional(),
  location: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// POST /api/orders/update-status - Update order status and create tracking entry
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
    const validatedData = updateStatusSchema.parse(body);

    await connectDB();

    // Get order
    const order = await Order.findById(validatedData.orderId)
      .populate('buyerId', 'fullName')
      .populate('farmerId', 'fullName');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check authorization - only farmer/admin can update status
    if (
      session.role !== 'ADMIN' &&
      order.farmerId._id.toString() !== session.id
    ) {
      return NextResponse.json(
        { error: 'Only the seller or admin can update order status' },
        { status: 403 }
      );
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      'PLACED': ['CONFIRMED', 'CANCELLED'],
      'CONFIRMED': ['PROCESSING', 'CANCELLED'],
      'PROCESSING': ['SHIPPED', 'CANCELLED'],
      'SHIPPED': ['IN_TRANSIT', 'CANCELLED'],
      'IN_TRANSIT': ['OUT_FOR_DELIVERY', 'CANCELLED'],
      'OUT_FOR_DELIVERY': ['DELIVERED'],
      'DELIVERED': ['COMPLETED'],
      'COMPLETED': [],
      'CANCELLED': [],
    };

    const currentStatus = order.status;
    const allowedNextStatuses = validTransitions[currentStatus] || [];

    if (!allowedNextStatuses.includes(validatedData.status)) {
      return NextResponse.json(
        { 
          error: `Cannot transition from ${currentStatus} to ${validatedData.status}`,
          allowedStatuses: allowedNextStatuses,
        },
        { status: 400 }
      );
    }

    // Update order status
    order.status = validatedData.status;
    await order.save();

    // Create tracking entry
    const defaultDescriptions: Record<string, string> = {
      'PLACED': 'Order has been placed',
      'CONFIRMED': 'Order confirmed by seller',
      'PROCESSING': 'Order is being prepared',
      'SHIPPED': 'Order has been shipped',
      'IN_TRANSIT': 'Order is in transit',
      'OUT_FOR_DELIVERY': 'Order out for delivery',
      'DELIVERED': 'Order has been delivered',
      'COMPLETED': 'Order completed successfully',
      'CANCELLED': 'Order has been cancelled',
    };

    await OrderTracking.create({
      orderId: order._id,
      status: validatedData.status,
      description: validatedData.description || defaultDescriptions[validatedData.status],
      location: validatedData.location,
      metadata: validatedData.metadata,
    });

    // Handle status-specific actions
    if (validatedData.status === 'CANCELLED') {
      // Restore product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { availableStock: item.quantity },
        });
      }
    }

    // Create notifications
    const buyerMessage = `Your order ${order.orderNumber} status: ${validatedData.status}`;
    const farmerMessage = `Order ${order.orderNumber} updated to: ${validatedData.status}`;

    await Notification.create({
      userId: order.buyerId._id,
      title: 'Order Status Update',
      message: buyerMessage,
      type: 'order',
      link: `/orders/${order._id}`,
    });

    if (validatedData.status !== 'CANCELLED') {
      await Notification.create({
        userId: order.farmerId._id,
        title: 'Order Status Update',
        message: farmerMessage,
        type: 'order',
        link: `/orders/${order._id}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Update order status error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
