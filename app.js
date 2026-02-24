require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./db/connect");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");

const app = express();
const passport = require("passport");
const passportInit = require("./passport/passportInit");
// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session store (Mongo)
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Passport
passportInit();
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
// Flash
app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.errors = req.flash("error");
  res.locals.info = req.flash("info");
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sessions", require("./routes/sessionRoutes"));

// Test flash route (temporary)
app.get("/test-flash", (req, res) => {
  req.flash("info", "Flash is working!");
  res.redirect("/");
});

// 404
app.use((req, res) => {
  res.status(404).render("404");
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
