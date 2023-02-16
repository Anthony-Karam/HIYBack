const Category = require("../models/categorySchema");
const Course = require("../models/courseSchema");
// const path = require("path");

// const multer = require("multer");
// const multerS3 = require("multer-s3");
// require("dotenv").config();
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
      const categoryId = await Category.findById(req.body.category);
      if (!categoryId) {
        return res.status(404).json({
          success: false,
          message: "Category not available",
        });
      }
      // let image = "";
      // let instructorImage = "";
      // if (req.files && req.files.length > 0) {
      //   image = req.files[0].filename;
      //   instructorImage = req.files[1].filename;
      // }
      const image = req.files.image[0].location;
      const instructorImage = req.files.instructorImage[0].location;
      const video = req.files.video[0].location;
      const courseCreated = await Course.create({
        name: req.body.name,
        image,
        instructorImage,
        description: {
          skills: req.body.description.skills,
          about: req.body.description.about,
          whatToLearn: req.body.description.whatToLearn,
          instructorName: req.body.description.instructorName,
          instructorDetails: req.body.description.instructorDetails,
        },

        video,
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
      //find the course
      const course = await Course.findById(req.params.id);
      if (!course)
        return res.status(200).json({
          success: true,
          message: "No course found with this id ",
        });
      //find the category and remove the course from the coursList
      await Category.findByIdAndUpdate(course.category, {
        $pull: { coursesList: course._id },
      });
      course.category = req.body.category;
      console.log(course.category);
      const categoryCheck = await Category.findByIdAndUpdate(course.category, {
        $push: { coursesList: course._id },
      });
      if (!categoryCheck) {
        return res
          .status(400)
          .json({ success: false, message: "Category not available" });
      }

      await course.save();
      res.status(200).json({ message: "Course updated successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
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

module.exports = { CourseController: new Controller() };
