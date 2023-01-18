const { default: mongoose } = require("mongoose");
const User = require("../models/user");

class Controller {
  async getAll(req, res) {
    const users = await User.find();
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
    const user = await User.findOne({ userName: req.body.userName });
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
    try {
      console.log("1");

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

            return res.status(200).json({
              success: true,
              user: newUser,
            });
          }
          console.log("3");
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
}

const UserController = new Controller();
module.exports = UserController;
