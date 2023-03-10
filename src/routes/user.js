var express = require("express");
var router = express.Router();
const UserController = require("../controllers/user");
const AuthController = require("../controllers/authenticate");

router.post("/register", UserController.createUser);
router.get(
  "/:id",
  // AuthController.authenticateToken,
  UserController.getOneUser
);
router.get("/", AuthController.authenticateToken, UserController.getAll);
router.post("/refresh-token", AuthController.authenticateRefreshToken);
router.get("/verify/:token", UserController.verifyUser);

router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
