import L from "leaflet";
import { flightPositions$ } from "./observables";
import { IFlight } from "./src/models/IFlight";

let markers: L.Marker[];
let flightData: IFlight[];
const buttList = document.getElementById("buttList");

//Initialising the leaflet map
export const map = L.map("map", {
  maxZoom: 10,
  minZoom: 2,
  zoomControl: false,
});

//OpenSkyAPI Subscriber
flightPositions$.subscribe((flights) => {
  markers = [];
  console.log(flights);
  if (buttList) {
    buttList.innerHTML = ``;
  }
  flightData = flights
    ?.filter(
      (flight: IFlight) => flight && flight.latitude && flight.longitude && flight.callsign && flight.origin
    )
    .slice(0, 20);
  let loopCounter: number = 0;
  for (let flight of flightData) {
    //Add it as a marker
    setFlightMarkers(flight, loopCounter);
    //Add it as a button
    createNewFlightButt(flight);
  }
  //Store it as local storage
  localStorage.setItem("flightInfoStore", JSON.stringify(flights));
});

//Flight Markers
function setFlightMarkers(flight: IFlight, i: number) {
  markers.push(
    L.marker([flight.latitude, flight.longitude])
      .addTo(map)
      .bindPopup(`Callsign: ${flight.callsign} <br/> Origin:${flight.origin}`)
      .on("mouseover", () => markers[i].openPopup())
      .on("mouseout", () => markers[i].closePopup())
      .on("click", () => flyToOnClick(flight.latitude, flight.longitude))
  );
}

//Add Flight as Button to Sidebar
function createNewFlightButt(flight: IFlight) {
  const flightButt = document.createElement("button");
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
  for (let flight of flightData) {
    if (flight && flight.callsign.includes(callsign)) {
      flyToOnClick(flight.latitude, flight.longitude);
    }
  }
}

//CLicking a marker or button will zoom in on it
function flyToOnClick(lat: number, long: number) {
  map.flyTo([lat, long], 8);
}

function getAircraftType(typeNum: number) {
  //Map it to an enum instead
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
}

export { drawMap, getPosFromCallsign, flyToOnClick };
