let imagesLoaded = 0;
let presses = 0;

const carousel = document.getElementById("carousel");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");

const onLoad = () => {
  imagesLoaded++;

  if (imagesLoaded === 5) {
    carousel.classList.remove("loading");

    // Remove load event listeners
    const images = document.querySelectorAll("#carousel img");
    images.forEach((img) => {
      img.removeEventListener("load", onLoad);
    });
  }
};

// Add event listeners for image load
const imageSources = [
  "https://placekitten.com/200/200",
  "https://placekitten.com/201/200",
  "https://placekitten.com/202/200",
  "https://placekitten.com/203/200",
  "https://placekitten.com/204/200"
];

for (let i = 0; i < imageSources.length; i++) {
  const img = document.createElement("img");
  img.src = imageSources[i];
  img.addEventListener("load", onLoad);
  carousel.appendChild(img);
}

// Add event listeners for previous and next buttons
previousButton.addEventListener("click", () => {
  if (presses > 0) {
    presses--;
    calculateTransforms(presses);
  }
});

nextButton.addEventListener("click", () => {
  if (presses < 3) {
    presses++;
    calculateTransforms(presses);
  }
});

const calculateTransforms = (presses) => {
  let value = presses * -200;
  carousel.style.transform = `translateX(${value}px)`;
};
