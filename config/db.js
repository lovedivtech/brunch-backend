import mongoose from "mongoose";

const connection_db = async () => {
  try {
    await mongoose.connect(process.env.DB, {});
    console.log("DB is connect");
  } catch (err) {
    console.log("DB fail to connect", err.message);
  }
};

export default connection_db;
