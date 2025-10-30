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
  ViewAllHotels,
  viewHotelDetails,
} from "../controller/hotelController.js";

const route = express.Router();
route.post(
  "/hotel-creation",
  isAuthenticated,

  checkOwnerRole,
  validate(createHotelvalidator),
  createHotel
);

route.get(
  "/hotel-description/:id",
  validate(viewHotelDetailsValidator),
  viewHotelDetails
);

route.get("/all-hotels", validate(viewHotelDetailsValidator), ViewAllHotels);

route.put(
  "/hotel-update/:id",
  isAuthenticated,
  validate(updateHotelValidator),
  checkOwnerRole,
  updateHotel
);

export default route;
