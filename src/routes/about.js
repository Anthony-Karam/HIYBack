var express = require("express");
var router = express.Router();

const AboutController = require("../controllers/about");

router.post(
  "/",
  AboutController.uploadImage(),
  AboutController.AboutController.createAbout
);
router.get("/", AboutController.AboutController.getAllAbout);
module.exports = router;
