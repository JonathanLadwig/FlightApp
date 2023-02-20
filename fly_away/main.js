import * as issMod from "./issModule";
import * as mapMod from "./mapModule";
import "./styles.scss";

const flightData = [];
const openskyURL = "https://opensky-network.org/api/states/all";

const map = mapMod.map;

mapMod.drawMap(map);
//mapMod.setMapMarkersOffline();
mapMod.setupMapMarkers();
issMod.createISSMarker(map);
issMod.getISSPos();
issMod.redrawISSMarker();

//Polling
var intervalId = window.setInterval(function () {
  issMod.getISSPos();
  issMod.redrawISSMarker();
}, 2000);
