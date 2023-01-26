var express = require("express");
var router = express.Router();
const CourseController = require("../controllers/course");
router.post("/createCourse", CourseController.createCourse);
router.get("/getAllCourses", CourseController.getAllCourses);
router.get("/getOneCourse/:id", CourseController.getOneCourse);
router.delete("/deleteCourse/:id", CourseController.deleteCourse);
router.put("/updateCourse/:id", CourseController.updateCourse);

module.exports = router;
