const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multer = require("multer");
const multerS3 = require("multer-s3");
require("dotenv").config();

class Controller {
  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.BUCKET = process.env.AWS_BUCKET || "hiy-videos";
    this.s3Read = this.s3Read.bind(this);
  }

  multerS3UploadVideos() {
    const upload = multer({
      storage: multerS3({
        s3: this.s3,
        bucket: this.BUCKET,
        key: (req, file, cb) => {
          console.log(file);
          cb(null, Date.now().toString() + "-" + file.originalname);
        },
      }),
    });
    return upload.single("video");
  }
  async s3Upload(req, res) {
    if (req.file.location) {
      res.send("Successfully uploaded " + req.file.location + " location!");
    } else return res.send("not successfully uploaded");
  }

  async s3Read(req, res) {
    const command = new GetObjectCommand({
      Bucket: this.BUCKET,
      Key: req.params.filename,
    });

    try {
      const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
      res.redirect(url);
    } catch (err) {
      console.log(err);
      return res.status(400).send("Error retrieving file from S3.");
    }
  }
}

const S3Controller = new Controller();
module.exports = S3Controller;
