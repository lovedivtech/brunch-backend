import express from "express";
import upload from "../middleware/multerMiddlware.js";
import { checkOwnerRole } from "../middleware/validate.js";
import { isAuthenticated } from "../utils/jwtToken.js";

import {
  getAllImages,
  getImageById,
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

route.get("/All-images", getAllImages);

route.get("/:id", getImageById);

export default route;
