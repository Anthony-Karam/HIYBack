const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const createVerificationToken = require("../utils/jwt");

class Controller {
  async login(req, res) {
    try {
      let userNameField = req.body.userName;

      let emailAddress = req.body.emailAddress;
      let loginPassword = req.body.password;
      if ((!emailAddress || !userNameField) && !loginPassword) {
        console.log("1");

        return res.json({
          success: false,
          message: "Please enter your User Name/Email address or password ",
        });
      }
      const user = await User.findOne({
        $or: [
          { userName: req.body.userName },
          { emailAddress: req.body.emailAddress },
        ],
      });
      if (!user) {
        console.log("2");
        return res.json({
          success: false,
          message: "PLease enter a valid User name or Email address",
        });
      }
      if (user) {
        console.log("3");
        let match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
          return res.json({
            sucess: false,
            message: "Wrong Email or Password",
          });
        }
        if (match && user.verified != true) {
          console.log("4");
          return res.json({
            success: false,
            message: "Please verify your Email address",
          });
        } else {
          console.log("5");
          const token = createVerificationToken(user._id, "5h");
          return res.json({
            accesstoken: token,
            success: true,
            message: "logged in",
          });
        }
      }
    } catch (err) {
      res.json({
        success: false,
        message: console.log(err),
      });
    }
  }
}
const LoginController = new Controller();
module.exports = LoginController;
