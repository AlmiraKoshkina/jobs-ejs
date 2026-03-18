const storeLocals = (req, res, next) => {
  // current user
  if (req.user) {
    res.locals.user = req.user;
  } else {
    res.locals.user = null;
  }

  // flash messages
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");

  // CSRF token
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }

  next();
};

module.exports = storeLocals;
