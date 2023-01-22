const jwt = require("jsonwebtoken");

class Controller {
  async authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    console.log("authHeader", authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    console.log("token", token);

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
}
const AuthController = new Controller();
module.exports = AuthController;
