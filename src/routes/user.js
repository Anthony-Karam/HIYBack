var express = require("express");
var router = express.Router();
const UserController = require("../controllers/user");

router.post("/register", UserController.createUser);
router.get("/:userName", UserController.getOneUser);
router.get("/", UserController.getAll);
router.put("/:userName", UserController.updateUser);
router.delete("/:userName", UserController.deleteUser);

// router.put("/:id", auth, userController.updateProfile);

module.exports = router;
