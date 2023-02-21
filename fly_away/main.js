import * as issMod from "./issModule";
import * as mapMod from "./mapModule";
import "./styles.scss";

const map = mapMod.map;

mapMod.drawMap(map);
//mapMod.setupMapMarkers();
mapMod.setMapMarkersOffline();
issMod.createISSMarker(map);
