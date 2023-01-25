const { Schema, model, default: mongoose } = require("mongoose");
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    uppercase: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = model("Category", categorySchema);
module.exports = Category;
