require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/tags", require("../app/routes/tags"));
app.use("/github", require("../app/routes/github"));

if (process.env.NODE_ENV == "production") {
  const buildPath = path.join(__dirname, "../../client/dist");
  app.use(express.static(buildPath));
  // Let the React router handle any other route (avoids "Cannot GET" on reload)
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

module.exports = app;
