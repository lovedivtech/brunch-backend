import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connection_db from "./config/db.js";
import fs from "fs";
import https from "https";

connection_db();

const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
};

const port = process.env.PORT || 3000;
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`✅ HTTPS Server running at https://localhost:${port}`);
});
