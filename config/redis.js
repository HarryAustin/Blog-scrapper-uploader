require("dotenv").config();
const Redis = require("ioredis");

const options = {
  port: process.env.REDIS_PORT || 6379, // Redis port
  host: process.env.REDIS_HOST || "127.0.0.1", // Redis host
  // username: "default", // needs Redis >= 6
  // password: "my-top-secret",
  // db: 0, // Defaults to 0
};

const redis = new Redis(options);

module.exports = redis;
