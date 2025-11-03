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

// ✅ Create a new menu item
route.post(
  "/hotel/:hotelId/menu-creation",
  isAuthenticated,
  validate(createMenuValidator),
  checkOwnerRole,
  createMenuItem
);

// ✅ Get all menus of a specific hotel (owned by user)
route.get(
  "/hotel/:hotelId/all-menus",
  isAuthenticated,
  validate(viewAllMenuValidator),
  getAllMenuItem
);

// ✅ Get favorite menus (rating >= 4)
route.get(
  "/hotel/:hotelId/favorite-menus",
  isAuthenticated,
  checkOwnerRole,
  favoriteMenuItem
);

// ✅ Get single menu item by ID
route.get(
  "/hotel/menu/:menuId",
  isAuthenticated,
  validate(viewSingleMenuValidator),
  getSingleMenuItem
);

// ✅ Update a menu item
route.put(
  "/hotel/:hotelId/menu-update/:menuId",
  isAuthenticated,
  validate(updateMenuValidator),
  checkOwnerRole,
  updateMenuItem
);

// ✅ Delete a menu item
route.delete(
  "/hotel/:hotelId/menu-delete/:menuId",
  isAuthenticated,
  validate(deleteMenuValidator),
  checkOwnerRole,
  deleteMenuItem
);

// ✅ Get all menus from all hotels owned by the owner
route.get(
  "/owner/all-menus",
  isAuthenticated,
  checkOwnerRole,
  getAllMenuOfMyHotel
);

export default route;
