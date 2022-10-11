const axios = require("axios");
const cheerio = require("cheerio");
const Queue = require("bull");

const ScrapperQueue = new Queue("scrape_blog");

ScrapperQueue.process(async (job) => {
  try {
    const data = job.data.data;

    let promises = [];
    let blogOpts = [];

    data.forEach(async ({ url, tags }) => {
      promises.push(axios.get(url));
      blogOpts.push({ url, tags });
    });

    const articlesResponse = await Promise.all(promises);

    let blogObjs = [];

    articlesResponse.forEach(({ data }, index) => {
      const htmlPage = data;

      const $ = cheerio.load(htmlPage);

      const title = $("h1.blog-post_title", htmlPage).text();
      const content = $("article .blog-post_content", htmlPage).html();

      const dataObj = {
        title,
        contentFormat: "html",
        content,
        canonicalUrl: blogOpts[index].url,
        tags: blogOpts[index].tags,
        publishStatus: "public",
      };

      blogObjs.push(dataObj);
    });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = {
  ScrapperQueue,
};
