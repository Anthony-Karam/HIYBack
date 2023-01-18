const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const emailValidation = require("../utils/verificationCode");
const jwt = require("jsonwebtoken");
const Token = require("../models/token");
const crypto = require("crypto");
class Controller {
  async getAll(req, res) {
    const users = await User.find({});
    console.log(users);
    if (users.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No users in the db ",
      });
    } else
      return res.status(200).json({
        success: true,
        message: users,
      });
  }

  async getOneUser(req, res) {
    const user = await User.findOne({ userName: req.params.userName });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found",
      });
    } else
      return res.status(200).json({
        success: true,
        message: user,
      });
  }
  async createUser(req, res) {
    console.log("1");

    try {
      await User.findOne(
        {
          $or: [
            { userName: req.body.userName },
            { emailAddress: req.body.emailAddress },
            { phoneNumber: req.body.phoneNumber },
          ],
        },
        async (err, user) => {
          if (err) {
            console.log(err);
          }
          if (user == null) {
            console.log("2");
            const newUser = new User({
              _id: mongoose.Types.ObjectId(),
              userName: req.body.userName,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              emailAddress: req.body.emailAddress,
              password: req.body.password,
              phoneNumber: req.body.phoneNumber,
              address: req.body.address,
            });
            await newUser.save();
            let token = await new Token({
              userId: newUser._id,
              token: crypto.randomBytes(32).toString("hex"),
            }).save();
            const message = `http://localhost:3000/users/verify/${newUser.id}/${token.token}`;
            emailValidation(newUser.emailAddress, "Verify Email", message);
            res.send("An Email sent to your account please verify");
            return res.status(200).json({
              success: true,
              user: newUser,
            });
          }
          if (user.userName === req.body.userName) {
            return res.status(400).json({
              success: false,
              message: "Please enter a valid User Name",
            });
          }
          if (user.emailAddress === req.body.emailAddress) {
            console.log("4");
            return res.status(400).json({
              success: false,
              message: "Please enter a valid Email address",
            });
          }
          if (user.phoneNumber === req.body.userName) console.log("5");
          {
            return res.status(400).json({
              success: false,
              message: "Please enter a valid Phone number",
            });
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
  async updateUser(req, res) {
    User.findOneAndUpdate(
      { userName: req.params.userName },
      { $set: req.body },
      { new: true },
      (err, user) => {
        if (err)
          return res.status(500).json({
            success: false,
            message: "Unvalid input",
          });

        return res.send(user);
      }
    );
  }
  async deleteUser(req, res) {
    User.findOneAndDelete({ userName: req.params.userName }, (err, user) => {
      if (err) return res.status(404).json({ success: false, message: err });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "No user found" });
      } else {
        return res
          .status(200)
          .json({ success: false, message: "User deleted Successfully " });
      }
    });
  }
  async verifyUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user) return res.status(400).send("Invalid link");

      const token = await Token.findOne({
        userId: user._id,
        token: req.params.token,
      });
      if (!token) return res.status(400).send("Invalid link");

      await User.updateOne({ _id: user._id, verified: true });
      await Token.findByIdAndRemove(token._id);

      res.send("email verified sucessfully");
    } catch (error) {
      res.status(400).send("An error occured");
    }
  }
}

const UserController = new Controller();
module.exports = UserController;
