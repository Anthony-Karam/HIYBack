const multer = require("multer");
const path = require("path");
const uploadIage = () => {
  const multerStorage = multer.diskStorage({
    destination: path.join(__dirname, "../public/images"),
    filename: (req, file, cb) => {
      const { fieldname, originalname } = file;
      const date = Date.now();
      const filename = `${fieldname}-${date}-${originalname}`;
      cb(null, filename);
    },
  });
  const upload = multer({ storage: multerStorage });
  // const uploadImage =
  return upload.array("images", 2);
};

module.exports = uploadIage;
