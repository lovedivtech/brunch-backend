import jwt from "jsonwebtoken";

///////////////////  GENERATE JWT TOKEN  ////////////////////////
export const JWTToken = async function (payload, secret, option) {
  const token = jwt.sign(payload, secret, option);
  return token;
};

///////////////////  decode JWT TOKEN  ////////////////////////
export const decodeToken = async function (token, secret) {
  try {
    const decodedToken = jwt.verify(token, secret);
    // const userId = decode._id;
    const nowInSeconds = Math.floor(Date.now() / 1000); // c

    if (decodedToken.exp && decodedToken.exp < nowInSeconds) {
      return { error: "Token has expired" };
    }

    return decodedToken;
  } catch (error) {
    return `${error} - DecodeToken Fucntion Error`;
  }
};

/////////////////////////////////////////// FOR SIGNUP AND LOGIN //////////////////////////////////////////////////////////////////////
export const JWTSignVerifyUserData = async function (user) {
  try {
    const token = await JWTToken(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    const decodeData = await decodeToken(token, process.env.JWT_SECRET);

    return {
      id: user._id,
      token: token,
      tokenExpire: decodeData.exp,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.username,
      email: user.email,
      phoneNo: user.phoneNo,
      role: user.role,
      licences: user.licences,
      gstNo: user.gstNo,
    };
  } catch (error) {
    throw new Error("Failed to generate user token");
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
      error: [error],
      data: [],
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      username: decoded.username,
    };

    next();
  } catch (error) {
    console.error("JWT Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: [error],
      data: [],
    });
  }
};
