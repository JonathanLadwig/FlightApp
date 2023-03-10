import { Observable, timer } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { concatMap, switchMap } from "rxjs/operators";
import { IFlight } from "./src/models/IFlight";
import { IFLightAPIResponse } from "./src/models/IFlightAPIResponse";
import { IISSAPIResponse } from "./src/models/IISSResponse";

const issURL = `https://api.wheretheiss.at/v1/satellites/25544`;
const openskyURL = "https://opensky-network.org/api/states/all";

//Totally not a copy of Tim's code ;)
export const issPos$: Observable<IISSAPIResponse> = timer(0, 5000).pipe(
  concatMap(() =>
    fromFetch(issURL).pipe(switchMap((response) => response.json() as Promise<IISSAPIResponse>))
  )
);

//Takes the API call if successful and converts it to type of IFLight, checking if the data that we use is there. 
//If it fails it will look for a backup. 
//If no backup is avaliable it will throw an error.
export const flightPositions$: Observable<IFlight[]> =
  timer(0, 100000000).pipe(switchMap(() =>
    fetch(openskyURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Cannot connect to the API Server");
        }
        return response.json() as Promise<IFLightAPIResponse>;
      })
      .then((data: IFLightAPIResponse) => {
        const flightStates = data?.states?.filter((state) =>
          state &&
          !!state[0] &&
          !!state[1] &&
          !!state[2] &&
          !!state[5] &&
          !!state[6] &&
          !!state[7] &&
          state[8] === false
        ).slice(0, 20) || [];
        return flightStates.map(state => (
          {
            icao24: state[0] as string,
            callsign: state[1] as string,
            origin: state[2] as string,
            longitude: state[5] as number,
            latitude: state[6] as number,
            baro_altitude: state[7] as number,
            on_ground: state[8] as boolean,
            category: state[17] as number
          } as IFlight
        ))
      }
      ).catch((err) => {
        if (localStorage.getItem("flightInfoStore")) {
          const localStore = localStorage.getItem("flightInfoStore");
          return JSON.parse(localStore || "") as unknown as Promise<IFlight[]>
        } else {
          console.error(err);
          alert("OOPS! We seem to have trouble connecting to the API... How embarrising");
          throw new Error(err.toString())
        }
      })
  ))

