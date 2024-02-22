/**
 * For help on the questions, refer students to https://flaviocopes.com/javascript-async-defer
 */
const Archive = {
  search: {
    state: {
      tags: [],
    },
    elements: {
      parentElement: null,
      tagLists: Array.from(document.querySelectorAll("article .tags")),
    },
    initialize: (parentElement) => {
      const params = new URLSearchParams(window.location.search);
      if (parentElement === null) {
        console.error(
          "Cannot insert tags, parent element is null",
          params.getAll("tag")
        );
        return;
      }

      Archive.search.elements.parentElement = parentElement;
      for (const tag of params.getAll("tag")) {
        Archive.search.addSearchTerm(tag);
      }
    },
    hideArticles: () => {
      if (Archive.search.state.tags.length === 0) {
        for (const article of document.querySelectorAll("article")) {
          article.classList.remove("hidden");
        }

        return;
      }

      const articlesWithTags = [];
      for (const tag of Archive.search.state.tags) {
        articlesWithTags.push(...Archive.search.findArticlesWithTag(tag));
      }

      for (const article of document.querySelectorAll("article")) {
        if (!articlesWithTags.includes(article)) {
          article.classList.add("hidden");
        } else {
          article.classList.remove("hidden");
        }
      }
    },
    createTag: (text) => {
      const button = document.createElement("button");
      button.classList.add("tag");
      button.textContent = text;
      const remove = () => {
        button.remove();
        const index = Archive.search.state.tags.indexOf(text);
        if (index !== -1) {
          Archive.search.state.tags.splice(index, 1);
        }

        Archive.search.hideArticles();
      };

      button.addEventListener("click", remove);
      return button;
    },
    findArticlesWithTag: (phrase) => {
      const articles = [];
      const sanitizedPhrase = phrase.toLowerCase().trim();
      for (const tl of Archive.search.elements.tagLists) {
        const tags = Array.from(tl.querySelectorAll("li"));
        for (const tag of tags) {
          if (tag.textContent.toLowerCase().trim() === sanitizedPhrase) {
            articles.push(tl.parentElement);
            break;
          }
        }
      }

      return articles;
    },
    addSearchTerm: (text) => {
      Archive.search.elements.parentElement.appendChild(
        Archive.search.createTag(text)
      );
      Archive.search.state.tags.push(text);
      Archive.search.hideArticles();
    },
  },
  handlers: {
    onSearch: (event) => {
      const input = event.currentTarget;
      if (event.key === "Enter") {
        Archive.search.addSearchTerm(input.value);
        input.value = "";
      }
    },
  },
  main: () => {
    Archive.search.initialize(document.querySelector("#searched-tags"));

    document
      .querySelector("input[type=search]")
      .addEventListener("keypress", Archive.handlers.onSearch);
  },
};

Archive.main();
