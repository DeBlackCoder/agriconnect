// Order Tracking Model
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IOrderTracking extends Document {
  _id: Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  status: string;
  location?: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const OrderTrackingSchema = new Schema<IOrderTracking>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
OrderTrackingSchema.index({ orderId: 1, createdAt: -1 });

const OrderTracking: Model<IOrderTracking> =
  mongoose.models.OrderTracking || mongoose.model<IOrderTracking>('OrderTracking', OrderTrackingSchema);

export default OrderTracking;
