import { Request, Response } from "express";
import { Category } from "../models/Category.model.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { visible } = req.query;

    const query: any = {};
    if (visible !== undefined) {
      query.visible = visible === "true";
    }

    const categories = await Category.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, visible } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: "Category name is required",
      });
      return;
    }

    // Ensure uniqueness by name
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
      return;
    }

    const category = await Category.create({
      name: name.trim(),
      visible: visible !== undefined ? visible : true,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
export const updateCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    const { name, visible, quoteVisible } = req.body;

    if (name) {
      // Check for duplicate name if name is being changed
      const existing = await Category.findOne({
        name: name.trim(),
        _id: { $ne: category._id },
      });
      if (existing) {
        res.status(400).json({
          success: false,
          message: "Another category with this name already exists",
        });
        return;
      }
      category.name = name.trim();
    }

    if (visible !== undefined) {
      category.visible = !!visible;
    }

    if (quoteVisible !== undefined) {
      category.quoteVisible = !!quoteVisible;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
