import Hotel from "../models/hotelModel.js";
export const createHotel = async (req, res) => {
  try {
    const { hotelData } = req.body;
    hotelData.ownerId = req.user._id;
    const hotel = await Hotel.create(hotelData);

    return res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      hotel,
      errors: [],
    });
  } catch (error) {
    console.error("Hotel creation error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      data: [],
      error: [error.message],
    });
  }
};

export const viewHotelDetails = async (req, res) => {
  try {
    const hotel = await Hotel.find().select("-__v -createdAt -updatedAt");

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
        data: [],
        errors: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Hotel Find successfully",
      hotel,
      errors: [],
    });
  } catch (error) {
    console.error("Hotel creation error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      data: [],
      error: [error.message],
    });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const hotelData = req.body;
    hotelData.ownerId = await req.user._id;
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, hotelData, {
      new: true,
      select: "-__v -createdAt -updatedAt",
    });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
        data: [],
        errors: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Hotel updated successfully",
      hotel,
      errors: [],
    });
  } catch (error) {
    console.error("Hotel update error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      data: [],
      error: [error.message],
    });
  }
};
