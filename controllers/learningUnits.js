const LearningUnit = require("../models/LearningUnit");
const mongoose = require("mongoose");

// GET all units
const getAllUnits = async (req, res, next) => {
  try {
    const filter = { createdBy: req.user._id };

    // SEARCH
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }

    // FILTER BY PROGRESS
    if (req.query.progress) {
      filter.progress = req.query.progress;
    }

    // SORT
    const sort = req.query.sort || "-createdAt";

    // PAGINATION
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const units = await LearningUnit.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await LearningUnit.countDocuments(filter);

    res.render("learningUnits", {
      units,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      search: req.query.search || "",
      progress: req.query.progress || "",
    });
  } catch (error) {
    next(error);
  }
};

// SHOW create form
const showCreateForm = (req, res) => {
  res.render("learningUnit", { unit: null });
};

// CREATE unit
const createUnit = async (req, res, next) => {
  try {
    const { title, description, category, progress, targetDate } = req.body;

    await LearningUnit.create({
      title,
      description,
      category,
      progress,
      targetDate,
      createdBy: req.user._id,
    });

    req.flash("info", "Learning unit created successfully");

    res.redirect("/learningUnits");
  } catch (error) {
    next(error);
  }
};

// SHOW edit form
const showEditForm = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.redirect("/learningUnits");
    }

    const unit = await LearningUnit.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!unit) {
      return res.redirect("/learningUnits");
    }

    res.render("learningUnit", { unit });
  } catch (error) {
    next(error);
  }
};

// UPDATE unit
const updateUnit = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.redirect("/learningUnits");
    }

    const { title, description, category, progress, targetDate } = req.body;

    const unit = await LearningUnit.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!unit) {
      return res.redirect("/learningUnits");
    }

    unit.title = title;
    unit.description = description;
    unit.category = category;
    unit.progress = progress;
    unit.targetDate = targetDate;

    await unit.save();

    req.flash("info", "Learning unit updated");

    res.redirect("/learningUnits");
  } catch (error) {
    next(error);
  }
};

// DELETE unit
const deleteUnit = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.redirect("/learningUnits");
    }

    await LearningUnit.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    req.flash("info", "Learning unit deleted");

    res.redirect("/learningUnits");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUnits,
  showCreateForm,
  createUnit,
  showEditForm,
  updateUnit,
  deleteUnit,
};
