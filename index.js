// Attach initMap to the global window object
window.initMap = function () {
  const dublin = { lat: 53.3498, lng: -6.2603 };

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: dublin,
  });

  // Marker 1: Rathmines
  const rathmines = { lat: 53.3244, lng: -6.2659 };
  const marker1 = new google.maps.Marker({
    position: rathmines,
    map: map,
    title: "Rathmines",
  });

  const info1 = new google.maps.InfoWindow({
    content: "<strong>Rathmines</strong><br>This map will be open to the public @ Wednesday next week.",
  });

  marker1.addListener("click", () => {
    info1.open(map, marker1);
  });

  // Marker 2: Howth Cliff Walk
  const howthCliffWalk = { lat: 53.168368, lng: -6.078819 };
  const marker2 = new google.maps.Marker({
    position: howthCliffWalk,
    map: map,
    title: "Howth Cliff Walk",
  });

  const info2 = new google.maps.InfoWindow({
    content: "<strong>Howth Cliff Walk</strong><br>Sluice valves are commonly used in water and sewer treatment systems, and they are known for their ability to shut off fluid flow entirely in emergencies.",
  });

  marker2.addListener("click", () => {
    info2.open(map, marker2);
  });

  // Marker 3: Navan
  const navan = { lat: 53.653096, lng: -6.684006 };
  const marker3 = new google.maps.Marker({
    position: navan,
    map: map,
    title: "Navan",
  });

  const info3 = new google.maps.InfoWindow({
    content: "<strong>Navan</strong><br>I grew up here. I'm trying to reconnect with our land. I want you to find a location, a dream, a place, a memory, and mark it when that day comes.",
  });

  marker3.addListener("click", () => {
    info3.open(map, marker3);
  });
};

