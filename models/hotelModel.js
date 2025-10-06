import mongoose from "mongoose";

const hotelSchema = mongoose.Schema(
  {
    hotelName: { type: String, default: "" },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zip: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    category: [{ type: String, default: "" }],
    Images: [{ type: String, default: "" }],
    staff: [
      {
        name: { type: String, default: "" },
        role: { type: String, default: "" },
      },
    ],
    vacancy: { type: String, default: "" },
    description: { type: String, default: "" },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    rating: { type: Number, default: 0 },
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

export default mongoose.model("hotel", hotelSchema);
