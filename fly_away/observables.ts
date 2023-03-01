import { Observable, timer } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { concatMap, switchMap } from "rxjs/operators";
import { IFlight, IFLightAPIResponse } from "./src/models/IFlight";

const issURL = `https://api.wheretheiss.at/v1/satellites/25544`;
const openskyURL = "https://opensky-network.org/api/states/all";

//Totally not a copy of Tim's code ;)
export const issPos$: Observable<L.LatLng> = timer(0, 5000).pipe(
  concatMap(() =>
    fromFetch(issURL).pipe(switchMap((response) => response.json()))
  )
);

export const flightPositions$: Observable<IFlight[]> =
  // export function getFlights(): Observable<IFlight[]> {
  timer(0, 100000000).pipe(switchMap(() =>
    fetch(openskyURL)
      .then((response) => {
        if (!response.ok) {
          if (localStorage.getItem("flightInfoStore")) {

          } else {
            throw new Error("OOPS! We seem to have trouble connecting to the API... How embarrising");
          }
        }
        return response.json() as Promise<IFLightAPIResponse>;
      })
      .then((data: IFLightAPIResponse) => {
        const flightStates = data?.states?.filter((state) =>
          state &&
          !!state[0]
          //&&
          // !!state[1] &&
          // !!state[2] &&
          // !!state[5] &&
          // !!state[6] &&
          // !!state[7] &&
          // state[8] === false &&
          // !!state[17]
        ).slice(0, 20) || [];
        console.log("FLightstates: " + flightStates);
        return flightStates.map(state => (
          {
            icao24: state[0] as string, //this
            callsign: state[1] as string, //this
            origin: state[2] as string, //this
            longitude: state[5] as number, //this
            latitude: state[6] as number, //this
            baro_altitude: state[7] as number, //this
            on_ground: state[8] as boolean, //this
            category: state[17] as number //this
          } as IFlight
        ))
      }
      ).catch((err) => {
        console.error(err)
        throw new Error(err.toString())
      })
  ))

