import imagekit from "../config/imageKitConfig.js";
import { getModelByType } from "../utils/getmodelByTypes.js";
export const uploadImage = async (req, res) => {
  try {
    const { type } = req.query;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No image file provided." });
    }
    const Model = await getModelByType(type);
    const doc = await Model.findOne().select("-__v");
    if (!doc) {
      doc = new Model({
        images: [],
      });
    }
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });

    doc.images.push({
      url: response.url,
      imageId: response.fileId,
    });
    await doc.save({ validateBeforeSave: false });
    const uploadedImage = {
      id: doc.images[doc.images.length - 1]._id,
      url: response.url,
      imageId: response.fileId,
    };
    console.log(uploadedImage.id);
    res.json({
      success: true,
      message: "Image uploaded successfully!",
      data: uploadedImage,
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
    const Model = await getModelByType(req.query.type);
    const doc = await Model.findOne();
    // ✅ Find the image in the images array
    const existingImage = doc.images.find(
      (img) => img._id.toString() === id || img.imageId === id
    );

    if (!existingImage) {
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
    if (existingImage.imageId) {
      await imagekit.deleteFile(existingImage.imageId);
    }

    // ✅ Update fields in the image subdocument
    existingImage.url = response.url;
    existingImage.imageId = response.fileId;

    // ✅ Save hotel with updated image
    await doc.save();

    return res.json({
      success: true,
      message: "Image updated successfully!",
      data: {
        id: existingImage._id,
        url: response.url,
        imageId: response.fileId,
      },
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
    const { id } = req.params;
    const Model = getModelByType(req.query.type);
    const doc = await Model.findOne();
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Image not found.",
        data: [],
        error: [],
      });
    }
    // ✅ Find the image in the images array
    const existingImage = doc.images.find(
      (img) => img._id.toString() === id || img.imageId === id
    );
    //////////////// delete from imagekit ////////////////////////////////
    if (existingImage.imageId) {
      await imagekit.deleteFile(existingImage.imageId);
    }
    //////////////// delete from database   ///////////////////////////////
    doc.images = doc.images.filter(
      (img) => img._id.toString() !== id && img.imageId !== id
    );
    await doc.save({ validateBeforeSave: false });

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
