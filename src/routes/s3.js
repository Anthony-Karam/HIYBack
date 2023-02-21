var express = require("express");
var router = express.Router();
const S3Controller = require("../controllers/s3");
router.post(
  "/upload",
  S3Controller.multerS3UploadVideos(),
  S3Controller.s3Upload
);
router.get("/videos/:filename", S3Controller.s3Read);
router.get("/images/:filename", S3Controller.getImageS3);
router.get("/videosList/:courses", S3Controller.listingVideo);

module.exports = router;
