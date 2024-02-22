const fs = require('fs').promises;
const path = require('path');

module.exports = {
  GET: async (req, res) => {
    try {
      // Read the all-articles.html file from the templates directory
      const allArticlesHtml = await fs.readFile(path.join(__dirname, '../templates/all-articles.html'), 'utf-8');

      // Create a string called listing
      let listing = '';

      // For each of req.app.articles
      req.app.articles.forEach((article) => {
        // Create an HTML string for each article
        const articleHtml = `
          <article>
            <h1><a href="/articles/${article.filename}">${article.title}</a></h1>
            <ul class="tags">${article.tags.map(tag => `<li>${tag}</li>`).join('')}</ul>
            <p>${article.paragraphs.join('</p><p>')}</p>
          </article>
        `;

        // Append the article HTML to the main element
        listing += articleHtml;
      });

      // Replace the placeholder in all-articles.html with the generated listing
      const responseHtml = allArticlesHtml.replace('{{ ARTICLE_LISTING }}', listing);

      // Send back the HTML
      res.end(responseHtml);
    } catch (error) {
      console.error('Error:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  },
};
