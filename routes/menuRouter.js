import express from "express";
import { checkOwnerRole, validate } from "../middleware/validate.js";
import { isAuthenticated } from "../utils/jwtToken.js";
import {
  createMenu,
  getAllMenu,
  getSingleMenu,
  updateMenu,
  deleteMenu,
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
  "/menu-creation",
  isAuthenticated,
  validate(createMenuValidator),
  checkOwnerRole,
  createMenu
);

route.get("/all-menus", validate(viewAllMenuValidator), getAllMenu);
route.get("/:id", validate(viewSingleMenuValidator), getSingleMenu);

route.put(
  "/menu-update/:id",
  isAuthenticated,
  validate(updateMenuValidator),
  checkOwnerRole,
  updateMenu
);

route.delete(
  "/menus-delete/:id",
  isAuthenticated,
  validate(deleteMenuValidator),
  checkOwnerRole,
  deleteMenu
);

export default route;
