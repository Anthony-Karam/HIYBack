const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const { s3, BUCKET } = require("./s3");

const uploadFiles = () => {
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: BUCKET,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      // acl: "public-read",
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const { fieldname, originalname } = file;
        const date = Date.now();
        let key;
        if (fieldname === "image" || fieldname === "instructorImage") {
          // Upload images to 'images' folder
          key = `images/${fieldname}-${date}-${originalname}`;
        } else if (fieldname === "video") {
          // Upload video to 'videos' folder
          key = `videos/${date}-${originalname}`;
        }
        cb(null, key);
      },
    }),
  });

  return upload.fields([
    { name: "image", maxCount: 1 },
    { name: "instructorImage", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]);
};

module.exports = { uploadFiles };
