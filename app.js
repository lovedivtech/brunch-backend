import express from "express";
import User from "./routes/index.js";
const app = express();
app.use(express.json());

app.use("/api/v2", User);

export default app;
