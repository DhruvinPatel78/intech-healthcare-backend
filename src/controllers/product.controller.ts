import { Request, Response } from "express";
import { Product } from "../models/Product.model.js";
import { Category } from "../models/Category.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { status, category, limit, page } = req.query;

    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (category) query.category = category;

    // Pagination
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Admin)
export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;

    // Check if image file is uploaded
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
      } catch (uploadError: any) {
        res.status(400).json({
          success: false,
          message:
            uploadError.message || "Failed to upload image to Cloudinary",
        });
        return;
      }
    } else {
      console.log("ℹ️ No image file provided");
    }

    // Look up categoryId based on category name
    let categoryId: string | undefined;
    if (req.body.category) {
      const category = await Category.findOne({ name: req.body.category });
      if (category) {
        categoryId = category._id.toString();
      }
    }

    // Prepare product data
    const productData: any = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      categoryId: categoryId,
      casNo: req.body.casNo || "",
      visible: req.body.visible === "true" || req.body.visible === true,
      quoteVisible: req.body.quoteVisible === "true" || req.body.quoteVisible === true || req.body.quoteVisible === undefined,
      info: req.body.info || "",
    };

    // Add image data if uploaded
    if (imageUrl) {
      productData.imageUrl = imageUrl;
    }
    if (imagePublicId) {
      productData.imagePublicId = imagePublicId;
    }

    // Create product
    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error: any) {
    // Handle duplicate key error
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: "Product with this name already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    // Check if new image is uploaded
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (product.imagePublicId) {
          try {
            await deleteFromCloudinary(product.imagePublicId);
          } catch (deleteError) {
            console.warn(
              "⚠️ Failed to delete old image from Cloudinary:",
              deleteError,
            );
            // Continue with upload even if deletion fails
          }
        }

        // Upload new image
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        req.body.imageUrl = uploadResult.url;
        req.body.imagePublicId = uploadResult.publicId;
      } catch (uploadError: any) {
        res.status(400).json({
          success: false,
          message:
            uploadError.message || "Failed to upload image to Cloudinary",
        });
        return;
      }
    }

    // Convert visible string to boolean if needed
    const updateData: any = {
      ...req.body,
    };
    if (req.body.visible !== undefined) {
      updateData.visible =
        req.body.visible === "true" || req.body.visible === true;
    }
    if (req.body.quoteVisible !== undefined) {
      updateData.quoteVisible =
        req.body.quoteVisible === "true" || req.body.quoteVisible === true;
    }

    // Update categoryId if category name is being changed
    if (req.body.category) {
      const category = await Category.findOne({ name: req.body.category });
      if (category) {
        updateData.categoryId = category._id.toString();
      }
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    // Delete image from Cloudinary if exists
    if (product.imagePublicId) {
      try {
        await deleteFromCloudinary(product.imagePublicId);
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
        // Continue with product deletion even if image deletion fails
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q) {
      res.status(400).json({
        success: false,
        message: "Please provide search query",
      });
      return;
    }

    const products = await Product.find({
      $text: { $search: q as string },
      status: "active",
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
