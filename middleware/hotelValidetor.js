import * as yup from "yup";
import hotelModel from "../models/hotelModel.js";

export const createHotelvalidator = yup.object({
  hotelName: yup
    .string()
    .required("Hotel name is required")
    .min(3, "Hotel name must be at least 3 characters"),
  openingTime: yup.string().required("Opening time is required"),
  closingTime: yup.string().required("Closing time is required"),
  address: yup.string().required("Address is required"),
  street: yup.string().required("Street is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  pin: yup.string().required("pin code is required"),
  country: yup.string().required("Country is required"),

  category: yup.string().required("Category is required"),

  images: yup.array().of(
    yup.object().shape({
      url: yup.string().url().required("Image URL is required"),
      imageId: yup.string().required("Image ID is required"),
    })
  ),

  vacancy: yup.string().required("Vacancy is required"),

  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),

  rating: yup
    .number()
    .min(0, "Rating cannot be negative")
    .max(5, "Rating cannot exceed 5")
    .default(0),
});

export const viewHotelDetailsValidator = yup
  .object({})
  .shape({})
  .test("hotel-exist", "Hotel not found", async () => {
    const hotels = await hotelModel.find();
    return hotels && hotels.length > 0;
  });

export const updateHotelValidator = yup
  .object({
    hotelName: yup
      .string()
      .required("Hotel name is required")
      .min(3, "Hotel name must be at least 3 characters"),
    openingTime: yup.string().required("Opening time is required"),
    closingTime: yup.string().required("Closing time is required"),
    address: yup.string().required("Address is required"),
    street: yup.string().required("Street is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    pin: yup.string().required("pin code is required"),
    country: yup.string().required("Country is required"),

    category: yup.string().required("Category is required"),

    images: yup
      .array()
      .of(yup.string().url("Each image must be a valid URL"))
      .min(1, "At least one image is required"),

    vacancy: yup.string().required("Vacancy is required"),

    description: yup
      .string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),

    rating: yup
      .number()
      .min(0, "Rating cannot be negative")
      .max(5, "Rating cannot exceed 5")
      .default(0),
  })
  .test("hotel-NOT-exist", "Hotel NOT found", async function (value) {
    const existingHotel = await hotelModel.findOne({ _id: value.id });
    return !existingHotel;
  })
  .noUnknown("Unknown fields are not allowed");
