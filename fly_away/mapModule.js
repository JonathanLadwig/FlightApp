import { flightPositions$ } from "./observables";

let markers = [];
let flightData = [];

//Initialising the leaflet map
export const map = L.map("map", {
  maxZoom: 10,
  minZoom: 2,
  zoomControl: false,
});

//OpenSkyAPI Subscriber
flightPositions$.subscribe((flights) => {
  //Janky failsafe but it works!
  if (flights === "f") {
    flights = JSON.parse(localStorage.getItem("flightInfoStore"));
  }
  markers = [];
  console.log(flights);
  document.getElementById("buttList").innerHTML = ``;
  flightData = flights.states
    ?.filter(
      (flight) => flight && flight[6] && flight[5] && flight[1] && flight[2]
    )
    .slice(0, 20);
  for (let flight of flightData) {
    //Add it as a marker
    setFlightMarkers(flight, flight.index);
    //Add it as a button
    createNewFlightButt(flight);
  }
  //Store it as local storage
  localStorage.setItem("flightInfoStore", JSON.stringify(flights));
});

//Flight Markers
function setFlightMarkers(flight, i) {
  markers.push(
    L.marker([flight[6], flight[5]])
      .addTo(map)
      .bindPopup(`Callsign: ${flight[1]} <br/> Origin:${flight[2]}`)
      .on("mouseover", () => markers[i].openPopup())
      .on("mouseout", () => markers[i].closePopup())
      .on("click", () => flyToOnClick(flight[6], flight[5], markers[i]))
  );
}

//Add Flight as Button to Sidebar
function createNewFlightButt(flight) {
  const flightButt = document.createElement("button");
  flightButt.innerText = `${flight[1]}`;
  flightButt.addEventListener("click", () =>
    getPosFromCallsign(flightButt.innerText, map)
  );
  document.getElementById("buttList").appendChild(flightButt);
}

//drawing the map
function drawMap(map) {
  map.setView([0, 0], 2);

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

//Converts callsign into a lat and long for zoom function
function getPosFromCallsign(callsign) {
  for (let flight of flightData) {
    if (flight && flight[1].includes(callsign)) {
      flyToOnClick(flight[6], flight[5]);
    }
  }
}

//CLicking a marker or button will zoom in on it
function flyToOnClick(lat, long) {
  map.flyTo([lat, long], 8);
}

export { drawMap, getPosFromCallsign, flyToOnClick };
