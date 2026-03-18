const LearningUnit = require("../models/LearningUnit");

// -----------------------------
// GET ALL UNITS
// -----------------------------
exports.getAllUnits = async (req, res) => {
  try {
    const filter = req.user ? { createdBy: req.user._id } : {};
    const units = await LearningUnit.find(filter);

    res.render("learningUnits", {
      units,
      search: "",
      currentPage: 1,
      totalPages: 1,
    });
  } catch (error) {
    console.error("GET ALL UNITS ERROR:", error);
    res.redirect("/");
  }
};

// -----------------------------
// SHOW CREATE FORM
// -----------------------------
exports.showCreateForm = async (req, res) => {
  try {
    res.render("learningUnits", {
      units: [],
      search: "",
      currentPage: 1,
      totalPages: 1,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/learningUnits");
  }
};

// -----------------------------
// CREATE UNIT
// -----------------------------

exports.createUnit = async (req, res) => {
  try {
    const unit = await LearningUnit.create({
      title: req.body.title || "Test Title",
      description: req.body.description || "Test Description",
      category: req.body.category || "coding",
      progress: req.body.progress || "in_progress",
    });

    return res.redirect("/learningUnits");
  } catch (error) {
    console.error("CREATE ERROR:", error);
    return res.redirect("/learningUnits");
  }
};

// -----------------------------
// SHOW EDIT FORM
// -----------------------------
exports.showEditForm = async (req, res) => {
  try {
    const unit = await LearningUnit.findById(req.params.id);

    res.render("learningUnits", {
      units: [unit],
      search: "",
      currentPage: 1,
      totalPages: 1,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/learningUnits");
  }
};

// -----------------------------
// UPDATE UNIT
// -----------------------------
exports.updateUnit = async (req, res) => {
  try {
    const { title, description, category, progress } = req.body;

    await LearningUnit.findByIdAndUpdate(req.params.id, {
      title,
      description,
      category,
      progress,
    });

    res.redirect("/learningUnits");
  } catch (error) {
    console.error(error);
    res.redirect("/learningUnits");
  }
};

// -----------------------------
// DELETE UNIT
// -----------------------------
exports.deleteUnit = async (req, res) => {
  try {
    await LearningUnit.findByIdAndDelete(req.params.id);

    res.redirect("/learningUnits");
  } catch (error) {
    console.error(error);
    res.redirect("/learningUnits");
  }
};
