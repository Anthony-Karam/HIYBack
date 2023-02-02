var express = require("express");
var router = express.Router();
const multer = require("multer");
const aboutController = require("../controllers/about");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadImage = upload.single("image");

router.post("/create", uploadImage, aboutController.createAbout);

router.get("/get", aboutController.getAllAbout);
module.exports = router;
