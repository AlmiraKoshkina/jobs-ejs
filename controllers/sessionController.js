const User = require("../models/User");

const registerShow = (req, res) => {
  res.render("register", {
    csrfToken: req.csrfToken(),
  });
};

const registerDo = async (req, res, next) => {
  const { name, email, password, password1 } = req.body;

  if (password !== password1) {
    req.flash("error", "The passwords entered do not match.");
    return res.render("register", {
      csrfToken: req.csrfToken(),
    });
  }

  try {
    await User.create({
      name,
      email,
      password,
    });

    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Registered</title>
        </head>
        <body>
          <p>Registration successful.</p>
          <a href="/sessions/logon">Click this link to logon</a>
        </body>
      </html>
    `);
  } catch (e) {
    if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
      return res.render("register", {
        csrfToken: req.csrfToken(),
      });
    }

    return next(e);
  }
};

const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }

  res.render("logon", {
    csrfToken: req.csrfToken(),
  });
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
