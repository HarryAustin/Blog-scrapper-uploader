const express = require("express");

const router = express.Router();

const UserController = require("../controller/user.controller");

const userRouter = () => {
  router.get("/id", UserController.getUserId);
  return router;
};

// module.exports = router;
module.exports = {
  userRouter,
};
