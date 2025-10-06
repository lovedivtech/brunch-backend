import express from "express";
import { validate } from "../middleware/validate.js";
import { isAuthenticated } from "../utils/jwtToken.js";
import {
  createHotelvalidator,
  viewHotelDetailsValidator,
} from "../middleware/hotelValidetor.js";
import {
  createHotel,
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

export default route;
