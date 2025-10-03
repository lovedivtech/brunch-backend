import crypto from "crypto";

import bcrypt from "bcrypt";

///////////////////  GENERATE HASH PASSWORD  ////////////////////////
export const generateHashPassword = async function (PWD) {
  const hashPWD = await bcrypt.hash(PWD, 10);
  return hashPWD;
};

///////////////////  COMPARE HASH PASSWORD  ////////////////////////
export const compareHashPassword = async function (PWD, hashPWD) {
  const PWDMatch = await bcrypt.compare(PWD, hashPWD);
  return PWDMatch;
};

///////////////////  generate random username  ////////////////////////
export const ramdomUserName = async function (firstName, lastName) {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const symbols = ["!", "@", "#", "$", "%", "&", "*", "_"];

  const getRandomSymbol = () =>
    symbols[Math.floor(Math.random() * symbols.length)];

  const username = `${firstName.toLowerCase()}${getRandomSymbol()}${lastName.toLowerCase()}${randomNum}`;
  return username;
};

////////////////////// generate HASHCODE FOR FORGOT PASSWORD //////////////////////////////////////////
export const randomeCryptoToken = async function (user) {
  const resetToken = crypto.randomBytes(16).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

////////////////////// generate HASHCODE FOR reset PASSWORD //////////////////////////////////////////
export const verifyCryptoToken = async function (params) {
  const hashedToken = crypto.createHash("sha256").update(params).digest("hex");

  return hashedToken;
};
