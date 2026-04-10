import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  visible: boolean;
  quoteVisible: boolean;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    quoteVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Simple index for faster lookups by name
categorySchema.index({ name: 1 });

export const Category = mongoose.model<ICategory>("Category", categorySchema);
