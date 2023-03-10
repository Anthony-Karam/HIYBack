const { S3Client, ListObjectsCommand } = require("@aws-sdk/client-s3");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
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
    this.getImageS3 = this.getImageS3.bind(this);
    this.listingVideo = this.listingVideo.bind(this);
  }

  multerS3UploadVideos() {
    const upload = multer({
      storage: multerS3({
        s3: this.s3,
        bucket: this.BUCKET,
        key: (req, file, cb) => {
          // console.log(file);
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

  async getImageS3(req, res) {
    const getObjectParams = new GetObjectCommand({
      Bucket: this.BUCKET,
      Key: `images/${req.params.filename}`,
    });
    try {
      const response = await this.s3.send(getObjectParams);
      res.set({
        "Content-Type": "image/png",
        "Content-Length": response.ContentLength,
      });
      response.Body.pipe(res);
    } catch (err) {
      console.log(err);
      return res.status(400).send("Error retrieving file from S3.");
    }
  }
  async s3Read(req, res) {
    const fileName = req.params.filename;
    const folderName = "videos";
    const key = `${folderName}/${fileName}`;

    const command = new GetObjectCommand({
      Bucket: this.BUCKET,
      Key: key,
    });

    try {
      const response = await this.s3.send(command);
      res.set({
        "Content-Type": "video/mp4",
        "Content-Length": response.ContentLength,
      });
      response.Body.pipe(res);
    } catch (err) {
      console.log(err);
      return res.status(400).send("Error retrieving file from S3.");
    }
  }

  async listingVideo(req, res) {
    const courses = req.params.courses;

    const params = {
      Bucket: this.BUCKET,
    };

    const command = new ListObjectsCommand(params);
    try {
      const data = await this.s3.send(command);
      const videoList = data.Contents.filter((obj) => {
        const videoName = obj.Key.split("/").pop();

        return (
          obj.Key.endsWith(".mp4") &&
          courses.includes(videoName.slice(0, videoName.lastIndexOf(".")))
        );
      });
      res.json(videoList);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error retrieving videos from S3" });
    }
  }
}

const S3Controller = new Controller();
module.exports = S3Controller;
