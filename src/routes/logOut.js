var express = require("express");
var router = express.Router();
const LogOutController = require("../controllers/logOut");
router.delete("/logout/:_userId", LogOutController.logOut);

module.exports = router;
