var express = require("express");
const { CourseController } = require("../controllers/course");
var router = express.Router();
// const CourseController = require("../controllers/course");

const { uploadFiles } = require("../utils/multer");
router.post("/createCourse", uploadFiles(), CourseController.createCourse);

router.get("/getAllCourses", CourseController.getAllCourses);
router.get("/getOneCourse/:id", CourseController.getOneCourse);
router.delete("/deleteCourse/:id", CourseController.deleteCourse);
router.put("/updateCourse/:id", CourseController.updateCourse);

module.exports = router;
