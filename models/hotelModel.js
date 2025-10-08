import mongoose from "mongoose";

const hotelSchema = mongoose.Schema(
  {
    hotelName: { type: String, default: "" },
    openingTime: { type: String, default: "" },
    closingTime: { type: String, default: "" },

    address: { type: String, default: "" },
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pin: { type: String, default: "" },
    country: { type: String, default: "" },

    category: { type: String, default: "" },
    Images: [{ type: String, default: "" }],
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
