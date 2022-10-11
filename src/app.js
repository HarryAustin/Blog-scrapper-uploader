require("dotenv").config();
const express = require("express");
// const redis = require("../config/redis");
const indexRouteMiddleware = require("./router/index.router");

const app = express();

app.use(express.json());

// first, i'' get the id of user with the API key and store id in redis.
// this means, we'll have a route for our fake login, that'll always happen when page mounts and no id in localstorage.

// secondly, wil be a route to get all the data from client, parse the tags to array, use the promise all to send to medium

app.use("/api/v1/user", indexRouteMiddleware.userRouter());

module.exports = app;
