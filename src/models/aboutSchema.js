const { Schema, model } = require("mongoose");

const aboutSchema = new Schema({
  about: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      image: {
        type: Buffer,
        contentType: String,
        require: true,
      },
    },
  ],
});

const About = model("About", aboutSchema);
module.exports = About;
