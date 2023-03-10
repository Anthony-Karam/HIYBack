var express = require("express");
var router = express.Router();
const CategoryController = require("../controllers/category");
router.post("/admin/createCat", CategoryController.createCat);
router.get("/getAllCat", CategoryController.getAllCat);
router.get("/getOneCat/:id", CategoryController.getOneCat);
router.put("/admin/updateCat/:name", CategoryController.updateCat);
router.delete("/admin/deleteCat/:id", CategoryController.deleteCat);

module.exports = router;
