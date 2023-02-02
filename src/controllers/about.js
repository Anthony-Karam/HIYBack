const About = require("../models/aboutSchema");

class Controller {
  async createAbout(req, res) {
    const newAbout = new About({
      about: [
        {
          title: req.body.title,
          description: req.body.description,
          image: req.file.buffer,
        },
      ],
    });

    await newAbout
      .save()
      .then(() => res.json(newAbout))
      .catch((err) => res.status(400).json("Error: " + err));
  }
  async getAllAbout(req, res) {
    const getall = await About.find();
    res.send(getall);
  }
}

const aboutController = new Controller();
module.exports = aboutController;
