import axios from "axios";
import { backup } from "./flights";
import "./styles.scss";

let issLat = 0;
let issLong = 0;
const flightData = [];
const issUrl = "https://api.wheretheiss.at/v1/satellites/25544";
const openskyURL = "https://opensky-network.org/api/states/all";

const map = L.map("map", {
  maxZoom: 10,
  minZoom: 2,
  zoomControl: false,
});
drawMap();
setMapMarkersOffline();
// setupMapMarkers();
getISSPos();

//ISS Marker
const markerISS = L.marker([issLat, issLong]);
markerISS.addTo(map);
markerISS.on("click", () => flyToISSOnClick());
markerISS.bindPopup("<b>ISS Location:</b>");
// .on("mouseover", openPopup(issLat, issLong));

//Offline
function setMapMarkersOffline() {
  for (let i = 0; i < 20; i++) {
    flightData.push(backup.states[i]);
    if (backup.states[i][6] && backup.states[i][5]) {
      //Add it as a marker
      L.marker([backup.states[i][6], backup.states[i][5]])
        .addTo(map)
        // .on("mouseover", onHover());
        .on("click", () => flyToOnClick(this));

      //Add it as a button to the sidebar
      const flightButt = document.createElement("button");
      flightButt.innerText = `${backup.states[i][1]}`;
      // flightButt.innerHTML = `<button class="flightbutt">${backup.states[i][1]};</button>`;
      flightButt.addEventListener("click", () =>
        getPosFromCallsign(flightButt.innerText)
      );
      document.getElementById("mySidebar").appendChild(flightButt);
    }
  }
}

// OpenSkyAPI IGNORE FOR NOW
function setupMapMarkers() {
  axios.get(openskyURL).then((responseJSON) => {
    for (let i = 0; i < 20; i++) {
      flightData += responseJSON.data.states[i];
    }
  });
}
//IGNORE FOR NOW

//ISSAPI position
function getISSPos() {
  axios.get(issUrl).then((responseJSON) => {
    issLat = responseJSON.data.latitude;
    issLong = responseJSON.data.longitude;
  });
}

//drawing the map
function drawMap() {
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

//redrawing the ISS
function redrawISSMarker(issLat, issLong) {
  var latLng = new L.LatLng(issLat, issLong);
  markerISS.setLatLng(latLng);
}

//Converts callsign into a lat and long for zoom function
function getPosFromCallsign(callsign) {
  console.log(callsign);
  for (let flight of flightData) {
    console.log("next");
    if (flight && flight[1].includes(callsign)) {
      console.log("called");
      zoomIntoFlight(flight[6], flight[5], event);
    } else {
    }
  }
}

//Zooms into map with lat and long on button click
function zoomIntoFlight(latitude, longitude) {
  console.log(latitude);
  map.flyTo([latitude, longitude], 8);
}

//Hovering over a marker will display info about the flight
// function onHover() {
//   marker.bindPopup("<b>Plane:</b>").openPopup();
// }

//CLicking a marker will zoom in on it
function flyToOnClick(latLong) {
  console.log(latLong);
  map.flyTo([issLat, issLong], 8);
}

function flyToISSOnClick() {
  map.flyTo([issLat, issLong], 8);
}

//Polling
var intervalId = window.setInterval(function () {
  getISSPos();
  redrawISSMarker(issLat, issLong);
}, 5000);
