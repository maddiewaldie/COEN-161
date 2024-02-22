const fs = require("fs");
const readline = require("readline");
const path = require("path");

const getArticlePath = (file) => path.join(__dirname, "../", "articles", file);

module.exports = (file) => {
  const fileStream = fs.createReadStream(getArticlePath(file));
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  return new Promise((resolve) => {
    let paragraphCount = 0;
    let startReading = false;
    let titleSection = "";
    rl.on("line", (line) => {
      if (line.includes("</p>")) {
        paragraphCount++;

        if (paragraphCount === 2) {
          startReading = false;
          titleSection += line;
          rl.close();
          return;
        }
      }

      if (line.includes("--- TITLE")) {
        startReading = true;
        return;
      }

      if (startReading) {
        titleSection += line;
      }
    });

    rl.on("close", () => {
      resolve(titleSection);
    });
  });
};
