const fs = require('fs').promises;
const path = require('path');

module.exports = {
  GET: async (req, res) => {
    console.log(req.query)
    try {
      const articlePath = path.join(__dirname, `../${req.url}`);
      // Start by reading both the template file and the requested article and wrapping the values in a Promise.all
      const [template, articleContent] = await Promise.all([
        fs.readFile(path.join(__dirname, '../templates/article.html'), 'utf-8'),
        fs.readFile(articlePath, 'utf-8')
      ]);

      // Find the index of —TITLE and —BODY
      const titleStart = articleContent.indexOf('--- TITLE') + '--- TITLE'.length;
      const titleEnd = articleContent.indexOf('--- BODY');
      const bodyStart = articleContent.indexOf('--- BODY') + '--- BODY'.length;

      console.log(titleStart);
      console.log(titleEnd);
      console.log(bodyStart);

      // Save the HTML between —TITLE and —BODY as a variable called header
      const header = articleContent.substring(titleStart, titleEnd);

      console.log(header);

      // Save the HTML after —BODY as a variable called body
      const body = articleContent.substring(bodyStart);

      console.log(body);

      // With the contents of the template file
      // replace the string '{{ TITLE }}' with the variable title (step 3)
      // replace the string '{{ BODY }}' with the variable body (step 4)
      const responseHtml = template.replace('{{ TITLE }}', header).replace('{{ BODY }}', body);

      // Send the string back as the response
      res.end(responseHtml);
    } catch (error) {
      console.error('Error:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  },
};
