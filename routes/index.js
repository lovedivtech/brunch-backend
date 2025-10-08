import express from "express";
import User from "./userRouter.js";
import hotel from "./hotelRouter.js";
import menu from "./menuRouter.js";
import image from "./imagerouter.js";

const root = express.Router();
root.use("/user", User);

root.use("/owner", hotel);

root.use("/menu", menu);

root.use("/image", image);

export default root;
