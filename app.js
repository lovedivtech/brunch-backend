import express from "express";
import cors from "cors";
import root from "./routes/index.js";
const app = express();
app.use(express.json());

app.use("/api/v2", root);
app.use(cors());
app.use("/", (req, res) => {
  res.send("Server is running....");
});

export default app;
