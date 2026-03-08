const express = require("express");
const router = express.Router();

const learningUnitsController = require("../controllers/learningUnits");

// Show all learning units
router.get("/", learningUnitsController.getAllUnits);

// Show form to create a unit
router.get("/new", learningUnitsController.showCreateForm);

// Create a new unit
router.post("/", learningUnitsController.createUnit);

// Show edit form
router.get("/edit/:id", learningUnitsController.showEditForm);

// Update a unit
router.post("/update/:id", learningUnitsController.updateUnit);

// Delete a unit
router.post("/delete/:id", learningUnitsController.deleteUnit);

module.exports = router;
