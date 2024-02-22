const input = document.querySelector("input");
const image = document.querySelector("img");

// Generate a random number between 1 and 150
const randomPokemonId = Math.floor(Math.random() * 150) + 1;

// Fetch the name of the Pokemon
fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`)
    .then((response) => response.json())
    .then((data) => {
        const name = data.name;

        const titleCasedName = name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

        // Replace spaces with hyphens
        const imageName = titleCasedName.replace(/\s/g, '-');

        // Set the src attribute of the image element
        image.src = `https://aelahi.dev/coen-161/pokemon/${imageName}.png`;
        image.alt = imageName;

        // Add an event listener to the input element's keyup event
        input.addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
                const inputValue = input.value.trim().toLowerCase();
                if (inputValue === name) {
                    // If the name is correct, add the 'correct' class to the image
                    image.classList.add("correct");
                } else {
                    // If the name is incorrect, add the 'wrong' class to the image
                    image.classList.add("wrong");

                    // Remove the 'wrong' class after 3 seconds
                    setTimeout(function () {
                    image.classList.remove("wrong");
                    }, 3000);
                }
                // Clear the input field
                input.value = "";
            }
        });
    })
    .catch((error) => {
        // If there's an error while fetching, create a p element with an error message
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error fetching Pokemon data.";
        document.querySelector("section").prepend(errorMessage);
    });
