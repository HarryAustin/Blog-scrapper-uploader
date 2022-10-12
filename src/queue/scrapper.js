const axios = require("axios");
const cheerio = require("cheerio");
const Queue = require("bull");

const { UploaderQueue } = require("./uploader");

const ScrapperQueue = new Queue("scrape_blog");

ScrapperQueue.process(async (job) => {
  try {
    const { data, userId } = job.data;

    let promises = [];
    let blogOpts = [];

    data.forEach(async ({ url, tags, text }) => {
      promises.push(axios.get(url));
      blogOpts.push({ url, tags, text });
    });

    const articlesResponse = await Promise.all(promises);

    let blogArticleObjs = [];

    articlesResponse.forEach(({ data }, index) => {
      const htmlPage = data;

      const $ = cheerio.load(htmlPage);

      // remove not needed
      const contentRawHtml = $("article .blog-post_content", htmlPage);
      contentRawHtml.find("div.single_post_info").remove();
      contentRawHtml.find(".post_info-divider").remove();
      contentRawHtml.find(".clear").remove();

      const addedText = blogOpts[index].text;
      const title = $("h1.blog-post_title", htmlPage).text();
      const content = `<h1 class="pw-post-title">${title}</h1>${contentRawHtml.html()}<p class="pw-post-body-paragraph">${
        addedText && addedText.length ? addedText : ""
      }</p>`;

      const dataObj = {
        title,
        contentFormat: "html",
        content,
        canonicalUrl: blogOpts[index].url,
        tags: blogOpts[index].tags,
        publishStatus: "public",
      };

      blogArticleObjs.push(dataObj);
    });

    UploaderQueue.add({ userId, blogArticleObjs }, { removeOnComplete: true });

    // pass to uploader queue
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = {
  ScrapperQueue,
};
