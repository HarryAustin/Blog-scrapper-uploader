const express = require("express");

const router = express.Router();

const UserController = require("../controller/user.controller");

const userRouter = () => {
  router.get("/id", UserController.getUserId);
  router.post("/:id/upload", UserController.scrapeAndUpload);
  return router;
};

// module.exports = router;
module.exports = {
  userRouter,
};
