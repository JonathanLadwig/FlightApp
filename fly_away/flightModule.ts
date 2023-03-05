import L from "leaflet";
import { map } from "./mapModule";
import { flightPositions$ } from "./observables";
import { IFlight } from "./src/models/IFlight";
import { IFlightMarker } from "./src/models/IFlightMarker";

const buttList = document.getElementById("buttList");
let flightMarkers: IFlightMarker[];

//OpenSkyAPI Subscriber
export function setFlights() {
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
}

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
    flightButt.innerText = `${flight.callsign}`;
    flightButt.addEventListener("click", () =>
        getPosFromCallsign(flightButt.innerText)
    );
    if (buttList) buttList.appendChild(flightButt);
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