const { Schema, model, default: mongoose } = require("mongoose");

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    // required: true,
  },
  instructorImage: {
    type: String,
    // required: true,
  },

  description: {
    skills: [
      {
        type: String,
        required: true,
      },
    ],
    about: {
      type: String,
      required: true,
    },
    whatToLearn: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
    },

    instructorDetails: [
      {
        type: String,
        required: true,
      },
    ],
  },
  video: {
    type: String,
    // required: true,
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Course = model("Course", courseSchema);
module.exports = Course;
