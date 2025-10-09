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
      data: {
        id: savedImage._id,
        url: savedImage.url,
        imageId: savedImage.imageId,
      },
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

export const getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id).select("-__v");
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
        error: [],
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
      error: [],
      data: [],
    });
  }
};

export const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
        error: [],
        data: [],
      });
    }
    //////////////////////////// update in imagekit //////////////////////////////
    const existingImage = await Image.findById(id);
    if (!existingImage) {
      return res.status(404).json({
        success: false,
        message: "Image record not found.",
        error: [],
        data: [],
      });
    }
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });
    //////////////// delete old image from imagekit ////////////////////////////////
    if (existingImage.imageId) {
      await imagekit.deleteFile(existingImage.imageId);
    }
    existingImage.url = response.url;
    existingImage.imageId = response.fileId;
    //////////////// save updated record in database ///////////////////////////////
    await existingImage.save();
    res.json({
      success: true,
      message: "Image updated successfully!",
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

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const existingImage = await Image.findById(id);
    if (!existingImage) {
      return res.status(404).json({
        success: false,
        message: "Image record not found.",
        error: [],
        data: [],
      });
    }
    //////////////// delete from imagekit ////////////////////////////////
    if (existingImage.imageId) {
      await imagekit.deleteFile(existingImage.imageId);
    }
    //////////////// delete from database   ///////////////////////////////
    await Image.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Image deleted successfully!",
      data: [],
      error: [],
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting image.",
      error: error.message,
      data: [],
    });
  }
};
