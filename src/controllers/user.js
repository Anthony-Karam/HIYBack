const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { createVerificationToken } = require("../utils/jwt");
const sendEmail = require("../utils/sendEmail");
// const crypto = require("crypto");
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
    console.log("delete");
    User.findOneAndDelete({ userName: req.params.userName }, (err, user) => {
      if (err) return res.status(404).json({ success: false, message: err });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "No user Found " });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "User deleted Successfully " });
      }
    });
  }
  async createUser(req, res) {
    try {
      User.findOne(
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
            const t = "48h";
            const token = createVerificationToken(newUser._id, t);
            sendEmail(newUser.emailAddress, token, newUser.userName);
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
  async verifyUser(req, res) {
    try {
      const { _id } = jwt.verify(req.params.token, process.env.JWT_SECRET);
      (err, user) => {
        if (err)
          return res.status(500).json({
            success: false,
            message: "Unvalid input",
          });

        return res.send(user);
      };

      User.findByIdAndUpdate(
        { _id },
        { verified: true },
        { new: true },
        async (err, user) => {
          if (err) {
            return res
              .status(404)
              .json({ success: false, message: "No user found" });
          }
          res.json({ success: true, message: "Verification successful" });
        }
      );
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  }
}

const UserController = new Controller();
module.exports = UserController;
