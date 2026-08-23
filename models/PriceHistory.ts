// Price History Model
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IPriceHistory extends Document {
  _id: Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  price: number;
  marketAvg?: number;
  recordedAt: Date;
}

const PriceHistorySchema = new Schema<IPriceHistory>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    marketAvg: {
      type: Number,
      min: 0,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Compound index for efficient queries
PriceHistorySchema.index({ productId: 1, recordedAt: -1 });

const PriceHistory: Model<IPriceHistory> =
  mongoose.models.PriceHistory || mongoose.model<IPriceHistory>('PriceHistory', PriceHistorySchema);

export default PriceHistory;
