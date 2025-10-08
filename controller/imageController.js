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

export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find({}).select("-__v").sort({ _id: -1 });
    res.json({
      success: true,
      message: "Images fetched successfully!",
      data: images,
      error: [],
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching images.",
      error: error.message,
      data: [],
    });
  }
};

export const getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id).select("-__v");
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
        error: error.message,
        data: [],
      });
    }
    res.json({
      success: true,
      message: "Image fetched successfully!",
      data: image,
      error: [],
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching image.",
      error: error.message,
      data: [],
    });
  }
};
