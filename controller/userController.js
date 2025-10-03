import { ValidationError } from "yup";
import User from "../models/userModel.js";
import {
  decodeToken,
  JWTToken,
  JWTSignVerifyUserData,
} from "../utils/jwtToken.js";
import {
  ramdomUserName,
  generateHashPassword,
  compareHashPassword,
  randomeCryptoToken,
  verifyCryptoToken,
} from "../utils/services.js";

import sendEmail from "../config/sendEmail.js";

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
      licences,
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
      licences,
      gstNo,
    });
    const userData = await JWTSignVerifyUserData(user);
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
    const Link = `https://localhost:8000/api/v2/user/reset-password/${resetTokenData}`;
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
        message: "Invalid or expired token",
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
      message: `resetPsssword Error 💥`,
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
