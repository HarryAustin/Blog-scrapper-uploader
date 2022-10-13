require("dotenv").config();
const express = require("express");
const path = require("path");
//
const app = require("./src/app");
const redis = require("./config/redis");

// for production frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  // depending on level of use, use a logging library
  console.log(`server listening at port ${PORT}`);
  redis.connect(() => console.log("redis connected"));
});
