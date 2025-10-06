import * as Yup from "yup";
const roles = ["user", "admin", "owner"];
import User from "../models/userModel.js";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneNoRegex = /^[6-9]\d{9}$/;

export const userSignupvalidator = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),

  lastName: Yup.string().required("Last name is required"),

  email: Yup.string()
    .required("Email is required")
    .matches(emailRegex, "Email is invalid")
    .test("email-unique", "Email already exists", async (value) => {
      if (!value) return false;
      const existingUser = await User.findOne({ email: value });
      return !existingUser;
    }),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),

  username: Yup.string()
    .notRequired()
    .test("username-unique", "Username already exists", async (value) => {
      if (!value) return true;
      const existingUser = await User.findOne({ username: value });
      return !existingUser;
    }),

  phoneNo: Yup.string()
    .notRequired()
    .test(
      "is-valid-phone",
      "Phone number is invalid",
      (value) => !value || phoneNoRegex.test(value)
    ),

  role: Yup.string()

    .default("user")
    .oneOf(roles, `Role must be one of: ${roles.join(", ")}`),

  license: Yup.mixed().when("role", {
    is: (role) => role === "admin" || role === "owner",
    then: (schema) =>
      schema.test(
        "license-required",
        "Select(false)",
        (value) => value !== undefined && value !== null && value !== ""
      ),
    otherwise: (schema) => schema.notRequired(),
  }),

  gstNo: Yup.string().when("role", {
    is: (role) => role === "owner",
    then: (schema) =>
      schema.test(
        "gstNo-required",
        "Select(false)",
        (value) => typeof value === "string" && value.trim() !== ""
      ),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const userLoginvalidator = Yup.object().shape({
  emailOrUsername: Yup.string()
    .required("Email or Username is required")
    .test(
      "user-exists",
      "User not found with provided email or username",
      async function (value) {
        if (!value) return false;

        const user = await User.findOne({
          $or: [{ email: value }, { username: value }],
        });

        return !!user;
      }
    ),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

export const userForgotPWDvalidator = Yup.object().shape({
  email: Yup.string()
    .required("Email  is required")
    .test(
      "user-exists",
      "User not found with provided email ",
      async function (value) {
        if (!value) return false;

        const user = await User.findOne({ email: value });

        return !!user;
      }
    ),
});

export const userResetPWDvalidator = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),

  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export const updatePWDValidator = Yup.object().shape({
  oldPassword: Yup.string().required("Old password is required"),

  password: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters"),

  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});
