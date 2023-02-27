import { catchError, Observable, of, timer } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { concatMap, switchMap } from "rxjs/operators";
import { IFlight } from "./src/models/IFlight";

const issURL = `https://api.wheretheiss.at/v1/satellites/25544`;
const openskyURL = "https://opensky-network.org/api/states/all";

//Totally not a copy of Tim's code ;)
export const issPos$: Observable<L.LatLng> = timer(0, 5000).pipe(
  concatMap(() =>
    fromFetch(issURL).pipe(switchMap((response) => response.json()))
  )
);

export const flightPositions$: Observable<IFlight[]> = fromFetch(openskyURL).pipe(
  switchMap((response) => {
    //Function that maps and adds in data
    //If Reponse IS Successful
    if (response.ok) {
      return response.json();
    }
    //Load Failsafe from LocalStorage 
    else if (localStorage.getItem("flightInfoStore")) {
      return of(localStorage.getItem("flightInfoStore"));
    }
    //Return Empty String if the Failsafe is Empty
    else {
      return of([]);
    }
  }),
  catchError((err) => {
    // Network or other error, handle appropriately
    alert(
      "OOPS! We seem to have trouble connecting to the API... How embarrising"
    );
    console.error("The error is" + err);
    return of([]);
  })
);
