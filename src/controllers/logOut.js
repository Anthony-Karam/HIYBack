const Token = require("../models/tokenSchema");

class Controller {
  async logOut(req, res) {
    try {
      const _userId = req.params._userId;
      await Token.deleteOne({ _userId });
      res
        .status(200)
        .json({ sucess: "true", message: "User logged out successfully" });
    } catch (err) {
      return res.status(500).json({ sucess: false, message: err });
    }
  }
}
const logOutController = new Controller();
module.exports = logOutController;
