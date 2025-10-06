import express from "express";
import User from "./userRouter.js";
import hotel from "./hotelRouter.js";
const root = express.Router();
root.use("/user", User);

root.use("/owner", hotel);

export default root;
