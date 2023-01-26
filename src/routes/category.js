var express = require("express");
var router = express.Router();
const CategoryController = require("../controllers/category");
router.post("/createCat", CategoryController.createCat);
router.get("/getAllCat", CategoryController.getAllCat);
router.get("/getOneCat/:id", CategoryController.getOneCat);
router.put("/updateCat/:name", CategoryController.updateCat);
router.delete("/deleteCat/:id", CategoryController.deleteCat);

module.exports = router;
