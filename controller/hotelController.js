import Hotel from "../models/hotelModel.js";
import Menu from "../models/menuModel.js";

export const createHotel = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const hotelData = {
      ...req.body,
      owner: ownerId,
    };
    const hotel = await Hotel.create(hotelData);
    const hotelList = {
      id: hotel._id,
      name: hotel.name,
      openingTime: hotel.openingTime,
      closingTime: hotel.closingTime,
      address: hotel.address,
      street: hotel.street,
      city: hotel.city,
      state: hotel.state,
      pin: hotel.pin,
      country: hotel.country,
      category: hotel.category,
      images: hotel.images,
      vacancy: hotel.vacancy,
      description: hotel.description,
      rating: hotel.rating,
      owner: hotel.owner,
    };
    return res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      hotel: hotelList,
      errors: [],
    });
  } catch (errors) {
    console.error("Hotel creation error:", errors);
    return res.status(500).json({
      success: false,
      error: "Server error",
      data: [],
      errors: [errors.message],
    });
  }
};

export const viewHotelDetails = async (req, res) => {
  try {
    const { id } = req.params; // hotel ID from URL
    const ownerId = req.user._id;
    // logged-in owner from auth middleware

    //  Find hotel by ID and ensure it belongs to this owner
    const hotel = await Hotel.findOne({ _id: id, owner: ownerId })
      .select("-__v -createdAt -updatedAt")
      .populate("menus") // optional
      .populate("owner", "name email"); // optional

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found or you are not authorized to view it",
        data: [],
        errors: [],
      });
    }

    const hotelData = {
      _id: hotel._id,
      name: hotel.name,
      openingTime: hotel.openingTime,
      closingTime: hotel.closingTime,
      address: hotel.address,
      street: hotel.street,
      city: hotel.city,
      state: hotel.state,
      pin: hotel.pin,
      country: hotel.country,
      category: hotel.category,
      images: hotel.images,
      vacancy: hotel.vacancy,
      description: hotel.description,
      rating: hotel.rating,
      owner: hotel.owner,
      menus: hotel.menus,
    };

    return res.status(200).json({
      success: true,
      message: "Hotel found successfully",
      data: hotelData,
      errors: [],
    });
  } catch (error) {
    console.error("View hotel details error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      errors: [error.message],
    });
  }
};

export const ViewAllHotels = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const hotels = await Hotel.find({ owner: ownerId }).select(
      "-__v -createdAt -updatedAt"
    );
    if (hotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No hotels found for this owner",
        data: [],
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: `${hotels.length} hotel(s) found for this owner`,
      data: hotels,
      errors: [],
    });
  } catch (error) {
    console.error("View all hotels error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      errors: [error.message],
    });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id; // ✅ comes from auth middleware

    // 1️⃣ Check if hotel exists and belongs to this owner
    const hotel = await Hotel.findOne({ _id: id, owner: ownerId });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found or you are not authorized to update it",
        data: [],
        errors: [],
      });
    }

    // 2️⃣ Perform update
    const updatedHotel = await Hotel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      select: "-__v -createdAt -updatedAt",
    });

    return res.status(200).json({
      success: true,
      message: "Hotel updated successfully",
      data: updatedHotel,
      errors: [],
    });
  } catch (error) {
    console.error("Hotel update error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      errors: [error.message],
    });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id;

    // 1️⃣ Check ownership
    const hotel = await Hotel.findOne({ _id: id, owner: ownerId });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found or unauthorized access",
        data: [],
        errors: [],
      });
    }

    // 2️⃣ Delete all menus associated with this hotel
    await Menu.deleteMany({ hotel: id });

    // 3️⃣ Delete the hotel
    await Hotel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Hotel and all associated menus deleted successfully",
      data: [],
      errors: [],
    });
  } catch (error) {
    console.error("Hotel delete error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
      errors: [error.message],
    });
  }
};
