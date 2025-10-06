import * as Yup from "yup";

export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    next();
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = error.errors || [];

      return res.status(400).json({
        success: false,
        message: messages.join(", "),
        err: messages,
        data: [],
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
      data: [],
    });
  }
};

export const checkOwnerRole = (req, res, next) => {
  const user = req.user;

  if (!user || user.role !== "owner") {
    return res.status(403).json({
      success: false,
      message: "Only owners can perform this action.",
      data: [],
      errors: [],
    });
  }

  next();
};
