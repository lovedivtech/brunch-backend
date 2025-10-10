import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connection_db from "./config/db.js";
// import fs from "fs";
import http from "http";

connection_db();

// const sslOptions = {
//   key: fs.readFileSync(process.env.SSL_KEY_PATH),
//   cert: fs.readFileSync(process.env.SSL_CERT_PATH),
// };

app.get("/", (req, res) => res.send("Server is running live!"));

const port = process.env.PORT || 3000;
http.createServer(app).listen(port, () => {
  console.log(`✅ HTTP Server running at localhost:${port}`);
});
