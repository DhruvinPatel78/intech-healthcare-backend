import multer from "multer";
import { Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage();

const fileFilter:any = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Middleware wrapper to handle multer errors properly
export const uploadSingle = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const multerMiddleware = upload.single("image");
  
  multerMiddleware(req, res, (err: any) => {
    if (err) {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File too large. Maximum size is 5MB.",
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || "File upload error",
        });
      }
      // Handle other errors (like fileFilter errors)
      return res.status(400).json({
        success: false,
        message: err.message || "File upload error",
      });
    }
    next();
  });
};

// Export middleware for multiple image upload
// export const uploadMultiple = upload.array("images", 5); // Max 5 images
