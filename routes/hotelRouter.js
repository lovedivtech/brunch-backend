import express from "express";
import { validate } from "../middleware/validate.js";
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

const route = express.Router();
route.post(
  "/hotel-creation",
  isAuthenticated,
  validate(createHotelvalidator),
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
  updateHotel
);

export default route;
