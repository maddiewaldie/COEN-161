const readBody = (request) => {
  let body = [];
  return new Promise(function (resolve) {
    request
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        resolve(Buffer.concat(body).toString());
      });
  });
};

module.exports = readBody;
