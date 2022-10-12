require("dotenv").config();
const axios = require("axios");
const Queue = require("bull");

const UploaderQueue = new Queue("upload_to_medium");

UploaderQueue.process(async (job) => {
  try {
    const API_KEY = process.env.MEDIUM_API_KEY;

    const { userId, blogArticleObjs } = job.data;

    const options = {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    };

    let promises = [];

    blogArticleObjs.forEach((blogArticleObj) => {
      promises.push(
        axios.post(
          `https://api.medium.com/v1/users/${userId}/posts`,
          blogArticleObj,
          options
        )
      );
    });

    await Promise.all(promises);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = {
  UploaderQueue,
};
