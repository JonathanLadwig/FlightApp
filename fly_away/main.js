import axios from "axios";
import { backup } from "./flights";
import "./styles.scss";

let issLat = 0;
let issLong = 0;
const flightData = [];
const issUrl = "https://api.wheretheiss.at/v1/satellites/25544";
const openskyURL = "https://opensky-network.org/api/states/all";
const markers = [];

const map = L.map("map", {
  maxZoom: 10,
  minZoom: 2,
  zoomControl: false,
});

drawMap();
//setMapMarkersOffline();
setupMapMarkers();
getISSPos();

//ISS Marker
const markerISS = L.marker([issLat, issLong]);
markerISS.addTo(map);
markerISS.on("click", () => flyToISSOnClick());
markerISS.bindPopup("<b>ISS Location:</b>");
markerISS.on("mouseover", () => markerISS.openPopup());
markerISS.on("mouseout", () => markerISS.closePopup());

redrawISSMarker(issLat, issLong);

//Offline
function setMapMarkersOffline() {
  for (let i = 0; i < 20; i++) {
    flightData.push(backup.states[i]);
    if (backup.states[i][6] && backup.states[i][5]) {
      //Add it as a marker
      markers.push(
        L.marker([backup.states[i][6], backup.states[i][5]])
          .addTo(map)
          .bindPopup(
            `Callsign: ${backup.states[i][1]} <br/> Country:${backup.states[i][2]}}`
          )
          .on("mouseover", () => markers[i].openPopup())
          .on("mouseout", () => markers[i].closePopup())
          .on("click", () =>
            flyToOnClick(backup.states[i][6], backup.states[i][5], markers[i])
          )
      );

      //Add it as a button to the sidebar
      const flightButt = document.createElement("button");
      flightButt.innerText = `${backup.states[i][1]}`;
      flightButt.addEventListener("click", () =>
        getPosFromCallsign(flightButt.innerText)
      );
      document.getElementById("mySidebar").appendChild(flightButt);
    }
  }
}

// OpenSkyAPI
function setupMapMarkers() {
  axios
    .get(openskyURL)
    .then((responseJSON) => {
      for (let i = 0; i < 20; i++) {
        flightData.push(responseJSON.data.states[i]);
        if (flightData[i][6] && flightData[i][5]) {
          //Add it as a marker
          markers.push(
            L.marker([flightData[i][6], flightData[i][5]])
              .addTo(map)
              .bindPopup(
                `Callsign: ${flightData[i][1]} <br/> Origin:${flightData[i][2]}`
              )
              .on("mouseover", () => markers[i].openPopup())
              .on("mouseout", () => markers[i].closePopup())
              .on("click", () =>
                flyToOnClick(flightData[i][6], flightData[i][5], markers[i])
              )
          );

          //Add it as a button to the sidebar
          const flightButt = document.createElement("button");
          flightButt.innerText = `${flightData[i][1]}`;
          flightButt.addEventListener("click", () =>
            getPosFromCallsign(flightButt.innerText)
          );
          document.getElementById("mySidebar").appendChild(flightButt);
        }
      }
    })
    .catch((error) => console.error(error));
}

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

//Fly to ISS Location
function flyToISSOnClick() {
  map.flyTo([issLat, issLong], 8);
}

//Polling
var intervalId = window.setInterval(function () {
  getISSPos();
  redrawISSMarker(issLat, issLong);
}, 2000);
