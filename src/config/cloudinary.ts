import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Validate Cloudinary environment variables
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Check if all required Cloudinary credentials are present
const validateCloudinaryConfig = (): void => {
  const missing: string[] = [];

  if (!cloudinaryConfig.cloud_name) {
    missing.push("CLOUDINARY_CLOUD_NAME");
  }
  if (!cloudinaryConfig.api_key) {
    missing.push("CLOUDINARY_API_KEY");
  }
  if (!cloudinaryConfig.api_secret) {
    missing.push("CLOUDINARY_API_SECRET");
  }

  if (missing.length > 0) {
    console.error("Missing Cloudinary environment variables:");
    missing.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error("\nPlease add these to your .env file:");
    console.error("CLOUDINARY_CLOUD_NAME=your_cloud_name");
    console.error("CLOUDINARY_API_KEY=your_api_key");
    console.error("CLOUDINARY_API_SECRET=your_api_secret");
    console.error(
      "\nGet your credentials from: https://cloudinary.com/console\n",
    );
  }
};

// Validate on module load
validateCloudinaryConfig();

// Configure Cloudinary (only if credentials are available)
if (
  cloudinaryConfig.cloud_name &&
  cloudinaryConfig.api_key &&
  cloudinaryConfig.api_secret
) {
  cloudinary.config({
    cloud_name: cloudinaryConfig.cloud_name,
    api_key: cloudinaryConfig.api_key,
    api_secret: cloudinaryConfig.api_secret,
    secure: true,
  });
} else {
  console.warn("Cloudinary not configured - image uploads will fail");
}

export default cloudinary;

// Helper function to upload image to Cloudinary
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = "intech-healthcare/products",
): Promise<{ url: string; publicId: string }> => {
  // Check if Cloudinary is configured
  if (
    !cloudinaryConfig.cloud_name ||
    !cloudinaryConfig.api_key ||
    !cloudinaryConfig.api_secret
  ) {
    throw new Error(
      "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.",
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        format: "jpg", // Convert all images to JPG
        transformation: [
          { width: 1000, height: 1000, crop: "limit" }, // Max dimensions
          { quality: "auto:good" }, // Auto-optimize quality
          { fetch_format: "auto" }, // Auto format (WebP for supported browsers)
        ],
      },
      (error, result) => {
        if (error) {
          // Provide more specific error messages
          let errorMessage = "Failed to upload image to Cloudinary";
          if (error.message) {
            errorMessage = error.message;
          } else if (error.http_code) {
            errorMessage = `Cloudinary error (${error.http_code}): ${error.message || "Upload failed"}`;
          }

          reject(new Error(errorMessage));
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } else {
          reject(new Error("Unknown error: Cloudinary returned no result"));
        }
      },
    );

    uploadStream.end(fileBuffer);
  });
};

// Helper function to delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error("Failed to delete image from Cloudinary");
  }
};
