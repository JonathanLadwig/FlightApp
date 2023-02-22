export { createISSMarker };
import { issPos$ } from "./issObs";
import { map } from "./mapModule";

const markerISS = L.marker([0, 0]);

//get the history from local storage if it exists otherwise make an empty array
const historyOfPos =
  JSON.parse(
    localStorage.getItem("polyLine")
    // .filter(
    //   (latlng) => latlng[0] && latlng[1]
  ) ?? [];
let polyLine;

//Subscriber that listens to signal from issObs(observable) for a change in position then uses it to set the position of the marker.
issPos$.subscribe((pos) => {
  if (!pos || !pos.latitude || !pos.longitude) return;
  historyOfPos.push([pos.latitude, pos.longitude]);
  markerISS.setLatLng([pos.latitude, pos.longitude]);
  localStorage.setItem("polyLine", JSON.stringify(historyOfPos));
  if (polyLine) {
    map.removeLayer(polyLine);
  }
  polyLine = L.polyline(historyOfPos, { color: "red" }).addTo(map);
});

//ISS Marker
function createISSMarker(map) {
  markerISS.addTo(map);
  markerISS.on("click", () => flyToISSOnClick(map));
  markerISS.bindPopup("<b>ISS Location:</b>");
  markerISS.on("mouseover", () => markerISS.openPopup());
  markerISS.on("mouseout", () => markerISS.closePopup());
}

//Fly to ISS Location
function flyToISSOnClick() {
  const latLong = markerISS.getLatLng();
  map.flyTo([latLong.lat, latLong.lng], 8);
}
