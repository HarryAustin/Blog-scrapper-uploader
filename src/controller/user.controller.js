const axios = require("axios");
const redis = require("../../config/redis");
const { ScrapperQueue } = require("../queue/scrapper");

const API_KEY = process.env.MEDIUM_API_KEY;
const BASE_ROOT = "https://api.medium.com/v1/me";

exports.getUserId = async (req, res) => {
  try {
    const tokenExists = await redis.exists("medium:userId");

    if (tokenExists) {
      const token = await redis.get("medium:userId");
      return res.json({
        status: 200,
        msg: "user id retrieved",
        data: { user: token },
      });
    }

    const options = {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios(BASE_ROOT, options);

    const { data } = response.data;
    const userId = data.id;

    await redis.set("medium:userId", userId);

    return res.json({
      status: 200,
      msg: "user id retrieved",
      data: { user: userId },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.scrapeAndUpload = async (req, res) => {
  try {
    // incase of no id
    const userId = req.params.id || (await redis.get("medium:userId"));
    const { data } = req.body;

    // get the url, text and tags. and reform the tags to its proper format.

    const reformedData = data.map(({ url, text = "", tags = [] }) => {
      const reformedTags =
        tags.length > 0
          ? tags.split(",").map((tag) => {
              return tag.trim();
            })
          : tags;

      return { url, text, tags: reformedTags };
    });

    ScrapperQueue.add(
      { data: reformedData, userId },
      { removeOnComplete: true }
    );

    res.send("sent");
  } catch (err) {
    console.log(err.message);
  }
};
