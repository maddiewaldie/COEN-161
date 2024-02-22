const fs = require('fs').promises;
const cheerio = require('cheerio');
const path = require('path');

module.exports = {
  GET: async (req, res) => {
    try {
      // Read the templates/index.html file using fs.readFile
      const indexHtml = await fs.readFile(path.join(__dirname, '../templates/index.html'), 'utf-8');
      const latestArticle = req.app.articles[0];

      // Load the template using cheerio
      const $ = cheerio.load(indexHtml);

      // Replace the article h1's text with latestArticle's title field
      $('article h1').text(latestArticle.title);

      // For each of latest.tags
      latestArticle.tags.forEach((tag) => {
        // Select ul.tags and append a tag to this list
        const tagElement = $('<li><a></a></li>');

        // Dynamically fill in the href value and the content of the a tag
        tagElement.find('a').attr('href', `/articles?tag=${tag}`).text(tag);

        // Append the tag to the list
        $('ul.tags').append(tagElement);
      });

      // Select the article header and append a time element. Fill in the datetime values and the text for the time element.
      const timeElement = $('<time></time>').attr('datetime', latestArticle.dateWritten.toISOString()).text(latestArticle.dateWritten.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
      $('article header').append(timeElement);

      // For each of latest.paragraphs
      latestArticle.paragraphs.forEach((paragraph) => {
        // Create a new paragraph tag and insert it after the article header
        const paragraphElement = $('<p></p>').text(paragraph);
        $('article header').after(paragraphElement);
      });

      // At the very end, return the HTML by calling res.end($.html())
      res.end($.html());
    } catch (error) {
      console.error('Error:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  },
};
