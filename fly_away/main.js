import * as issMod from "./issModule";
import * as mapMod from "./mapModule";
import "./styles.scss";

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
