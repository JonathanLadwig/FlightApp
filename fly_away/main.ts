import * as flyMod from "./flightModule";
import * as issMod from "./issModule";
import * as mapMod from "./mapModule";

const map = mapMod.map;

mapMod.drawMap(map);
issMod.createISSMarker(map);
flyMod.setFlights();