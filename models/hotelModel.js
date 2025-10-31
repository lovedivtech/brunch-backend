import mongoose from "mongoose";

const hotelSchema = mongoose.Schema(
  {
    name: { type: String, default: "" },
    openingTime: { type: String, default: "" },
    closingTime: { type: String, default: "" },

    address: { type: String, default: "" },
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pin: { type: String, default: "" },
    country: { type: String, default: "" },

    category: { type: String, default: "" },
    images: [
      {
        url: { type: String },
        imageId: { type: String },
      },
    ],
    vacancy: { type: String, default: "" },
    description: { type: String, default: "" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    rating: { type: Number, default: 0 },
    menus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "menu",
      },
    ],
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
