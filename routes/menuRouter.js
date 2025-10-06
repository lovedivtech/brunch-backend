import express from "express";
import { checkOwnerRole, validate } from "../middleware/validate.js";
import { isAuthenticated } from "../utils/jwtToken.js";
const route = express.Router();
import { createMenu } from "../controller/menuController.js";
import { createMenuValidator } from "../middleware/menuValidator.js";
route.post(
  "/menu-creation",
  isAuthenticated,
  validate(createMenuValidator),
  checkOwnerRole,
  createMenu
);

export default route;
