import express from "express";
import User from "./userRouter.js";

const root = express.Router();
root.use("/user", User);

export default root;
