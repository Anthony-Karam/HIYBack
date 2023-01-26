const Category = require("../models/categorySchema");
const Course = require("../models/courseSchema");

class Controller {
  async createCourse(req, res) {
    try {
      const checkAvailability = await Course.findOne({ name: req.body.name });
      if (checkAvailability) {
        return res.status(200).json({
          sucess: true,
          message: "Select another name",
        });
      }
      const categoryId = await Category.findOne({ _id: req.body.category });
      if (!categoryId) {
        return res.status(404).json({
          success: false,
          message: "Category not available",
        });
      }
      const courseCreated = await Course.create({
        name: req.body.name,
        description: {
          skills: req.body.description.skills,
          about: req.body.description.about,
          whatToLearn: req.body.description.whatToLearn,
          instructor: {
            name: req.body.description.instructor.name,
            details: req.body.description.instructor.details,
          },
        },
        category: req.body.category,
      });
      await courseCreated.save();
      const updtCat = await Category.findById(categoryId);
      updtCat.coursesList.push(courseCreated._id);
      await updtCat.save();
      return res.status(200).json({
        success: true,
        message: courseCreated,
        updtCat,
      });
    } catch (err) {
      res.status(400).json({
        sucess: false,
        message: err.message,
      });
    }
  }

  async getAllCourses(req, res) {
    try {
      const getAllC = await Course.find({});
      if (getAllC.length == 0)
        return res.status(200).json({
          sucess: true,
          message: "No courses found",
        });
      else {
        res.status(200).json({
          sucess: true,
          message: getAllC,
        });
      }
    } catch (err) {
      res.status(400).json({
        sucess: false,
        message: err.message,
      });
    }
  }

  async getOneCourse(req, res) {
    const getOneCourse = await Course.findOne({ _id: req.params.id });
    if (!getOneCourse) {
      return res
        .status(404)
        .json({ success: false, message: "no course found with this id" });
    } else
      return res.status(200).json({ success: true, message: getOneCourse });
  }
  async updateCourse(req, res) {
    try {
      const updtCourse = await Course.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      );
      if (!updtCourse) {
        return res.status(500).json({
          success: false,
          message: "Unvalid input",
        });
      }
      return res.status(200).json(updtCourse);
    } catch (err) {
      return res.status(401).json({ message: err.message });
    }
  }
  async deleteCourse(req, res) {
    const delCourse = await Course.findByIdAndDelete({ _id: req.params.id });
    if (!delCourse) {
      return res
        .status(200)
        .json({ success: true, message: "no course found with this id" });
    } else
      return res.status(200).json({
        success: true,
        message: "Successfully deleted",
      });
  }
}

const CourseController = new Controller();
module.exports = CourseController;
