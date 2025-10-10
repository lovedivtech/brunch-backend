import Menu from "../models/menuModel.js";
import { ApiFeatures } from "../utils/apiFunctionality.js";

export const createMenu = async (req, res) => {
  try {
    const menuData = { ...req.body };
    const menu = await Menu.create(menuData);
    const menuList = {
      id: menu._id,
      name: menu.name,
      description: menu.description,
      rating: menu.rating,
      price: menu.price,
      offer: menu.offer,
      category: menu.category,
      type: menu.type,
      available: menu.available,
      images: menu.images,
    };
    return res.status(201).json({
      success: true,
      message: "Menu created successfully",
      data: menuList,
      errors: [],
    });
  } catch (errors) {
    console.error("Menu creation error:", errors);
    return res.status(500).json({
      success: false,
      error: "Server error",
      data: [],
      errors: [errors.message],
    });
  }
};

////////////////////  getAllMenu (Pagination) ////////////////////////
export const getAllMenu = async (req, res) => {
  try {
    const menuQuery = Menu.find().select("-__v -createdAt -updatedAt");
    const apiFeatures = new ApiFeatures(menuQuery, req.query)
      .filter()
      .paginate();
    const filteredMenus = await apiFeatures.query;

    return res.status(200).json({
      success: true,
      message: filteredMenus.length
        ? `${filteredMenus.length} Menus found successfully`
        : "No menu items match your query",
      data: filteredMenus,
      errors: [],
    });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      errors: [error.message],
    });
  }
};

export const getSingleMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).select(
      "-__v -createdAt -updatedAt"
    );
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
        data: [],
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu Find successfully",
      data: menu,
      errors: [],
    });
  } catch (errors) {
    return res.status(500).json({
      success: false,
      error: "Server error",
      data: [],
      errors: [errors.message],
    });
  }
};

export const updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).select(
      "-__v -createdAt -updatedAt"
    );
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
        data: [],
        errors: [],
      });
    }

    const menuData = { ...req.body };
    const updatedMenu = await Menu.findByIdAndUpdate(req.params.id, menuData, {
      new: true,
      select: "-__v -createdAt -updatedAt",
    });
    return res.status(200).json({
      success: true,
      message: "Menu updated successfully",
      data: updatedMenu,
      errors: [],
    });
  } catch (errors) {
    return res.status(500).json({
      success: false,
      error: "Server error",
      data: [],
      errors: [errors.message],
    });
  }
};

export const deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
        data: [],
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu deleted successfully",
      data: [],
      errors: [],
    });
  } catch (errors) {
    return res.status(500).json({
      success: false,
      error: "Server error",
      data: [],
      errors: [errors.message],
    });
  }
};

export const favoriteMenu = async (req, res) => {
  try {
    const menu = await Menu.find({ rating: { $gte: 4 } }).select(
      "-__v -createdAt -updatedAt"
    );
    if (!menu || menu.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No favorite menus found",
        data: [],
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Favorite menus retrieved successfully",
      data: menu,
      errors: [],
    });
  } catch (errors) {
    return res.status(500).json({
      success: false,
      error: "Server error",
      data: [],
      errors: [errors.message],
    });
  }
};
