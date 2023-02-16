export { setISSPos, redrawMap };
import axios from "axios";

var latLng;
const apiurl = "https://api.wheretheiss.at/v1/satellites/25544";

//ISSAPI
function setISSPos() {
  axios.get(apiurl).then((responseJSON) => {
    latitude = responseJSON.data.latitude;
    longitude = responseJSON.data.longitude;
  });
}

//redrawing the ISS
function redrawMap(latitude, longitude) {
  latLng = new L.LatLng(latitude, longitude);
  markerISS.setLatLng(latLng);
}
