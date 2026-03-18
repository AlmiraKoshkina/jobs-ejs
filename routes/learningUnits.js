const express = require("express");
const router = express.Router();

const learningUnitsController = require("../controllers/learningUnits");

// routes
router.get("/", learningUnitsController.getAllUnits);
router.get("/new", learningUnitsController.showCreateForm);
router.post("/", learningUnitsController.createUnit);
router.get("/edit/:id", learningUnitsController.showEditForm);
router.post("/update/:id", learningUnitsController.updateUnit);
router.post("/delete/:id", learningUnitsController.deleteUnit);

module.exports = router;
