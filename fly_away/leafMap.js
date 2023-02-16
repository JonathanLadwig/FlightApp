export { drawMap, onClick };
//InitialMap

//CLicking a marker
function onClick() {
  map.setView([latitude, longitude], 2);
}

//drawing the map
function drawMap(latitude, longitude) {
  map.setView([latitude, longitude], 2);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  L.control
    .zoom({
      position: "bottomright",
    })
    .addTo(map);
}
