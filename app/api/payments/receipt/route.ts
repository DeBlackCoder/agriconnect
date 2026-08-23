import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Order from '@/models/Order';
import { getSession } from '@/lib/auth';

// GET /api/payments/receipt - Generate payment receipt
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
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get payment with full order details
    const payment = await Payment.findById(paymentId).populate({
      path: 'orderId',
      populate: [
        { 
          path: 'buyerId', 
          select: 'fullName email phoneNumber' 
        },
        { 
          path: 'farmerId', 
          select: 'fullName email phoneNumber' 
        },
        {
          path: 'items.productId',
          select: 'name unit pricePerUnit',
        },
      ],
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    const order = payment.orderId as any;

    // Check authorization
    if (
      session.role !== 'ADMIN' &&
      order.buyerId._id.toString() !== session.id &&
      order.farmerId._id.toString() !== session.id
    ) {
      return NextResponse.json(
        { error: 'Unauthorized to view this receipt' },
        { status: 403 }
      );
    }

    // Check if payment is completed
    if (payment.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment not completed yet' },
        { status: 400 }
      );
    }

    // Generate receipt data
    const receipt = {
      receiptNumber: `REC-${payment.transactionRef}`,
      issueDate: payment.paidAt || payment.updatedAt,
      payment: {
        transactionRef: payment.transactionRef,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        paymentGateway: payment.paymentGateway,
        status: payment.status,
        paidAt: payment.paidAt,
      },
      order: {
        orderNumber: order.orderNumber,
        orderDate: order.createdAt,
        totalAmount: order.totalAmount,
        deliveryFee: order.deliveryFee || 0,
        subtotal: order.totalAmount - (order.deliveryFee || 0),
        items: order.items.map((item: any) => ({
          productName: item.productId.name,
          quantity: item.quantity,
          unit: item.productId.unit,
          pricePerUnit: item.pricePerUnit,
          subtotal: item.quantity * item.pricePerUnit,
        })),
      },
      buyer: {
        name: order.buyerId.fullName,
        email: order.buyerId.email,
        phone: order.buyerId.phoneNumber || 'N/A',
      },
      seller: {
        name: order.farmerId.fullName,
        email: order.farmerId.email,
        phone: order.farmerId.phoneNumber || 'N/A',
      },
      platformInfo: {
        name: 'AgriConnect',
        email: 'support@agriconnect.com',
        phone: '+1 (555) 123-4567',
        website: 'www.agriconnect.com',
      },
      notes: [
        'This is an official receipt for your transaction.',
        'Keep this receipt for your records.',
        'For any inquiries, contact our support team.',
      ],
    };

    return NextResponse.json({
      success: true,
      receipt,
    });
  } catch (error) {
    console.error('Receipt generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate receipt' },
      { status: 500 }
    );
  }
}
