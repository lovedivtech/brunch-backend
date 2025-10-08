import express from "express";
import upload from "../middleware/multerMiddlware.js";
import { checkOwnerRole } from "../middleware/validate.js";
import { isAuthenticated } from "../utils/jwtToken.js";

import { uploadImage } from "../controller/imageController.js";

const route = express.Router();

route.post(
  "/image-upload",
  isAuthenticated,
  checkOwnerRole,
  upload.single("image"),
  uploadImage
);

export default route;
