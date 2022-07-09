const express = require("express");
const morgan = require("morgan");
const path = require('path');
const cookieParser = require('cookie-parser');
const { randomBytes } = require('crypto');
require("dotenv").config();
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

const { handleError } = require("./helpers/errorHandler");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const COOKIE_SECRET = 'dashldhe128ewhgcvasdy7et2hvhwytt2';
const SESSIONS = {};
const app = express();

if (app.get("env") === "production") {
  const fs = require("fs");
  const path = require("path");
  var rfs = require("rotating-file-stream");

  const logPath = path.join(__dirname, "log");
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
  }
  const accessLogStream = rfs.createStream("access.log", {
    interval: "1d", // rotate daily
    path: path.join(__dirname, "log"),
  });
  // log to a file
  app.use(morgan("combined", { stream: accessLogStream }));
} else {
  // log to stdout
  app.use(morgan("dev"));
}

app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(COOKIE_SECRET));

//app.use("/", indexRouter);
app.use("/", require('./controllers'));
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname + '/views', '/index.html'))
// });



app.use((err, req, res, next) => handleError(err, res));

module.exports = app;
