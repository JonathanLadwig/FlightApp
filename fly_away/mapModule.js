export {
  setupMapMarkers,
  setMapMarkersOffline,
  drawMap,
  getPosFromCallsign,
  flyToOnClick,
};
import axios from "axios";
import { backup } from "./flights";
import { flightPositions$ } from "./issObs";

const openskyURL = "https://opensky-network.org/api/states/all?";
const markers = [];
const flightData = [];

//Initialising the leaflet map
export const map = L.map("map", {
  maxZoom: 10,
  minZoom: 2,
  zoomControl: false,
});

//OpenSkyAPI Subscriber
flightPositions$.subscribe((flightPos) => {
  let failedCount = 0;
  for (let i = 0; i < 20; i++) {
    console.log("i=" + i);
    //GUARD CLAUSE
    if (
      !flightPos.states[i] ||
      !flightPos.states[i][6] ||
      !flightPos.states[i][5] ||
      !flightPos.states[i][1] ||
      !flightPos.states[i][2]
    ) {
      failedCount += 1;
      console.log("Failed:" + failedCount);
      continue;
    } else {
      console.log(flightPos.states[i][6]);
      console.log(flightPos.states[i][5]);
      //Add it to flight data
      flightData.push(flightPos.states[i]);
      //Add it to local storage
      localStorage.setItem("flightInfoStore", JSON.stringify(flightData));
      //Add it as a marker
      setFlightMarkers(i - failedCount);
      //Add it as a button
      createNewFlightButt(i - failedCount);
    }
  }
});

// OpenSkyAPI
function setupMapMarkers() {
  axios
    .get(openskyURL)
    .then((responseJSON) => {
      for (let i = 0; i < 20; i++) {
        if (responseJSON.data[i][6] && responseJSON.data[i][5]) {
          flightData.push(responseJSON.data[i]);
          localStorage.setItem("flightInfoStore", JSON.stringify(flightData));
          //Add it as a marker
          setFlightMarkers(i);
          //Add it as a button
          createNewFlightButt(i);
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
      setFlightMarkers(i);
      //Add it as a button
      createNewFlightButt(i);
    }
  }
}

//Flight Markers
function setFlightMarkers(i) {
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
}

//Add Flight as Button to Sidebar
function createNewFlightButt(i) {
  const flightButt = document.createElement("button");
  flightButt.innerText = `${backup.states[i][1]}`;
  flightButt.addEventListener("click", () =>
    getPosFromCallsign(flightButt.innerText, map)
  );
  document.getElementById("mySidebar").appendChild(flightButt);
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
