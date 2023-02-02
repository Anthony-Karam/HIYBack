const { Schema, model } = require("mongoose");
const Course = require("./courseSchema");
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    uppercase: true,
  },
  coursesList: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

categorySchema.pre("findOne", function () {
  this.populate({
    path: "coursesList",
    select: "name",
  });
});
categorySchema.pre("find", function () {
  this.populate({
    path: "coursesList",
    select: "name",
  });
});
// categorySchema.pre("findOneAndDelete", async function (next) {
//   const categoryId = this._id;
//   console.log(categoryId);
//   await Course.deleteMany({ category: categoryId });
//   next();
// });
const Category = model("Category", categorySchema);
module.exports = Category;
