import mongoose, { Document, Schema } from 'mongoose';

export interface IQuote extends Document {
  productId: mongoose.Types.ObjectId;
  productName: string;
  customerName: string;
  email: string;
  phone: string;
  company?: string;
  quantity: string;
  country: string;
  message?: string;
  status: 'pending' | 'quoted' | 'approved' | 'rejected';
  adminNotes?: string;
  quotedPrice?: number;
  quotedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const quoteSchema = new Schema<IQuote>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    quantity: {
      type: String,
      required: [true, 'Quantity is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'quoted', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    quotedPrice: {
      type: Number,
      min: 0,
    },
    quotedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching
quoteSchema.index({ email: 1, productId: 1, createdAt: -1 });

export const Quote = mongoose.model<IQuote>('Quote', quoteSchema);

