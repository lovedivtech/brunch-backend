import * as yup from "yup";
import hotelModel from "../models/hotelModel.js";

export const createHotelvalidator = yup.object({
  hotelName: yup
    .string()
    .required("Hotel name is required")
    .min(3, "Hotel name must be at least 3 characters"),

  address: yup.object({
    street: yup.string().required("Street is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zip: yup.string().required("ZIP code is required"),
    country: yup.string().required("Country is required"),
  }),

  category: yup
    .array()
    .of(yup.string().required("Category cannot be empty"))
    .min(1, "At least one category is required"),

  Images: yup
    .array()
    .of(yup.string().url("Each image must be a valid URL"))
    .min(1, "At least one image is required"),

  staff: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required("Staff name is required"),
        role: yup.string().required("Staff role is required"),
      })
    )
    .min(1, "At least one staff member is required"),

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

export const viewHotelDetailsValidator = yup.object({});
