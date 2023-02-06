const About = require("../models/aboutSchema");
const multer = require("multer");
const path = require("path");
class Controller {
  async createAbout(req, res) {
    try {
      const newAboutPost = await About.create({
        title: req.body.title,
        description: req.body.description,
        image: req.file.filename,
      });
      console.log(req.file);
      if (newAboutPost) {
        await newAboutPost.save();
        return res.status(200).json({
          success: true,
          message: newAboutPost,
        });
      } else
        return res.status(400).json({
          success: false,
          message: "error",
        });
    } catch (err) {
      console.log(err.message);
    }
  }
  async getAllAbout(req, res) {
    const aboutData = await About.find();
    console.log(aboutData);
    res.status(200).json({
      aboutData,
    });
  }
}
uploadImage = () => {
  const multerStorage = multer.diskStorage({
    destination: path.join(__dirname, "../public/aboutImages"),
    filename: (req, file, cb) => {
      const { fieldname, originalname } = file;
      const date = Date.now();
      const filename = `${fieldname}-${date}-${originalname}`;
      cb(null, filename);
    },
  });
  const upload = multer({ storage: multerStorage });
  return upload.single("image");
};

const AboutController = new Controller();
module.exports = { AboutController, uploadImage };
