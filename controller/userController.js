import User from "../models/userModel.js";
import Hotel from "../models/hotelModel.js";
import Menu from "../models/menuModel.js";
import { JWTSignVerifyUserData } from "../utils/jwtToken.js";
import {
  ramdomUserName,
  generateHashPassword,
  compareHashPassword,
  randomeCryptoToken,
  verifyCryptoToken,
} from "../utils/services.js";

import sendEmail from "../config/sendEmail.js";
import { ApiFeatures } from "../utils/apiFunctionality.js";

/////////////////////  1️⃣ SIGNUP USER  ////////////////////////////////////

export const signUp = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNo,
      role,
      license,
      gstNo,
    } = req.body;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: await generateHashPassword(password),
      phoneNo,
      role,
      username: await ramdomUserName(firstName, lastName),
      license,
      gstNo,
    });
    const userData = await JWTSignVerifyUserData(user);
    await sendEmail({
      to: user.email,
      subject: `Successfully created Username.😚`,
      text: `You are successfully registered on Brunch App.\n\nYour Username is: ${user.username}\n\nKeep it safe!`,
    });
    res.status(201).json({
      success: true,
      user: userData,
      message: `User Created Successfully`,
      errors: [],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      user: [],
      messages: `Signup Error!,Try Again 😢 `,
      errors: [error],
    });
  }
};

/////////////////////  2️⃣ LOGIN USER  ////////////////////////////////////
export const logIn = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    }).select("+password");
    const Match = await compareHashPassword(password, user.password);
    if (!Match) {
      return res.status(403).send({
        success: false,
        user: [],
        message: "Password Invalid!🙀",
        errors: [],
      });
    }
    const userData = await JWTSignVerifyUserData(user);

    return res.status(200).json({
      success: true,
      user: userData,
      message: `User Login Successfully`,
      errors: [],
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      user: [],
      messages: `Login Error!, Unauthorized 💥 `,
      errors: [error.message],
    });
  }
};

/////////////////////  3️⃣ FORGOT PASSWORD REQUEST  ////////////////////////////////////
export const forgotPWD = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    const resetTokenData = (await randomeCryptoToken(user)).toString();
    const Link = `http://localhost:5173/reset-password/${resetTokenData}`;
    const message = `Your Rquested Url Is Here.\n\n${Link}\n\nThis Link Will Expired In 10 Minutes.`;

    await sendEmail({
      to: user.email,
      subject: `Reset Password Request 😚`,
      text: message,
    });

    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
      data: [user.email],
      error: [],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `forgotPsssword Error 💥`,
      error: [],
      data: [],
    });
  }
};

/////////////////////  4️⃣ reset PASSWORD   ////////////////////////////////////
export const resetPWD = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;
    const params = req.params.token;
    const token = await verifyCryptoToken(params);
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Or Expired Reset-Token",
        errors: [],
        user: [],
      });
    }
    user.password = await generateHashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `password Reset Successfully`,
      user: user,
      error: [],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Reset-Passsword Error 💥`,
      error: [],
      data: [],
    });
  }
};

/////////////////////  4️⃣ Update PASSWORD   ////////////////////////////////////
export const updatePWD = async (req, res, next) => {
  try {
    const { oldPassword, password, confirmPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    const isMatch = await compareHashPassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
        error: [],
        data: [],
      });
    }
    user.password = await generateHashPassword(password);
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
      success: true,
      message: `password Updated Successfully`,
      user: [user._id, user.username, user.email],
      error: [],
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `resetPsssword Error 💥`,
      error: [],
      data: [],
    });
  }
};

// TODO  /////////////////////  5️⃣ GET USER PROFILE   ////////////////////////////////////
export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
        error: [],
        data: [],
      });
    }
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNo: user.phoneNo,
      username: user.username,
      role: user.role,
      license: user.license,
      gstNo: user.gstNo,
    };

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: userData,
      error: [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: [error.message],
      data: [],
    });
  }
};

// TODO  /////////////////////  6️⃣ UPDATE USER PROFILE   ////////////////////////////////////
export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, email, phoneNo } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        email,
        phoneNo,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
        error: [],
        data: [],
      });
    }
    const userData = await JWTSignVerifyUserData(user);
    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNo: userData.phoneNo,
        username: userData.username,
        role: userData.role,
        token: userData.token,
        license: userData.license,
        gstNo: userData.gstNo,
      },
      error: [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: [error.message],
      data: [],
    });
  }
};

export const userViewAllHotels = async (req, res, next) => {
  try {
    const baseQuery = Hotel.find({}).select("-__v -createdAt -updatedAt");
    if (!baseQuery) {
      return res.status(404).json({
        success: false,
        message: "Hotels Are Not Available 🙇🏻🙇🏻‍♀️",
        data: [],
        errors: [],
      });
    }

    const features = new ApiFeatures(baseQuery, req.query)
      .filter()
      .sort()
      .paginate();

    const hotels = await features.query;
    if (hotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hotels Are Not Found 🙇🏻🙇🏻‍♀️",
        data: [],
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: `(${hotels.length}) Hotels fetched successfully`,
      data: hotels,
      error: [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: [error.message],
      data: [],
    });
  }
};

export const userViewHotelMenu = async (req, res, next) => {
  try {
    const id = req.params.id;
    const hotel = Hotel.find({ _id: id }).select("-__v -createdAt -updatedAt");
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotels Are Not found 💥",
        data: [],
        errors: [],
      });
    }

    const baseQuery = Menu.find({ hotel: id }).select(
      "-__v -createdAt -updatedAt"
    );
    if (!baseQuery) {
      return res.status(404).json({
        success: false,
        message: "Menu Not Available 🙇🏻🙇🏻‍♀️",
        data: [],
        errors: [],
      });
    }
    const features = new ApiFeatures(baseQuery, req.query)
      .filter()
      .sort()
      .paginate();

    const menus = await features.query;
    if (menus.length === 0) {
      return res.status(404).json({
        success: false,
        message: "menuItems Are Not Found 🙇🏻🙇🏻‍♀️",
        data: [],
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: `(${menus.length}) MenuItems fetched successfully`,
      data: menus,
      error: [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: [error.message],
      data: [],
    });
  }
};
// 69085c2f298f5adaba7983b4
// 69085c26298f5adaba7983af
// 69085bdf298f5adaba7983a6
