import Menu from "../models/menuModel.js";

export const createMenu = async (req, res) => {
  try {
    const menuData = { ...req.body, ownerId: req.user._id };
    const menu = await Menu.create(menuData);
    const menuList = {
      ownerId: menu.ownerId,
      id: menu._id,
      name: menu.name,
      description: menu.description,
      price: menu.price,
      offer: menu.offer,
      category: menu.category,
      type: menu.type,
      available: menu.available,
      image_url: menu.image_url,
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

////////////////////  getAllMenu  ////////////////////////
export const getAllMenu = async (req, res) => {
  try {
    const menus = await Menu.find().select("-__v -createdAt -updatedAt");
    if (!menus) {
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
      data: menus,
      errors: [],
    });
  } catch (error) {
    console.error("Menu creation error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
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

    const menuData = { ...req.body, ownerId: req.user._id };
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

export const favoriteMenu = async (req, res) => {};
