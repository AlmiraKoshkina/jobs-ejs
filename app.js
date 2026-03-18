require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./db/connect");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");

const passport = require("passport");
const passportInit = require("./passport/passportInit");

const auth = require("./middleware/auth");
const secretWordRouter = require("./routes/secretWord");

const helmet = require("helmet");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

const app = express();
app.disable("x-powered-by");
app.use(helmet());

// --------------------
// DATABASE
// --------------------

let mongoURL = process.env.MONGO_URI;

if (process.env.NODE_ENV === "test") {
  mongoURL = process.env.MONGO_URI_TEST;
}

// --------------------
// VIEW ENGINE
// --------------------

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --------------------
// BODY PARSING
// --------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --------------------
// COOKIES
// --------------------

app.use(cookieParser());

// --------------------
// SESSION
// --------------------

const store = new MongoDBStore({
  uri: mongoURL,
  collection: "sessions",
});

store.on("error", function (error) {
  console.log(error);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

// --------------------
// FLASH
// --------------------

app.use(flash());

// --------------------
// PASSPORT
// --------------------

passportInit();
app.use(passport.initialize());
app.use(passport.session());

// --------------------
// CSRF
// --------------------

if (process.env.NODE_ENV !== "test") {
  const csrfProtection = csrf({ cookie: true });
  app.use(csrfProtection);

  app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
  });
} else {
  app.use((req, res, next) => {
    const token = "test-token";
    req.csrfToken = () => token;
    res.locals.csrfToken = token;
    res.cookie("csrfToken", token);
    next();
  });
}

// --------------------
// LOCALS
// --------------------

app.use(require("./middleware/storeLocals"));

// --------------------
// ROUTES
// --------------------

app.get("/", (req, res) => {
  res.render("index");
});

if (process.env.NODE_ENV === "test") {
  app.use("/learningUnits", require("./routes/learningUnits"));
} else {
  app.use("/learningUnits", auth, require("./routes/learningUnits"));
}

app.use("/secretWord", auth, secretWordRouter);
app.use("/sessions", require("./routes/sessionRoutes"));

// --------------------
// TEST ENDPOINT
// --------------------

app.get("/multiply", (req, res) => {
  const first = Number(req.query.first);
  const second = Number(req.query.second);

  res.json({ result: first * second });
});

// --------------------
// 404
// --------------------

app.use((req, res) => {
  res.status(404).render("404");
});

// --------------------
// ERROR HANDLER
// --------------------

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).render("error", {
    message: err.message || "Something went wrong",
  });
});

// --------------------
// SERVER
// --------------------

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(mongoURL);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

if (process.env.NODE_ENV !== "test") {
  start();
} else {
  connectDB(mongoURL);
}

// --------------------
// EXPORT
// --------------------

module.exports = { app };
