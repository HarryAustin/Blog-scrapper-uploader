require("dotenv").config();
const cors = require("cors");
const express = require("express");
//
const indexRouteMiddleware = require("./router/index.router");

const app = express();

app.use(express.json());

// dynamic cors handler

const developmentDomains = ["http://localhost:3000", "http://127.0.0.1:8000"];
const prodDomains = [];

const whiteList =
  process.env.NODE_ENV === "development" ? developmentDomains : prodDomains;
const corsOption = {
  origin: (origin, callback) => {
    if (origin === undefined || whiteList.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
};

app.use(cors(corsOption));

app.use("/api/v1/user", indexRouteMiddleware.userRouter());

app.use((err, req, res, next) => {
  res.status(500).json({
    msg: "some server error occured. Server will be up and running in few mins.",
  });
});

module.exports = app;
