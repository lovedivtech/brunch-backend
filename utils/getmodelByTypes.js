// utils/getModelByType.js
import Hotel from "../models/hotelModel.js";
import Menu from "../models/menuModel.js";

export const getModelByType = (type) => {
  switch (type) {
    case "hotel":
      return Hotel;
    case "menu":
      return Menu;
    default:
      throw new Error("Invalid model type");
  }
};
