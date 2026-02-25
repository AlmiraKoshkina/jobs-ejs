const User = require("../models/User");

const registerShow = (req, res) => {
  res.render("register");
};

const registerDo = async (req, res, next) => {
  const { name, email, password, password1 } = req.body;

  // Check password match
  if (password !== password1) {
    req.flash("error", "The passwords entered do not match.");
    return res.render("register");
  }

  try {
    await User.create({ name, email, password });
  } catch (e) {
    if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
      return res.render("register");
    }
    return next(e);
  }

  res.redirect("/");
};

const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon");
};

const logoff = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

module.exports = {
  registerShow,
  registerDo,
  logonShow,
  logoff,
};
