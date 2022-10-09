require("dotenv").config();
const redis = require("../config/redis");
const app = require("./app");

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  // depending on level of use, use a logging library
  console.log(`server listening at port ${PORT}`);
  redis.connect(() => console.log("redis connected"));
});
