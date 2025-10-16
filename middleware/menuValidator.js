import * as yup from "yup";
import Menu from "../models/menuModel.js";
// Allowed cuisine types (same as in schema)
const allowedTypes = [
  "punjabi",
  "chinese",
  "south-indian",
  "north-indian",
  "hyderabadi",
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
  "dessert",
  "starter",
  "drink",
];

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

  rating: yup
    .number()
    .typeError("Rating must be a number")
    .min(0, "Rating cannot be negative")
    .max(5, "Rating must be between 0 and 5")
    .notRequired(),

  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be a positive number")
    .required("Price is required"),

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

  images: yup.array().of(
    yup.object().shape({
      url: yup.string().url().required("Image URL is required"),
      imageId: yup.string().required("Image ID is required"),
    })
  ),
});

export const viewAllMenuValidator = yup
  .object()
  .shape({})
  .test("menus-exist", "Menu not found", async () => {
    const menus = await Menu.find();
    return menus && menus.length > 0;
  });

export const viewSingleMenuValidator = yup.object().shape({});

export const updateMenuValidator = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters")
    .notRequired(),

  description: yup
    .string()
    .max(500, "Description must be at most 500 characters")
    .nullable()
    .notRequired(),

  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be a positive number")
    .notRequired(),

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
    .notRequired(),

  type: yup
    .array()
    .of(yup.string().oneOf(allowedTypes, "Invalid cuisine type"))
    .min(1, "At least one cuisine type is required")
    .notRequired(),

  available: yup.boolean().notRequired(),

  images: yup
    .array()
    .of(yup.string().url("Each image must be a valid URL"))
    .min(1, "At least one image is required"),
});

export const deleteMenuValidator = yup.object().shape({});
