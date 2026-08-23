import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// GET /api/payments/methods - Get available payment methods
export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Payment methods configuration
    const paymentMethods = [
      {
        id: 'CARD',
        name: 'Credit/Debit Card',
        description: 'Pay securely with your card via Paystack',
        icon: 'CreditCard',
        available: true,
        processingFee: 1.5, // percentage
        supportedCards: ['Visa', 'Mastercard', 'Verve'],
      },
      {
        id: 'BANK_TRANSFER',
        name: 'Bank Transfer',
        description: 'Direct bank transfer',
        icon: 'Building',
        available: true,
        processingFee: 0,
        estimatedTime: '1-3 business days',
      },
      {
        id: 'MOBILE_MONEY',
        name: 'Mobile Money',
        description: 'Pay with mobile money services',
        icon: 'Smartphone',
        available: true,
        processingFee: 1.0,
        supportedProviders: ['MTN', 'Vodafone', 'AirtelTigo'],
      },
    ];

    // Payment gateway configuration
    const gatewayConfig = {
      primaryGateway: 'PAYSTACK',
      fallbackGateway: 'FLUTTERWAVE',
      testMode: process.env.NODE_ENV !== 'production',
      supportedCurrencies: ['USD', 'GHS', 'NGN', 'KES'],
      defaultCurrency: 'USD',
    };

    return NextResponse.json({
      paymentMethods,
      gatewayConfig,
      securityFeatures: [
        'PCI DSS Compliant',
        '256-bit SSL Encryption',
        '3D Secure Authentication',
        'Fraud Detection System',
      ],
    });
  } catch (error) {
    console.error('Payment methods error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}
