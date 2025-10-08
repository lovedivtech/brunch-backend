import express from "express";
import cors from "cors";
import root from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v2", root);

export default app;
