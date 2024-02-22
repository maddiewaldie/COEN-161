const Article = {
  storage: {
    getNamespace: () => {
      return document.title.replaceAll(" ", "").toLowerCase();
    },
  },
  position: {
    value: 0,
    restore: () => {
      const namespace = Article.storage.getNamespace();
      const savedPosition = parseInt(
        localStorage.getItem(`${namespace}:position`),
        10
      );
      const position = !isNaN(savedPosition) ? savedPosition : 0;
      Article.position.value = position;
      return position;
    },
    save: (position) => {
      const namespace = Article.storage.getNamespace();
      localStorage.setItem(`${namespace}:position`, position);
    },
  },
  highlights: {
    elements: [],
    addHighlightBehavior: (element) => {
      element.classList.add("highlight");
      element.addEventListener("click", () =>
        Article.highlights.removeHighlight(element)
      );
    },
    createHighlightNode: () => {
      const node = document.createElement("span");
      Article.highlights.addHighlightBehavior(node);
      return node;
    },
    removeHighlight: (node) => {
      if (
        node.classList instanceof DOMTokenList &&
        node.classList.contains("highlight")
      ) {
        const tn = document.createTextNode(node.textContent);
        node.parentNode.replaceChild(tn, node);
        return tn;
      }

      return node;
    },
    highlightText: (range) => {
      if (range.startContainer === range.endContainer) {
        const charactersHighlighted = range.endOffset - range.startOffset;

        // this is the case when a user just clicks the mouse button
        if (charactersHighlighted === 0) {
          return;
        }

        const node = Article.highlights.createHighlightNode();
        range.surroundContents(node);
        Article.highlights.elements.push(node);
      } else if (
        range.startContainer.parentElement === range.endContainer.parentElement
      ) {
        // clear any highlights in the range
        for (
          let curr = range.startContainer;
          curr !== range.endContainer;
          curr = curr.nextSibling
        ) {
          curr = Article.highlights.removeHighlight(curr);
        }
        const node = Article.highlights.createHighlightNode();
        range.surroundContents(node);
        Article.highlights.elements.push(node);
      }
    },
    downloadHighlights: () => {
      const text = Article.highlights.elements.map((node) =>
        node.textContent.replaceAll("s+", "")
      );

      const link = document.createElement("a");
      link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(
        JSON.stringify(text)
      )}`;
      link.download = `${document.title}.json`;
      link.click();
    },
  },
  handlers: {
    onScrollEnd: () => {
      Article.position.save(window.scrollY);
    },
    onSelectionChange: () => {
      const selection = document.getSelection();
      const range = selection.getRangeAt(0);
      Article.highlights.highlightText(range);
    },
  },
  main: () => {
    window.scrollTo(0, Article.position.restore());
    window.addEventListener("scrollend", Article.handlers.onScrollEnd);

    // only attach to the article element
    document
      .querySelector("article")
      .addEventListener("mouseup", Article.handlers.onSelectionChange);

    document
      .querySelector("button#download-highlights")
      .addEventListener("click", Article.highlights.downloadHighlights);
  },
};

Article.main();
