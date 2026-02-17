const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

// Show register page
router.get("/register", (req, res) => {
  res.render("register");
});

// Handle register
router.post("/register", async (req, res) => {
  const { name, email, password, password1 } = req.body;

  if (password !== password1) {
    req.flash("error", "Passwords do not match");
    return res.redirect("/sessions/register");
  }

  try {
    await User.create({ name, email, password });
    req.flash("info", "Registration successful. Please log in.");
    res.redirect("/sessions/logon");
  } catch (error) {
    req.flash("error", "Email already registered");
    res.redirect("/sessions/register");
  }
});

// Show login page
router.get("/logon", (req, res) => {
  res.render("logon");
});

// Handle login
router.post(
  "/logon",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sessions/logon",
    failureFlash: true,
  })
);

// Handle logout
router.post("/logoff", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
