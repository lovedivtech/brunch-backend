import mongoose from "mongoose";
import { date } from "yup";

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, default: "", lowercase: true },
    password: { type: String, default: "" },
    phoneNo: { type: Number, required: false },
    role: { type: String, default: "user", enum: ["user", "admin", "owner"] },
    username: { type: String, default: "" },
    license: { type: String, default: "" },
    gstNo: { type: String, default: "" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    toObject: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.model("users", userSchema);
