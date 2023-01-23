const jwt = require("jsonwebtoken");
const Token = require("../models/tokenSchema");
const User = require("../models/user");
class Controller {
  async authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res
        .status("401")
        .json({ success: "false", message: "No token sent" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status("403").json({
          success: "false",
          message: "No access",
        });
      }
      req.user = user;
      console.log("user", user);
      next();
    });
  }

  async authemticateRefreshToken(req, res) {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res.status(401).json({ message: "Invalid token" });
      }
      const [, refreshToken] = authHeader.split(" ");

      // verify the token's signature and check the expiration time
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESHTOKE_SECRET
      );
      if (!decoded) {
        // if the token is invalid, return an error
        return res.status(401).json({ message: "Invalid token" });
      }

      // check if the userId exists in the token payload
      if (!decoded.userId) {
        return res.status(401).json({ message: "Invalid token" });
      }
      const token = await Token.findOne({ refreshToken });
      if (!token) {
        return res.status(404).json({ message: "Invalid refresh token" });
      }
      const { _userId } = token;
      const user = await User.findById(_userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // check if the token's userId matches the user's id
      if (_userId.toString() !== decoded.userId) {
        return res.status(401).json({ message: "Invalid token" });
      }
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      const updatedToken = await Token.findByIdAndUpdate(
        token._id,
        { accessToken },
        { new: true }
      );
      if (!updatedToken) {
        return res.status(500).json({ message: "Error updating token" });
      }
      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
const AuthController = new Controller();
module.exports = AuthController;
