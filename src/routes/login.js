var express = require("express");
var router = express.Router();
const LoginController = require("../controllers/login");
router.post("/login", LoginController.login);

module.exports = router;
