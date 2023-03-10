const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  createVerificationToken,
  createTokenAndRefreshToken,
} = require("../utils/jwt");

class Controller {
  async logIn(req, res) {
    try {
      const { userName, emailAddress, password } = req.body;

      if ((!emailAddress || !userName) && !password) {
        return res.status(404).json({
          success: false,
          message: "Please enter your User Name/Email address or password ",
        });
      }
      const user = await User.findOne({
        $or: [{ userName: userName }, { emailAddress: emailAddress }],
      });
      console.log(user);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "PLease enter a valid User name or Email address",
        });
      }

      let match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return res.status(404).json({
          sucess: false,
          message: "Wrong Email or Password",
        });
      }
      if (match && !user.verified) {
        return res.status(404).json({
          success: false,
          message: "Please verify your Email address",
        });
      }
      let userId = user._id;
      const token = await createTokenAndRefreshToken(userId);
      res.send({
        success: true,
        message: "Logged in",
        token,
        user,
      });
    } catch (err) {
      console.error(err.message);
      res.json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
}
const LoginController = new Controller();
module.exports = LoginController;
