import imagekit from "../config/imageKitConfig.js";
import Image from "../models/imageModel.js";

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });

    const savedImage = await Image.create({
      url: response.url,
      imageId: response.fileId,
    });

    res.json({
      success: true,
      message: "Image uploaded successfully!",
      data: { url: savedImage.url, imageId: savedImage.imageId },
      error: [],
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({
      success: false,
      message: "Upload failed.",
      error: error.message,
      data: [],
    });
  }
};
