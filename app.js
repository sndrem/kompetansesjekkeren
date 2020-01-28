require("dotenv").config();
let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
const db = require("./database/mongodb");
db.connect();
const dbService = require("./services/db-service")
const slack = require("./alerting/slack").slackNotifiyer;

let indexRouter = require("./routes/index");

let app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "frontend/build")));

// Lagre alle søk
app.use(function (req, res, next) {
  if (process.env.MILJO === "development") {
    const organisasjonsnummer = req.query.organisasjonsnummer;
    if (organisasjonsnummer) {
      console.log("Lagrer organisasjonsnummer");
      slack.utvikling(`Nytt søk på organisasjonsnummer: ${organisasjonsnummer} - https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=${organisasjonsnummer}`);
      dbService.lagreSok(organisasjonsnummer, null);
    }
  }
  next();
})

app.use(function (req, res, next) {
  next();
});

app.use("/", indexRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
