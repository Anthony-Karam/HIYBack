var express = require("express");
var router = express.Router();
const UserController = require("../controllers/user");

router.post("/register", UserController.createUser);
router.get("/", UserController.getOneUser);
router.get("/all", UserController.getAll);

// router.put("/:id", auth, userController.updateProfile);

module.exports = router;
