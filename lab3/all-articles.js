// // Exploring Defer: Questions
//     // Try to select all the input elements using document.querySelector
//         // const inputElements = document.querySelectorAll("input");
//         //console.log(inputElements);

//     // With your script tag in the head of the document, take out the defer keyword.
//     // Is the browser able to select the inputs?
//         // Yes, the browser is able to select the elements.

//     // Look through the docs of the script element. What does the defer attribute do?
//         // The defer attribute is a bool set to indicate to a browser that the script is meant 
//         // to be executed after the document has been parsed, but before firing DOMContentLoaded.
//         // Scripts with the defer attribute will prevent the DOMContentLoaded event from firing
//         // until the script has loaded and finished evaluating. 
//         // Additionally, scripts with the defer attribute will execute in order in which they appear
//         // in the document.

//     // What event must occur before the script gets executed if we add the defer attribute?
//         // Before the script gets executed, the HTML parsing of the document must be completed.

//     // Draw a diagram showing the events in the browser when loading a script with defer.
//         // Start parsing the HTML
//             // Encounters defer tag
//             // Fetch script asynchronously
//         // Once finished parsing HTML
//             // Fire DOMContentLoaded
//             // Execute script

//     // Draw a diagram showing the events in the browser when loading a script without defer.
//          // Start parsing the HTML
//             // Encounters defer tag
//             // Fetch script asynchronously
//         // Pause HTML parsing
//             // Execute script
//             // Fire DOMContentLoaded
//         // Resume HTML parsing

// Creating tags from URL params
let includedTags = [];
let includedArticles = [];

const createTag = (tagName) => {
    // Create a new button
    const button = document.createElement("button");
    // Add class tag to the button
    button.classList.add("tag");
    // Set textContent of button to the input for this function
    button.textContent = tagName;
    // Add event listener for removing tags from being searched
    button.addEventListener("click", () => {
        removeTag(tagName);
    });
    // Append the button to a div in the header
    const tagsContainer = document.getElementById("tags-container");
    tagsContainer.appendChild(button);
    // Call hideArticles
    hideArticles();
}

const removeTag = (tagName) => {
    // Find all elements with class "tag"
    const tagButtons = document.querySelectorAll('.tag');

    // Loop through the tag buttons and check their text content
    tagButtons.forEach(button => {
        if (button.textContent.trim() === tagName && button.parentElement.id === "tags-container") {
            // Remove the button
            button.remove();
        }
    });

    // Remove the tag from includedTags
    includedTags = includedTags.filter(tag => tag !== tagName.trim().toLowerCase());

    // Call hideArticles
    hideArticles();
    updateURL();
}

const hideArticles = () => {
    const articles = document.querySelectorAll(".article");
    articles.forEach(article => {
        // Check if includedTags is empty
        if (includedTags.length === 0) {
            article.classList.remove("hidden");
        } else {
            // Search through each article's tags
            const articleTags = article.querySelectorAll(".tag");
            let shouldShow = false;
            articleTags.forEach(tag => {
                if (includedTags.includes(tag.textContent.trim().toLowerCase())) {
                    shouldShow = true;
                }
            });
            if (shouldShow) {
                article.classList.remove("hidden");
            } else {
                article.classList.add("hidden");
            }
        }
    });
}

const addSearchTerm = (searchTerm) => {
    // Add search term to includedTags
    includedTags.push(searchTerm.toLowerCase().trim());
    // Create button
    createTag(searchTerm);
    // Call hideArticles
    hideArticles();
    updateURL();
}

const updateURL = () => {
    // Create a new URLSearchParams object from the current URL
    const urlParams = new URLSearchParams(window.location.search);

    // Clear any existing 'tag' query parameters
    urlParams.delete('tag');

    // Add each tag as a separate 'tag' query parameter
    for (tag of includedTags) {
        urlParams.append('tag', tag);
    }

    // Create a new URL with the updated query parameters
    const newURL = `${window.location.pathname}?${urlParams.toString()}`;

    // Replace the current URL with the new one
    window.history.replaceState({}, '', newURL);
}


const initialize = () => {
    // Get URL search parameters
    const urlParams = new URLSearchParams(window.location.search);
    // Get all parameters with the key 'tag'
    urlParams.getAll('tag').forEach(tag => {
        // Call addSearchTerm for each tag
        addSearchTerm(tag);
    });
}

// Creating tags from search inputs
document.getElementById("search").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        // Get the value of the input
        const searchTerm = event.target.value;
        // Call addSearchTerm
        addSearchTerm(searchTerm);
        // Clear the input value
        event.target.value = '';
    }
});

// Add a click event listener to your article element
const articles = document.querySelectorAll(".article");
articles.forEach(article => {
    article.addEventListener("click", (event) => {
        if (event.target.classList.contains("tag")) {
            const clickedTag = event.target.textContent.trim();
            addSearchTerm(clickedTag);
        }
    });
});

// Initialize the page
initialize();
