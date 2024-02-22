/**
 * In an effort to make this exercise be effortful, I haven't released
 * the _full_ answers from class. There are some errors to debug
 * that you'll find in the console as well as pseudocode to fill in.
 *
 * At the end of the exercise, you should see an image like
 * pokemon-exercise.png (from Camino). To run this exercise, you'll need
 * to create a very simple index.html that at least includes this script
 * and a body element
 */

/**
 * @function fetchPokemonInfo
 * @param {number} id - the id of the pokemon to fetch, use it to construct the correct URL
 *                      based on the documentation here: https://pokeapi.co/docs/v2#pokemon
 * @returns {Promise<PokemonInfo> | Promise<Error>} returns undefined when there's an error
 */
const fetchPokemonInfo = (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`; // [1A] fill in this URL based on the documentation
  return fetch(url)
    .then((response) => {
      console.log(response.status); // [1B] log out the response's status code
      return response.ok ? response.json() : Promise.reject(response.status); // [1C] return the object representation of the response body or a rejected promise
    })
    .catch((err) => {
      console.error("error", err);
      return Promise.reject(err); // [1D] return the error object instead of 'error'
    });
};

/**
 * @function addPokemonToDocument
 *
 */
const addPokemonToDocument = (pokemonInfo) => {
  const name = pokemonInfo.name;
  const spriteLink = pokemonInfo.sprites.front_default; // [2A] use the sprite link from the response body

  // [2B] create a new paragraph element with the text being the pokemon's name.
  const paragraph = document.createElement("p");
  paragraph.textContent = name;

  // [2C] create a new image element with the spriteLink as the source
  const image = document.createElement("img");
  image.src = spriteLink;

  // [2D] create a div and make it the parent of the elements from 2B and 2C
  const pokemonDiv = document.createElement("div");
  pokemonDiv.appendChild(image);
  pokemonDiv.appendChild(paragraph);

  // [2E] add the div to the body of the document
  document.body.appendChild(pokemonDiv);
};

/**
 * @function main
 *
 */
const main = () => {
  // [3A] create an empty array of promises called promises
  const promises = [];
  for (let i = 1; i < 151; i++) {
    // [3B] call the fetchPokemonInfo function and push the return value
    // into the array from 3A
    promises.push(fetchPokemonInfo(i));
  }

  // in class, this code wasn't working, so I fixed it to work based
  // on the documentation - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
  Promise.allSettled(promises).then((results) => {
    results
      .filter((result) => result.status === "fulfilled")
      .forEach((fulfilledPromise) =>
        addPokemonToDocument(fulfilledPromise.value)
      );
  });
};

// 4A Invoke the main function
main();
