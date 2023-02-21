export {
  setupMapMarkers,
  setMapMarkersOffline,
  drawMap,
  getPosFromCallsign,
  flyToOnClick,
};
import axios from "axios";
import { backup } from "./flights";

const openskyURL = "https://opensky-network.org/api/states/all";
const markers = [];
const flightData = [];

//Initialising the leaflet map
export const map = L.map("map", {
  maxZoom: 10,
  minZoom: 2,
  zoomControl: false,
});

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
            `Callsign: ${backup.states[i][1]} <br/> Origin:${backup.states[i][2]}`
          )
          .on("mouseover", () => markers[i].openPopup())
          .on("mouseout", () => markers[i].closePopup())
          .on("click", () =>
            flyToOnClick(backup.states[i][6], backup.states[i][5])
          )
      );

      //Add it as a button to the sidebar
      const flightButt = document.createElement("button");
      flightButt.innerText = `${backup.states[i][1]}`;
      flightButt.addEventListener("click", () =>
        getPosFromCallsign(flightButt.innerText, map)
      );
      document.getElementById("mySidebar").appendChild(flightButt);
    }
  }
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
