// Order Model
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IOrder extends Document {
  _id: Types.ObjectId;
  buyerId: Types.ObjectId;
  sellerId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalAmount: number;
  status: 'PLACED' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
  deliveryAddress?: string;
  notes?: string;
  orderNumber?: string;
  farmerId?: Types.ObjectId;
  items?: Array<{
    productId: Types.ObjectId;
    quantity: number;
    pricePerUnit: number;
  }>;
  shippingInfo?: {
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED'],
      default: 'PLACED',
      index: true,
    },
    deliveryAddress: {
      type: String,
    },
    notes: {
      type: String,
    },
    orderNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
      pricePerUnit: {
        type: Number,
        required: true,
        min: 0,
      },
    }],
    shippingInfo: {
      trackingNumber: String,
      carrier: String,
      estimatedDelivery: String,
      notes: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
OrderSchema.index({ buyerId: 1, status: 1 });
OrderSchema.index({ sellerId: 1, status: 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
