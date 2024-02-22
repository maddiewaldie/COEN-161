const fs = require('fs').promises;
const path = require("path");
const log = require("../utils/log");

const MIME_TYPES = {
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  png: "image/png",
};

module.exports = {
  GET: (req, res) => {
    const filepath = path.join(__dirname, "../", req.url.replace(/\?.*/, ""));
    log.info(`Requested file ${filepath}`);
    return fs
      .stat(filepath)
      .then(() => {
        const mimeHeader = MIME_TYPES[path.extname(filepath).substring(1)];
        log.info(`mime-type for ${path.extname(filepath)} - ${mimeHeader}`);
        res.setHeader("Content-Type", mimeHeader);

        const encoding = mimeHeader.startsWith("text") ? "utf-8" : "";
        const p = fs.readFile(filepath, encoding);
        res.statusCode = 200;

        return Promise.all([p, encoding]);
      })
      .then(([contents, encoding]) => {
        res.end(contents, encoding);
      })
      .catch((err) => {
        if (err.code === "ENOENT") {
          log.warn(`Unable to find file ${filepath}`);
          res.statusCode = 404;
          return res.end();
        } else if (err.code === "EACCESS") {
          log.warn(`Unable to access a file ${filepath}`);
          res.statusCode = 403;
          return res.end();
        }

        log.error(`Encountered an unexpected error code ${err}`);
        res.statusCode = 400;
        return res.end();
      });
  },
};
