const slideshow = document.querySelector('.slideshow');

  function stopAtNearestFace() {
    const computedStyle = getComputedStyle(slideshow);
    const matrix = computedStyle.transform;

    if (matrix !== 'none') {
      const values = matrix.split('(')[1].split(')')[0].split(',');
      const a = parseFloat(values[0]);
      const b = parseFloat(values[1]);
      let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

      // Normalize angle to 0, 90, 180, or 270
      angle = Math.round(angle / 90) * 90;

      // Apply the nearest angle
      slideshow.style.transform = `rotateY(${angle}deg)`;
    }

    // Stop the animation
    slideshow.style.animation = 'none';
  }

  // Pause on hover and stop at the nearest face
  slideshow.addEventListener('mouseover', stopAtNearestFace);

  // Optional: Toggle animation on click
  slideshow.addEventListener('click', () => {
    const isRunning = getComputedStyle(slideshow).animation !== 'none';
    slideshow.style.animation = isRunning ? 'none' : 'rotateSlideshow 10s infinite linear';
  });
let mapInitialized = false;

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.7749, lng: -122.4194 }, // Example coordinates
    zoom: 10,
  });
}

function reinitializeMap() {
  if (!mapInitialized) {
    initMap();
    mapInitialized = true;
  }
}

// Reinitialize the map when the slideshow rotates to the map container
document.querySelector(".slideshow").addEventListener("animationiteration", () => {
  const mapContainer = document.querySelector(".map-container");
  const isVisible = mapContainer.getBoundingClientRect().width > 0;

  if (isVisible) {
    reinitializeMap();
  }
});

