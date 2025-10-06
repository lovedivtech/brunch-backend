import mongoose from "mongoose";
const menuSchema = mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    name: { type: String },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    offer: { type: Number, default: 0 },
    category: [{ type: String, default: "" }], // e.g., ["veg", "non-veg"]
    type: [
      {
        type: String,
        enum: [
          "punjabi",
          "chinese",
          "south-indian",
          "gujarati",
          "mughlai",
          "continental",
          "mexican",
          "italian",
          "thai",
          "japanese",
          "korean",
          "lebanese",
          "american",
          "french",
          "greek",
          "spanish",
          "afghani",
          "bengali",
          "maharashtrian",
          "goan",
          "andhra",
          "rajasthani",
          "tibetan",
          "seafood",
          "bbq",
          "fast food",
          "beverages",
          "desserts",
        ],
      },
    ],
    available: { type: Boolean, default: true },
    image_url: { type: String, default: "" },
  },
  {
    timestamps: true,
    toObject: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.model("menu", menuSchema);
