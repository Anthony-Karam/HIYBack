var express = require("express");
var router = express.Router();
const LoginController = require("../controllers/logIn");
router.post("/login", LoginController.logIn);

module.exports = router;
