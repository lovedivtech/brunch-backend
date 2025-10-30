import Menu from "../models/menuModel.js";
import Hotel from "../models/hotelModel.js";
import { ApiFeatures } from "../utils/apiFunctionality.js";

export const createMenuItem = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).select(
      "-__v -createdAt -updatedAt"
    );
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
        data: [],
        errors: ["Invalid hotel ID"],
      });
    }
    const {
      name,
      description,
      rating,
      price,
      offer,
      category,
      type,
      available,
      images,
    } = req.body;
    const menu = await Menu.create({
      name,
      description,
      rating,
      price,
      offer,
      category,
      type,
      available,
      images,
      hotel: hotel._id,
    });
    hotel.menus.push(menu._id);
    await hotel.save();
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
      hotel: menu.hotel,
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

// TODO :////////////////////  getAllMenu (Pagination / Filter/ Sort) ////////////////////////
export const getAllMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findById(id).select("-__v -createdAt -updatedAt");
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
        data: [],
        errors: ["Invalid hotel ID"],
      });
    }

    const menuQuery = Menu.find({ hotel: hotel._id }).select(
      "-__v -createdAt -updatedAt"
    );

    const apiFeatures = new ApiFeatures(menuQuery, req.query)
      .paginate()
      .filter()
      .sort();

    const filteredMenus = await apiFeatures.query.lean();

    return res.status(200).json({
      success: true,
      message: filteredMenus.length
        ? `${filteredMenus.length} menus found successfully`
        : "No menus found for this hotel",
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

export const getSingleMenuItem = async (req, res) => {
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

export const updateMenuItem = async (req, res) => {
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

export const deleteMenuItem = async (req, res) => {
  try {
    const { menuId, hotelId } = req.params;
    const deletedMenu = await Menu.findByIdAndDelete(menuId);
    if (!deletedMenu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
        data: [],
        errors: [],
      });
    }

    // Remove menu reference from hotel
    await Hotel.findByIdAndUpdate(hotelId, { $pull: { menus: menuId } });

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

export const favoriteMenuItem = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const favoriteMenus = await Menu.find({
      hotel: hotelId,
      rating: { $gte: 4 },
    }).select("-__v -createdAt -updatedAt");

    if (!favoriteMenus.length) {
      return res.status(404).json({
        success: false,
        message: "No favorite menus found for this hotel",
        data: [],
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Favorite menus retrieved successfully",
      data: favoriteMenus,
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
