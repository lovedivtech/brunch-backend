import imagekit from "../config/imageKitConfig.js";
import { getModelByType } from "../utils/getmodelByTypes.js";
export const uploadImage = async (req, res) => {
  try {
    const { type } = req.query;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No image file provided." });
    }
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });

    res.json({
      success: true,
      message: "Image uploaded successfully!",
      data: { url: response.url, imageId: response.fileId },
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
    const Model = getModelByType(req.query.type);
    const doc = await Model.findOne().select("images").lean();
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
        data: [],
        error: [],
      });
    }
    if (doc.images.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No images found.",
        data: [],
        error: [],
      });
    }

    return res.json({
      success: true,
      message: "Image fetched successfully!",
      data: { images: doc.images },
      error: [],
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching image.",
      data: [],
      error: error.message,
    });
  }
};

export const updateImage = async (req, res) => {
  try {
    const { type } = req.query;
    const { id: imageId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
        error: [],
        data: [],
      });
    }
    const Model = await getModelByType(type);
    // ✅ Find the document containing this imageId
    const doc = await Model.findOne({ "images.imageId": imageId });

    // ✅ Find the image in the images array
    const image = doc.images.find((img) => img.imageId === imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image record not found.",
        error: [],
        data: [],
      });
    }
    // ✅ Upload new image to ImageKit
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });

    // ✅ Delete old image from ImageKit (if any)
    await imagekit.deleteFile(image.imageId);

    // ✅ Update fields in the image subdocument
    image.url = response.url;
    image.imageId = response.fileId;

    // ✅ Save Document
    await doc.save();

    return res.json({
      success: true,
      message: "Image updated successfully!",
      data: image,
      error: [],
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return res.status(500).json({
      success: false,
      message: "Upload failed.",
      error: error.message,
      data: [],
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { id: imageId } = req.params;
    const { type } = req.query;

    if (!imageId || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing imageId or type.",
        data: [],
        error: [],
      });
    }

    const Model = getModelByType(type);

    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid type provided.",
        data: [],
        error: [],
      });
    }

    const doc = await Model.findOne({ "images.imageId": imageId });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
        data: [],
        error: [],
      });
    }

    const existingImage = doc.images.find((img) => img.imageId === imageId);

    if (!existingImage) {
      return res.status(404).json({
        success: false,
        message: "Image not found in document.",
        data: [],
        error: [],
      });
    }

    // ✅ Delete from ImageKit
    await imagekit.deleteFile(existingImage.imageId);

    // ✅ Remove from DB
    doc.images = doc.images.filter((img) => img.imageId !== imageId);
    await doc.save({ validateBeforeSave: false });

    return res.json({
      success: true,
      message: "Image deleted successfully!",
      data: [],
      error: [],
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting image.",
      error: error.message,
      data: [],
    });
  }
};
