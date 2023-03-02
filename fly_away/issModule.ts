import L, { LatLng } from "leaflet";
import { map } from "./mapModule";
import { issPos$ } from "./observables";

const markerISS = L.marker([0, 0]);

let historyOfPos: L.LatLng[];

//get the history from local storage if it exists otherwise make an empty array
let polyLineStorage = JSON.parse(localStorage.getItem("polyLine") || "");
if (polyLineStorage) {
  historyOfPos = polyLineStorage.filter(
    (latlng: L.LatLng) => latlng.lat && latlng.lng
  ) ?? [];
}
let polyLine: L.Polyline;

//Subscriber that listens to signal from issObs(observable) for a change in position then uses it to set the position of the marker.
issPos$.subscribe((pos) => {
  if (!pos || !pos.latitude || !pos.longitude) return;
  const latiLong = new LatLng(pos.latitude, pos.longitude)
  historyOfPos.push(latiLong);
  markerISS.setLatLng(latiLong);
  localStorage.setItem("polyLine", JSON.stringify(historyOfPos));
  if (polyLine) {
    map.removeLayer(polyLine);
  }
  polyLine = L.polyline(historyOfPos, { color: "red" }).addTo(map);
});

//ISS Marker
function createISSMarker(map: L.Map) {
  markerISS.addTo(map);
  markerISS.on("click", () => flyToISSOnClick());
  markerISS.bindPopup("<b>ISS Location:</b>");
  markerISS.on("mouseover", () => markerISS.openPopup());
  markerISS.on("mouseout", () => markerISS.closePopup());
}

//Fly to ISS Location
function flyToISSOnClick() {
  const latLong = markerISS.getLatLng();
  map.flyTo([latLong.lat, latLong.lng], 8);
}

export { createISSMarker };
