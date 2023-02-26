import { flightPositions$ } from "./observables";

let markers = [];
let flightData = JSON.parse(localStorage.getItem("flightInfoStore"));

//Initialising the leaflet map
export const map = L.map("map", {
  maxZoom: 10,
  minZoom: 2,
  zoomControl: false,
});

//FlightDataOffline
function offlineFlightData() {
  let count = 0;
  flightData = [];
  markers = [];
  for (let flight of flightData) {
    //GUARD CLAUSE
    if (!flight || !flight[6] || !flight[5] || !flight[1] || !flight[2])
      continue;
    //Add it to flight data
    flightData.push(flight);
    //Add it as a marker
    setFlightMarkers(flight, count);
    //Add it as a button
    createNewFlightButt(flight);

    if (count == 19) {
      break;
    }
  }
}

//OpenSkyAPI Subscriber
flightPositions$.subscribe((flights) => {
  let count = 0;
  flightData = [];
  markers = [];
  document.getElementById("buttList").innerHTML = ``;
  for (let flight of flights.states) {
    //GUARD CLAUSE
    if (!flight || !flight[6] || !flight[5] || !flight[1] || !flight[2])
      continue;
    //Add it to flight data
    flightData.push(flight);
    //Add it to local storage
    localStorage.setItem("flightInfoStore", JSON.stringify(flightData));
    //Add it as a marker
    setFlightMarkers(flight, count);
    //Add it as a button
    createNewFlightButt(flight);

    count += 1;

    if (count == 19) {
      break;
    }
  }
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

export { drawMap, getPosFromCallsign, flyToOnClick, offlineFlightData };
