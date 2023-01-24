var express = require("express");
var router = express.Router();
const UserController = require("../controllers/user");
const AuthController = require("../controllers/authenticate");
router.post("/register", UserController.createUser);
router.get("/:userName", UserController.getOneUser);
router.get("/", AuthController.authenticateToken, UserController.getAll);
router.post("/refresh-token", AuthController.authenticateRefreshToken);
router.get("/verify/:token", UserController.verifyUser);

router.put("/:userName", UserController.updateUser);
router.delete("/:userName", UserController.deleteUser);

module.exports = router;
