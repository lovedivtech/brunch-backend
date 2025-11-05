import Hotel from "../models/hotelModel.js";
import Menu from "../models/menuModel.js";
import { ApiFeatures } from "../utils/apiFunctionality.js";

// ✅ CREATE MENU ITEM
export const createMenuItem = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { hotelId } = req.params;

    const hotel = await Hotel.findOne({ _id: hotelId, owner: ownerId }).select(
      "-__v -createdAt -updatedAt"
    );
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found or unauthorized access",
        data: [],
        errors: ["You can only create menus for your own hotels"],
      });
    }

    const menu = await Menu.create({ ...req.body, hotel: hotel._id });
    hotel.menus.push(menu._id);
    await hotel.save();

    return res.status(201).json({
      success: true,
      message: "Menu created successfully",
      data: menu,
      errors: [],
    });
  } catch (error) {
    console.error("Menu creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      errors: [error.message],
    });
  }
};

// ✅ GET ALL MENUS FOR A HOTEL
export const getAllMenuItem = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { hotelId } = req.params;

    const hotel = await Hotel.findOne({ _id: hotelId, owner: ownerId }).select(
      "_id"
    );
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found or unauthorized",
        data: [],
        errors: [],
      });
    }

    const menuQuery = Menu.find({ hotel: hotel._id }).select(
      "-__v -createdAt -updatedAt"
    );
    const apiFeatures = new ApiFeatures(menuQuery, req.query)
      .paginate()
      .filter()
      .sort();
    const menus = await apiFeatures.query.lean();

    return res.status(200).json({
      success: true,
      message: menus.length
        ? `${menus.length} menu(s) found for your hotel`
        : "No menus found for this hotel",
      data: menus,
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

// ✅ GET SINGLE MENU ITEM
export const getSingleMenuItem = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { menuId } = req.params;

    const menu = await Menu.findById(menuId)
      .populate("hotel", "owner name")
      .select("-__v -createdAt -updatedAt");

    if (
      !menu ||
      !menu.hotel ||
      menu.hotel.owner.toString() !== ownerId.toString()
    ) {
      return res.status(404).json({
        success: false,
        message: "Menu not found or unauthorized access",
        data: [],
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu retrieved successfully",
      data: menu,
      errors: [],
    });
  } catch (error) {
    console.error("Menu retrieval error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      errors: [error.message],
    });
  }
};

// ✅ UPDATE MENU ITEM
export const updateMenuItem = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { menuId } = req.params;

    const menu = await Menu.findById(menuId).populate("hotel", "owner");
    if (
      !menu ||
      !menu.hotel ||
      menu.hotel.owner.toString() !== ownerId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this menu",
        data: [],
        errors: [],
      });
    }

    const updatedMenu = await Menu.findByIdAndUpdate(menuId, req.body, {
      new: true,
      runValidators: true,
    }).select("-__v -createdAt -updatedAt");

    return res.status(200).json({
      success: true,
      message: "Menu updated successfully",
      data: updatedMenu,
      errors: [],
    });
  } catch (error) {
    console.error("Menu update error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      errors: [error.message],
    });
  }
};

// ✅ DELETE MENU ITEM
export const deleteMenuItem = async (req, res) => {
  try {
    const { menuId, hotelId } = req.params;
    const ownerId = req.user._id;

    const hotel = await Hotel.findOne({ _id: hotelId, owner: ownerId });
    if (!hotel) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access — this hotel does not belong to you",
        data: [],
        errors: [],
      });
    }

    const deletedMenu = await Menu.findOneAndDelete({
      _id: menuId,
      hotel: hotel._id,
    });
    if (!deletedMenu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
        data: [],
        errors: [],
      });
    }

    await Hotel.findByIdAndUpdate(hotelId, { $pull: { menus: menuId } });

    return res.status(200).json({
      success: true,
      message: "Menu deleted successfully",
      data: [],
      errors: [],
    });
  } catch (error) {
    console.error("Menu delete error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      errors: [error.message],
    });
  }
};

// ✅ GET FAVORITE MENUS
export const favoriteMenuItem = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const ownerId = req.user._id;

    const hotel = await Hotel.findOne({ _id: hotelId, owner: ownerId });
    if (!hotel) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access — you cannot view this hotel's favorites",
        data: [],
        errors: [],
      });
    }

    const favoriteMenus = await Menu.find({
      hotel: hotel._id,
      rating: { $gte: 4 },
    }).select("-__v -createdAt -updatedAt");

    if (favoriteMenus.length === 0) {
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
  } catch (error) {
    console.error("Favorite menu retrieval error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      errors: [error.message],
    });
  }
};

// ✅ GET ALL MENUS FOR ALL HOTELS OWNED BY OWNER
export const getAllMenuOfMyHotel = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const hotels = await Hotel.find({ owner: ownerId }).select("_id name");

    const hotelIds = hotels.map((h) => h._id);

    const baseQuery = Menu.find({
      hotel: { $in: hotelIds },
    }).populate({ path: "hotel", select: "name" });

    const features = new ApiFeatures(baseQuery, req.query)
      .filter()
      .sort()
      .paginate();

    const menus = await features.query;

    if (menus.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No menus found for this owner",
        data: [],
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menus retrieved successfully",
      data: menus.map((menu) => ({
        _id: menu._id,
        name: menu.name,
        price: menu.price,
        type: menu.type,
        category: menu.category,
        hotelName: menu.hotel?.name || "Unknown",
      })),
      errors: [],
    });
  } catch (error) {
    console.error("Get all menu of my hotel error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      errors: [error.message],
    });
  }
};
