import * as lookup from 'country-code-lookup';
import L from "leaflet";
import { flightPositions$ } from "./observables";
import { IFlight, IFlightMarker } from "./src/models/IFlight";

const buttList = document.getElementById("buttList");
let flightMarkers: IFlightMarker[];

//Initialising the leaflet map
export const map = L.map("map", {
  maxZoom: 10,
  minZoom: 2,
  zoomControl: false,
});

//OpenSkyAPI Subscriber
flightPositions$.subscribe((flights) => {
  flightMarkers = [];
  if (buttList) {
    buttList.innerHTML = ``;
  }
  let loopCounter: number = 0;
  for (let flight of flights) {
    //Add it as a marker
    setFlightMarkers(flight, loopCounter);
    //Add it as a button
    createNewFlightButt(flight);
    //Loop Counter
    loopCounter++;
  }
  //Store it as local storage
  if (flights) localStorage.setItem("flightInfoStore", JSON.stringify(flights));
});

//Flight Markers
function setFlightMarkers(flight: IFlight, i: number) {
  const marker: L.Marker = new L.Marker([flight.latitude, flight.longitude]);
  const flightMarker: IFlightMarker = { planeMarker: marker, plane: flight };
  flightMarker.planeMarker.addTo(map)
    .bindPopup(`Callsign: ${flight.callsign} <br/> Origin: ${flight.origin} <br/> Baro-Altitude: ${Math.round(flight.baro_altitude / 10) / 100}km`)
    .on("mouseover", () => flightMarkers[i].planeMarker.openPopup())
    .on("mouseout", () => flightMarkers[i].planeMarker.closePopup())
    .on("click", () => flyTo(flightMarkers[i]))
  flightMarkers.push(flightMarker);
}

//Add Flight as Button to Sidebar
function createNewFlightButt(flight: IFlight) {
  const flightButt = document.createElement("button");
  const country = lookup.byCountry(flight.origin);
  flightButt.innerText = `${flight.callsign}`;
  flightButt.addEventListener("click", () =>
    getPosFromCallsign(flightButt.innerText)
  );
  if (buttList) buttList.appendChild(flightButt);
}

//drawing the map
function drawMap(map: L.Map) {
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
function getPosFromCallsign(callsign: string) {
  for (let flight of flightMarkers) {
    if (flight && flight.plane.callsign.includes(callsign)) {
      flyTo(flight);
    }
  }
}
//CLicking a marker or button will zoom in on it and open the popup
function flyTo(flight: IFlightMarker) {
  map.flyTo([flight.plane.latitude, flight.plane.longitude], 8);
  flight.planeMarker.openPopup();
}

export { drawMap, getPosFromCallsign };

