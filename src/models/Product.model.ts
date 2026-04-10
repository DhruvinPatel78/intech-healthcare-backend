import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  categoryId: string;
  casNo: string;
  visible: boolean;
  quoteVisible: boolean;
  imageUrl?: string;
  imagePublicId?: string;
  info?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    categoryId: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    casNo: {
      type: String,
      required: [true, "casNo is required"],
      trim: true,
    },
    visible: {
      type: Boolean,
      required: [true, "visible is required"],
      default: true,
    },
    quoteVisible: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    imagePublicId: {
      type: String,
      trim: true,
    },
    info: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for searching
productSchema.index({ name: "text", category: "text" });

export const Product = mongoose.model<IProduct>("Product", productSchema);
