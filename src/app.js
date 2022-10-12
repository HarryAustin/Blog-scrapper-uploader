require("dotenv").config();
const cors = require("cors");
const express = require("express");
// const redis = require("../config/redis");
const indexRouteMiddleware = require("./router/index.router");

const app = express();

app.use(express.json());

// dynamic cors handler

const whiteList = ["http://localhost:3000"];
const corsOption = {
  origin: (origin, callback) => {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
};

app.use(cors(corsOption));

app.use("/api/v1/user", indexRouteMiddleware.userRouter());

app.use((err, req, res, next) => {
  res.status(500).json({
    msg: "some server error occured. Server will be backup in few mins.",
  });
});

module.exports = app;
