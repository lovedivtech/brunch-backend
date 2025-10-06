import Menu from "../models/menuModel.js";
import Hotel from "../models/hotelModel.js";
export const createMenu = async (req, res) => {
  try {
    const { menuData } = req.body;
    menuData.ownerId = await req.user._id;
    const menu = await Menu.create(menuData);
    return res.status(201).json({
      success: true,
      message: "Menu created successfully",
      menu,
      errors: [],
    });
  } catch (error) {
    console.error("Menu creation error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      data: [],
      error: [error.message],
    });
  }
};
