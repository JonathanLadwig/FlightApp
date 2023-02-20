export { getISSPos, redrawISSMarker, createISSMarker };
import axios from "axios";

const issUrl = "https://api.wheretheiss.at/v1/satellites/25544";
let issLat = 0;
let issLong = 0;
const markerISS = L.marker([issLat, issLong]);

//ISS Marker
function createISSMarker(map) {
  markerISS.addTo(map);
  markerISS.on("click", () => flyToISSOnClick(map));
  markerISS.bindPopup("<b>ISS Location:</b>");
  markerISS.on("mouseover", () => markerISS.openPopup());
  markerISS.on("mouseout", () => markerISS.closePopup());
}

//ISSAPI position
function getISSPos() {
  axios
    .get(issUrl)
    .then((responseJSON) => {
      issLat = responseJSON.data.latitude;
      issLong = responseJSON.data.longitude;
    })
    .catch((error) => console.error(error));
}

//redrawing the ISS
function redrawISSMarker() {
  var latLng = new L.LatLng(issLat, issLong);
  markerISS.setLatLng(latLng);
}

//Fly to ISS Location
function flyToISSOnClick(map) {
  map.flyTo([issLat, issLong], 8);
}
