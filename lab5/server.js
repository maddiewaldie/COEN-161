const http = require("http");
const fs = require("fs");
const path = require("path");
const log = require("./utils/log");
const mustBeNumber = require("./utils/must-be-number");
const parseOptions = require("./utils/parse-options");
const readArticleHeader = require("./utils/read-article-header");
const cheerio = require("cheerio");
const url = require('url');

const getArticlePath = (file) => path.join("", file);

const articles = [];

const endpoints = {
  "/static": require("./routes/static"),
  "/articles": require("./routes/articles"),
  "/index": require("./routes/index"),
  "/all-articles": require("./routes/all-articles"),
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  for (const [p, handlers] of Object.entries(endpoints)) {
    if (req.url.startsWith(p)) {
      if (typeof handlers[req.method] === "function") {
        req.app = {
          articles: articles,
        };
        req.query = parsedUrl.query;
        log.info(`found a handler for ${req.method}`);
        return handlers[req.method](req, res);
      } else {
        log.warn(`no handler available for ${p} --> ${req.method}`);
        res.statusCode = 405;
        return res.end();
      }
    }
  }

  log.warn(`unable to find a matching path for ${req.url}`);
  res.statusCode = 404;
  return res.end();
});

const extractArticleMetadata = ([metadataHTML, filenames]) => {
  for (let i = 0; i < metadataHTML.length; i++) {
    const $ = cheerio.load(metadataHTML[i]);

    const tagContents = [];
    const tags = $("ul li a").contents();
    for (let i = 0; i < tags.length; i++) {
      tagContents.push(tags[i].data);
    }

    articles.push({
      filename: filenames[i],
      title: $("h1").text(),
      tags: tagContents,
      dateWritten: new Date($("time").prop("datetime")),
      paragraphs: [
        $("p:nth-of-type(1)").text().trim(),
        $("p:nth-of-type(2)").text().trim(),
      ],
    });
  }

  articles.sort((a, b) => b.dateWritten - a.dateWritten);

  console.log(articles);
};

const fileContentsAndNames = (filenames) => {
  // Create an array called articlePromises
  const articlePromises = [];

  console.log(filenames)

  // For each of the files in the directory
  for (file of filenames) {
    // Call the readArticleHeader function. This function returns a promise with just the contents of the article metadata
      // You can see what this looks like by looking at lab-5/articles/dotcom.html.
      // readArticleHeader will return all the contents between the lines that say ---TITLE and —BODY
    const articleContents = readArticleHeader(getArticlePath(file));

    console.log(getArticlePath(file));

    // Push the return value of readArticleHeader() into the array from 2a, articlePromises
    articlePromises.push(articleContents);
  }

  // Create another new array which will be the return value for this link in the Promise chain
    // The return value array should have two elements: Promise.all(articlePromises) AND the parameter to this link in the chain. 
    return Promise.all(articlePromises).then((metadataHTML) => [metadataHTML, filenames]);
};

const indexAllArticles = () => {
  /** FILL IN BASED ON INSTRUCTIONS AND MAKE SURE TO RETURN A PROMISE */

  // Return a promise to the fs.readdir function. 
    // fs.readdir takes one argument, a path to a directory to read. 
    // fs.readdir returns an array of strings representing the filenames in the directory

  // Chain the fs.readdir promise with the fileContentsAndNames function

  // Chain the previous function with the extractArticleMetadata function 
  return fs.promises.readdir(path.join(__dirname, "articles"))
    .then(fileContentsAndNames)
    .then(extractArticleMetadata);

};

const options = parseOptions({ port: ["p", "port"] });
mustBeNumber("port", options.port, 1000, 65543);

log.debug(`starting server on port ${options.port}`);

indexAllArticles().then(() => {
  server.listen(options.port);
});
