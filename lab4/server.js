const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const parseOptions = require('./utils/parse-options');
const log = require('./utils/log');

const { port } = parseOptions({ port: "p" });

if (!port) {
  log.fatal("No port provided", 1);
}

const endpoints = {
  '/static': {
    'GET': serveStaticFile,
  },
};

const server = http.createServer((req, res) => {
  const requestUrl = req.url;
  const requestMethod = req.method;
  const matchingEndpoint = Object.keys(endpoints).find((key) => requestUrl.startsWith(key));

  if (matchingEndpoint) {
    const action = endpoints[matchingEndpoint][requestMethod];
    if (action) {
      action(req, res);
    }
    else {
      res.statusCode = 405;
      res.end('Method unallowed.');
    }
    // console.log(action);
  } else {
    // console.log("err");
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

async function serveStaticFile(req, res) {
  const filePath = path.join(__dirname, 'static', path.basename(req.url));
  // console.log(filePath);
  try {
    const data = await fs.readFile(filePath);
    const contentType = getContentType(filePath);
    // console.log(contentType);
    res.statusCode = 200;
    res.end(data);
  } catch (error) {
    // console.log("ERROR");
    res.statusCode = 403;
    res.end('File Not Found');
  }
}

function getContentType(filePath) {
    const extname = path.extname(filePath);
    // console.log(extname);
    switch (extname) {
      case '.html':
        return 'text/html';
      case '.css':
        return 'text/css';
      case '.js':
        return 'text/javascript';
      case '.png':
        return 'image/png';
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      default:
        return 'application/octet-stream';
    }
}
