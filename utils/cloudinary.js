import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// Upload an image
export const uploadOnCloudinary = async (imagePath) => {
  try {
    if (!imagePath) return null;
    const response = await cloudinary.uploader.upload(imagePath, {
      resource_type: "auto",
    });
    return {
      url: response.secure_url,
      public_id: response.public_id,
    };
  } catch (error) {
    fs.unlinkSync(imagePath);
    return null;
  }
};
