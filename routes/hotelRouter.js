import express from "express";
import { checkOwnerRole, validate } from "../middleware/validate.js";
import { isAuthenticated } from "../utils/jwtToken.js";
import {
  createHotelvalidator,
  updateHotelValidator,
  viewHotelDetailsValidator,
} from "../middleware/hotelValidetor.js";
import {
  createHotel,
  updateHotel,
  viewHotelDetails,
} from "../controller/hotelController.js";
import upload from "../middleware/multer.js";

const route = express.Router();
route.post(
  "/hotel-creation",
  isAuthenticated,
  validate(createHotelvalidator),
  checkOwnerRole,
  upload.array("images", 10),
  createHotel
);

route.get(
  "/hotel-description",
  validate(viewHotelDetailsValidator),
  viewHotelDetails
);

route.put(
  "/hotel-update/:id",
  isAuthenticated,
  validate(updateHotelValidator),
  checkOwnerRole,
  updateHotel
);

export default route;
