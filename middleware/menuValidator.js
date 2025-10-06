import mongoose from "mongoose";
import * as yup from "yup";

// Allowed cuisine types (same as in schema)
const allowedTypes = [
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
];

// Yup schema for creating a menu item
export const createMenuValidator = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters")
    .required("Name is required"),

  description: yup
    .string()
    .max(500, "Description must be at most 500 characters")
    .nullable(),

  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be a positive number")
    .required("Price is required")
    .when("offer", {
      is: (val) => val !== undefined && val !== null,
      then: yup.number().required("Price is required when offer is present"),
    }),
  offer: yup
    .number()
    .typeError("Offer must be a number")
    .min(0, "Offer cannot be negative")
    .max(yup.ref("price"), "Offer must be less than price")
    .notRequired(),

  category: yup
    .array()
    .of(
      yup
        .string()
        .oneOf(["veg", "non-veg"], 'Category must be "veg" or "non-veg"')
    )
    .min(1, "At least one category is required")
    .required("Category is required"),

  type: yup
    .array()
    .of(yup.string().oneOf(allowedTypes, "Invalid cuisine type"))
    .min(1, "At least one cuisine type is required")
    .required("Cuisine type is required"),

  available: yup.boolean().default(true),

  image_url: yup
    .string()
    .url("Image URL must be a valid URL")
    .required("Image URL is required"),
});
