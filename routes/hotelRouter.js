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
  deleteHotel,
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
  isAuthenticated,
  validate(viewHotelDetailsValidator),
  viewHotelDetails
);

route.get(
  "/all-hotels",
  isAuthenticated,
  validate(viewHotelDetailsValidator),
  ViewAllHotels
);

route.put(
  "/hotel-update/:id",
  isAuthenticated,
  validate(updateHotelValidator),
  checkOwnerRole,
  updateHotel
);

route.delete("/hotel-delete/:id", isAuthenticated, checkOwnerRole, deleteHotel);

export default route;
