const jwt = require("jsonwebtoken");
const Token = require("../models/tokenSchema");
const User = require("../models/user");
const { createVerificationToken } = require("../utils/jwt");
class Controller {
  //Verifies the accessT
  async authenticateToken(req, res, next) {
    try {
      const authHeader = await req.headers["authorization"];
      const accessT = authHeader.split(" ")[1].replace(/"/g, "");
      if (!accessT) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      const decoded = jwt.verify(accessT, process.env.JWT_SECRET);
      req.user = decoded.user;
      if (!decoded) {
        return res.status(401).json({ message: "Please log in to continue " });
      }
      next();
    } catch (err) {
      return res.status(403).json({ message: err });
    }
  }
  //Verifies refreshToken and generates a new accessT
  async authenticateRefreshToken(req, res) {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res.status(401).json({ message: "Invalid token" });
      }
      const [, refreshToken] = authHeader.split(" ");
      // verify the token's signature and check the expiration time
      console.log("2");

      const decodedR = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESHTOKEN_SECRET
      );
      console.log("3");

      //check if refreshToken exists in the db
      const token = await Token.findOne({
        refreshToken,
      });
      if (!token) {
        console.log("44");

        return res.status(404).json({ message: "Invalid refresh token" });
      }
      const accessT = token.accessT;

      jwt.verify(accessT, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
          if (err.message === "jwt expired") {
            const { _userId } = token;
            //check if the userId of the token is the same as the userId in users
            const user = await User.findById(_userId);
            if (!user) {
              return res.status(404).json({ message: "User not found" });
            }
            // check if the token's userId matches the user's id
            if (_userId.toString() !== decodedR.userId) {
              return res.status(401).json({ message: "Invalid token" });
            }

            //generates a new accessT
            const accessT = createVerificationToken(
              _userId,
              process.env.JWT_TIME_ACCESS
            );
            //Updates the old access token in tokens

            const updatedToken = await Token.findByIdAndUpdate(
              token._id,
              { accessT },
              { new: true }
            );
            if (!updatedToken) {
              return res.status(500).json({ message: "Error updating token" });
            }
            res.status(200).json({ accessT });
          }
        } else {
          return res.status(500).json({
            success: "false",
            message: "Access token stil valid ",
          });
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
const AuthController = new Controller();
module.exports = AuthController;
