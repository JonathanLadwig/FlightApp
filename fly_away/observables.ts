import { Observable, switchMap, timer } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { concatMap } from "rxjs/operators";
import { IFlight } from "./src/models/IFLight";
import { IFLightAPIResponse } from "./src/models/IFLightAPIReponse";

const issURL = `https://api.wheretheiss.at/v1/satellites/25544`;
const openskyURL = "https://opensky-network.org/api/states/all";

//Totally not a copy of Tim's code ;)
export const issPos$: Observable<L.LatLng> = timer(0, 5000).pipe(
  concatMap(() =>
    fromFetch(issURL).pipe(switchMap((response) => response.json()))
  )
);

//I need to pipe only flight.states through.
// export const flightPositions$: Observable<IFLightAPIResponse[]> = fromFetch(openskyURL).pipe(
export function getFlights(): Observable<IFlight[]> {
  const flights = timer(0, 1000000).pipe(switchMap(() =>
    fetch(openskyURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("OOPS! We seem to have trouble connecting to the API... How embarrising");
        }
        return response.json() as Promise<IFLightAPIResponse>;
      })
      .then((data: IFLightAPIResponse) => {
        const flightStates = data?.states?.filter((state) =>
          !!state[0] &&
          !!state[1] &&
          !!state[2] &&
          !!state[5] &&
          !!state[6] &&
          !!state[7] &&
          state[8] === false &&
          !!state[17]
        ).slice(0, 20) || []
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
  return flights
}





// fromFetch(openskyURL).pipe(
//   switchMap((response) => {
//     //If Reponse IS Successful
//     if (response.ok) {
//       return response.json() as Promise<IFLightAPIResponse>;
//     }
//     //Load Failsafe from LocalStorage 
//     else if (localStorage.getItem("flightInfoStore")) {
//       return of({states: (localStorage.getItem("flightInfoStore"))});
//     }
//     //Return Empty String if the Failsafe is Empty
//     else {
//       const errorObj = { time: '0', states: [] };
//       return (errorObj as IFLightAPIResponse);
//     }
//   }),
//   catchError(() => {
//     // Network or other error, handle appropriately
//     alert(
//       "OOPS! We seem to have trouble connecting to the API... How embarrising"
//     );
//     return of({ time: '0', states: [] } as IFLightAPIResponse);
//   }),


// data$.pipe(map(result => {
//   const flightArray = result.states.map(state => {
//     const flight: IFlight = {
//       icao24: state[0] as string ?? '0', //this
//       callsign: state[1] as string ?? 'Unknown', //this
//       origin: state[2] as string ?? 'Narnia', //this
//       time_pos: state[3] as number ?? 0,
//       last_contact: state[4] as number ?? 0,
//       longitude: state[5] as number ?? 0, //this
//       latitude: state[6] as number ?? 0, //this
//       baro_altitude: state[7] as number ?? 0, //this
//       on_ground: state[8] as boolean ?? true, //this
//       velocity: state[9] as number ?? 0,
//       true_track: state[10] as number ?? 0,
//       vertical_rate: state[11] as number ?? 0,
//       sensors: state[12] as number[] ?? [],
//       geo_altitude: state[13] as number ?? 0,
//       squawk: state[14] as string ?? '0',
//       spi: state[15] as boolean ?? false,
//       position_source: state[16] as number ?? 0,
//       category: state[17] as number ?? 0 //this
//     }
//     return flight;
//   })
//   return flightArray;
// }))
//   .subscribe((flights) => console.log(flights), error => console.error(error))

// export { flightPositions$ };

