import * as lookup from 'country-code-lookup';
import L from "leaflet";
import { flightPositions$ } from "./observables";
import { IFlight, IFlightMarker } from "./src/models/IFlight";

const buttList = document.getElementById("buttList");
let flightMarkers: IFlightMarker[];
let selectedFlight: IFlightMarker;

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
    .on("click", () => flyToOnClick(flight.latitude, flight.longitude))
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

function removeLowerCase(str: string): string {
  let pattern = new RegExp("[a-z]", 'g');
  str = str.replace(pattern, "");
  return str.replace(" ", "");
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
      flyToOnClick(flight.plane.latitude, flight.plane.longitude);
    }
  }
}

//CLicking a marker or button will zoom in on it
function flyToOnClick(lat: number, long: number) {
  map.flyTo([lat, long], 8);
}

function getAircraftType(typeNum: number): L.DivIcon {
  const aircraftIcon = new L.DivIcon({
    iconUrl: "./images/planeicon.png",
    iconRetinaUrl: "./images/planeicon.png",
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowUrl: './images/planeicon.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
  });
  //Map it to an enum instead maybe?
  switch (typeNum) {
    case 1:
      console.log("No ADS-B Emitter Category Information.");
      break;
    case 2:
      console.log("Light.");
      break;
    case 3:
      console.log("Small.");
      break;
    case 4:
      console.log("Large");
      break;
    case 5:
      console.log("High Vortex Large.");
      break;
    case 6:
      console.log("Heavy.");
      break;
    case 7:
      console.log("High Performance.");
      break;
    case 8:
      console.log("Rotorcraft.");
      break;
    case 9:
      console.log("Glider.");
      break;
    case 10:
      console.log("Blimp.");
      break;
    case 11:
      console.log("Parachutist.");
      break;
    case 12:
      console.log("Ultralight.");
      break;
    case 13:
      console.log("Reserved.");
      break;
    case 14:
      console.log("UAV.");
      break;
    case 15:
      console.log("Spacecraft.");
      break;
    case 16:
      console.log("Emergency Vehicle.");
      break;
    case 17:
      console.log("Service Vehicle.");
      break;
    case 18:
      console.log("Point Obstacle Vehicle.");
      break;
    case 19:
      console.log("Cluster Obstacle.");
      break;
    case 20:
      console.log("Line Obstacle.");
      break;
    default:
      console.log("No info");
      break;
  }
  return aircraftIcon;
}

export { drawMap, getPosFromCallsign, flyToOnClick };
