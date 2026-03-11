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

const app = express();
app.disable("x-powered-by");
app.use(helmet());

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parsing
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));

// Session store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error", function (error) {
  console.log(error);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Flash messages
app.use(flash());

// Passport
passportInit();
app.use(passport.initialize());
app.use(passport.session());

// Store locals
app.use(require("./middleware/storeLocals"));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/learningUnits", auth, require("./routes/learningUnits"));
app.use("/secretWord", auth, secretWordRouter);
app.use("/sessions", require("./routes/sessionRoutes"));

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

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).render("error", {
    message: err.message || "Something went wrong",
  });
});

start();
