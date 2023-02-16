import * as iss from "./issTracker";
import * as leaf from "./leafMap.js";
import * as openSky from "./openSkyTracker.js";
import "./styles.scss";

var latitude = 0;
var longitude = 0;

var map = L.map("map", {
  maxZoom: 10,
  minZoom: 2,
  zoomControl: false,
});

openSky.setPos();
iss.setISSPos();

leaf.drawMap(latitude, longitude);

//ISSMarker
var markerISS = L.marker([latitude, longitude])
  .addTo(map)
  .on("mouseover", onClick);
markerISS.bindPopup("<b>ISS Location:</b>").openPopup();

var intervalId = window.setInterval(function () {
  iss.setISSPos();
  iss.redrawMap(latitude, longitude);
}, 10000);
