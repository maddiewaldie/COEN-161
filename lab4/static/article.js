// Saving user position
let position; // y value

// Add event listener for when page is loaded
    // call restoreUserPosition
    window.addEventListener("load", () => {
        restoreUserPosition();
    });
// Add event listener for user scroll ending
    // call saveUserPosition
    window.addEventListener("scroll", () => {
        // Save the position when the user's scroll ends
        saveUserPosition();
    });

const saveUserPosition = () => {
    // get current user position
    position = window.scrollY;
    // save to position
    const key = document.title.replace(/ /g, "_");
    localStorage.setItem(key, position);
}

const restoreUserPosition = () => {
    // set user position to position
     // Get the key for localStorage
     const key = document.title.replace(/ /g, "_");
     // Get the saved position
     const savedPosition = parseInt(localStorage.getItem(key));
     // Check if a position value exists and is a number
     if (!isNaN(savedPosition)) {
         // Scroll the window to the saved position
         window.scrollTo(0, savedPosition);
     }
}

// Creating highlights
let highlightedContent = [];

// Add event listener to mouseup event of article
document.querySelector(".article").addEventListener("mouseup", (event) => {
    // Get the selected text
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        // Create a highlight
        createHighlight(selectedText);
    }
});

const getCurrentSelection = () => {
    // get document's current selection
}

const createHighlight = (selectedText) => {
    const range = window.getSelection().getRangeAt(0);
    const highlight = document.createElement("span");
    highlight.className = "highlight";
    highlight.textContent = selectedText;

    // Insert the highlight into the range, replacing the selected text
    range.deleteContents();
    range.insertNode(highlight);

    highlightedContent.push(highlight);
    
    // Attach an event listener to remove the highlight when clicked
    highlight.addEventListener("click", () => {
        removeHighlight(highlight);
    });
}


const removeHighlight = (highlight) => {
    // Remove the "highlight" class from the element
    highlight.classList.remove("highlight");

    // Remove the highlight from the highlightedContent array
    const index = highlightedContent.indexOf(highlight.textContent);
    if (index !== -1) {
        highlightedContent.splice(index, 1);
    }
}

const areHighlightsOverlapping = (highlight1, highlight2) => {
    // Check if the two highlights overlap
    return (
        highlight1.getBoundingClientRect().right >= highlight2.getBoundingClientRect().left &&
        highlight1.getBoundingClientRect().left <= highlight2.getBoundingClientRect().right
    );
}

const mergeHighlights = (highlight1, highlight2) => {
    // Merge the two highlights
    const combinedText = highlight1.textContent + " " + highlight2.textContent;
    highlight1.textContent = combinedText;
    removeHighlight(highlight2);
}

// Add event listener to download button's click event
document.getElementById("download-button").addEventListener("click", () => {
    downloadHighlightedContent();
});

const downloadHighlightedContent = () => {
    // Create a JSON string from highlightedContent
    const jsonString = JSON.stringify(Array.from(highlightedContent).map(element => element.textContent));
    // Create a data URI for downloading
    const dataUri = "data:text/plain;charset=utf-8," + encodeURIComponent(jsonString);
    
    // Create an anchor element for downloading
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", dataUri);
    downloadLink.setAttribute("download", "highlights.json");
    downloadLink.click();
}