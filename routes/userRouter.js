import express from "express";
import { validate } from "../middleware/validate.js";
import { isAuthenticated } from "../utils/jwtToken.js";
import {
  signUp,
  logIn,
  forgotPWD,
  resetPWD,
  updatePWD,
} from "../controller/userController.js";

import {
  userSignupvalidator,
  userLoginvalidator,
  userForgotPWDvalidator,
  userResetPWDvalidator,
  updatePWDValidator,
} from "../middleware/userValidetor.js";

const route = express.Router();
route.post("/signup", validate(userSignupvalidator), signUp);
route.post("/login", validate(userLoginvalidator), logIn);
route.post("/forgot-password", validate(userForgotPWDvalidator), forgotPWD);
route.post("/reset-password/:token", validate(userResetPWDvalidator), resetPWD);
route.put(
  "/update-password",
  isAuthenticated,
  validate(updatePWDValidator),
  updatePWD
);

export default route;
