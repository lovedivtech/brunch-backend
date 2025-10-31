import Hotel from "../models/hotelModel.js";
import Menu from "../models/menuModel.js";
import { ApiFeatures } from "../utils/apiFunctionality.js";

export const createMenuItem = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { id: hotelId } = req.params;

    // ✅ Ensure hotel belongs to the current owner
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

    // ✅ Create menu item
    const menu = await Menu.create({ ...req.body, hotel: hotel._id });

    // ✅ Add menu reference in hotel document
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

export const getAllMenuItem = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { id: hotelId } = req.params;

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

export const getSingleMenuItem = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { id } = req.params;

    const menu = await Menu.findById(id)
      .populate("hotel", "owner name")
      .select("-__v -createdAt -updatedAt");

    if (!menu || menu.hotel.owner.toString() !== ownerId.toString()) {
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

export const updateMenuItem = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { id } = req.params;

    const menu = await Menu.findById(id).populate("hotel", "owner");
    if (!menu || menu.hotel.owner.toString() !== ownerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this menu",
        data: [],
        errors: [],
      });
    }

    const updatedMenu = await Menu.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      select: "-__v -createdAt -updatedAt",
    });

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

    // Remove menu reference from hotel
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

export const favoriteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id;

    const hotel = await Hotel.findOne({ _id: id, owner: ownerId });
    console.log("Hotel found:", hotel);

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
