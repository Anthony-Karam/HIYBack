const jwt = require("jsonwebtoken");
const Token = require("../models/tokenSchema");
// create a JWT with the user's email address and a unique token
const createVerificationToken = (_id, exp) => {
  const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: exp,
  });
  return token;
};

const createTokenAndRefreshToken = async (user_id) => {
  console.log(process.env.JWT_TIME_ACCESS, process.env.JWT_TIME_REFRESH);
  const accessToken = jwt.sign({ userId: user_id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TIME_ACCESS,
  });
  const refreshToken = jwt.sign(
    { userId: user_id },
    process.env.JWT_REFRESHTOKEN_SECRET,
    { expiresIn: process.env.JWT_TIME_REFRESH }
  );
  const token = await Token.create({
    _userId: user_id,
    accessToken,
    refreshToken,
  });
  if (!token) return "token not valid ";

  return token;
};
module.exports = { createVerificationToken, createTokenAndRefreshToken };
