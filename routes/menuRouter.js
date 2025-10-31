import express from "express";
import { checkOwnerRole, validate } from "../middleware/validate.js";
import { isAuthenticated } from "../utils/jwtToken.js";
import {
  createMenuItem,
  getAllMenuItem,
  getSingleMenuItem,
  updateMenuItem,
  deleteMenuItem,
  favoriteMenuItem,
  getAllMenuOfMyHotel,
} from "../controller/menuController.js";
import {
  createMenuValidator,
  viewAllMenuValidator,
  viewSingleMenuValidator,
  updateMenuValidator,
  deleteMenuValidator,
} from "../middleware/menuValidator.js";

const route = express.Router();
route.post(
  "/hotel/:id/menu-creation",
  isAuthenticated,
  validate(createMenuValidator),
  checkOwnerRole,
  createMenuItem
);

route.get(
  "/hotel/:id/all-menus",
  isAuthenticated,
  validate(viewAllMenuValidator),
  getAllMenuItem
);
route.get(
  "/hotel/:id/favorite-menus",
  isAuthenticated,
  checkOwnerRole,
  favoriteMenuItem
);

route.get(
  "/hotel/menu/:id",
  validate(viewSingleMenuValidator),
  isAuthenticated,
  getSingleMenuItem
);

route.put(
  "/hotel/:id/menu-update/:id",
  isAuthenticated,
  validate(updateMenuValidator),
  checkOwnerRole,
  updateMenuItem
);

route.delete(
  "/hotel/:hotelId/menus-delete/:menuId",
  isAuthenticated,
  validate(deleteMenuValidator),
  checkOwnerRole,
  deleteMenuItem
);

route.get(
  "/owner/all-menus",
  isAuthenticated,
  checkOwnerRole,
  getAllMenuOfMyHotel
);

export default route;
