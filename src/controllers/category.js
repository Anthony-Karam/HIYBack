const Category = require("../models/categorySchema");
const Course = require("../models/courseSchema");

class Controller {
  async createCat(req, res) {
    try {
      const catExists = await Category.findOne({ name: req.body.name });
      if (catExists)
        return res.status(404).json({
          success: "false",
          message: "Category already exists",
        });
      else {
        const newCategory = await Category.create({
          name: req.body.name,
        });
        await newCategory.save();
        return res.status(200).json({
          sucess: "true",
          message: "Category successfully added",
        });
      }
    } catch (err) {
      res.json({
        sucess: false,
        message: err,
      });
    }
  }
  async getAllCat(req, res) {
    try {
      const getall = await Category.find().populate("coursesList");
      if (getall.length == 0) {
        return res.status(200).json({
          sucess: false,
          message: "Categoy list is empty",
        });
      }
      return res.status(200).json({
        success: true,
        message: getall,
      });
    } catch (err) {
      res.json({
        sucess: false,
        message: err.message,
      });
    }
  }
  async getOneCat(req, res) {
    try {
      const category = await Category.findOne({ _id: req.params.id });
      // .populate("coursesList")
      if (!category) {
        return res.status(200).json({
          sucess: false,
          message: "Not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: category,
      });
    } catch (err) {
      res.json({
        sucess: false,
        message: err.message,
      });
    }
  }
  async updateCat(req, res) {
    try {
      const cat = await Category.findOneAndUpdate(
        { name: req.params.name },
        { $set: req.body },
        { new: true }
      );
      if (!cat) {
        return res.status(500).json({
          success: false,
          message: "Unvalid input",
        });
      }
      return res.status(200).json(cat);
    } catch (err) {
      return res.status(401).json({ message: err.message });
    }
  }
  async deleteCat(req, res) {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      await Course.deleteMany({ category: category._id });
      return res.status(200).json({
        success: true,
        message: "Successfully deleted",
      });
    } catch (err) {
      res.status(401).json({
        message: err.message,
      });
    }
  }
}

const CategoyController = new Controller();
module.exports = CategoyController;
