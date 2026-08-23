import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Order from '@/models/Order';
import { getSession } from '@/lib/auth';

// GET /api/payments/history - Get payment history for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status'); // PENDING, COMPLETED, FAILED
    const skip = (page - 1) * limit;

    // Build query based on user role
    let orderQuery: any = {};
    
    if (session.role === 'BUYER') {
      orderQuery = { buyerId: session.id };
    } else if (session.role === 'FARMER') {
      orderQuery = { farmerId: session.id };
    } else if (session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get orders for the user
    const orders = await Order.find(orderQuery).select('_id');
    const orderIds = orders.map(o => o._id);

    // Build payment query
    const paymentQuery: any = { orderId: { $in: orderIds } };
    if (status) {
      paymentQuery.status = status;
    }

    // Get payments with populated order details
    const payments = await Payment.find(paymentQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'orderId',
        select: 'orderNumber totalAmount buyerId farmerId createdAt',
        populate: [
          { path: 'buyerId', select: 'fullName email' },
          { path: 'farmerId', select: 'fullName email' },
        ],
      });

    const total = await Payment.countDocuments(paymentQuery);

    return NextResponse.json({
      payments: payments.map(p => ({
        _id: p._id,
        amount: p.amount,
        paymentMethod: p.paymentMethod,
        paymentGateway: p.paymentGateway,
        transactionRef: p.transactionRef,
        status: p.status,
        paidAt: p.paidAt,
        createdAt: p.createdAt,
        order: p.orderId ? {
          _id: (p.orderId as any)._id,
          orderNumber: (p.orderId as any).orderNumber,
          totalAmount: (p.orderId as any).totalAmount,
          buyer: (p.orderId as any).buyerId,
          farmer: (p.orderId as any).farmerId,
          createdAt: (p.orderId as any).createdAt,
        } : null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Payment history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
}
