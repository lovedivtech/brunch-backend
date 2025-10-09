import express from "express";
import upload from "../middleware/multerMiddlware.js";
import { checkOwnerRole } from "../middleware/validate.js";
import { isAuthenticated } from "../utils/jwtToken.js";

import {
  deleteImage,
  getImageById,
  updateImage,
  uploadImage,
} from "../controller/imageController.js";

const route = express.Router();

route.post(
  "/image-upload",
  isAuthenticated,
  checkOwnerRole,
  upload.single("image"),
  uploadImage
);

route.get("/:id", getImageById);

route.put(
  "/image-update/:id",
  isAuthenticated,
  checkOwnerRole,
  upload.single("image"),
  updateImage
);

route.delete("/image-delete/:id", isAuthenticated, checkOwnerRole, deleteImage);

export default route;
