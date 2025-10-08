import Hotel from "../models/hotelModel.js";

export const createHotel = async (req, res) => {
  try {
    const hotelData = { ...req.body };
    const hotel = await Hotel.create(hotelData);
    const hotelList = {
      id: hotel._id,
      name: hotel.hotelName,
      openingTime: hotel.openingTime,
      closingTime: hotel.closingTime,
      address: hotel.address,
      street: hotel.street,
      city: hotel.city,
      state: hotel.state,
      pin: hotel.pin,
      country: hotel.country,
      category: hotel.category,
      image_url: hotel.image_url,
      vacancy: hotel.vacancy,
      description: hotel.description,
      rating: hotel.rating,
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
