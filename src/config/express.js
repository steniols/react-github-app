const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/../../client/build")));
}

app.use(express.static(path.join(__dirname, "/../../client/build")));

app.use("/tags", require("../app/routes/tags"));
app.use("/github", require("../app/routes/github"));

module.exports = app;
