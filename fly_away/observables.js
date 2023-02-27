import { catchError, of, timer } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { concatMap, switchMap } from "rxjs/operators";

const issURL = `https://api.wheretheiss.at/v1/satellites/25544`;
const openskyURL = "https://opensky-network.org/api/states/all";

//Totally not a copy of Tim's code ;)
export const issPos$ = timer(0, 5000).pipe(
  concatMap(() =>
    fromFetch(issURL).pipe(switchMap((response) => response.json()))
  )
);

export const flightPositions$ = fromFetch(openskyURL).pipe(
  switchMap((response) => {
    if (response.ok) {
      // OK return data
      console.log("All Good");
      return response.json();
    } else if (localStorage.getItem("flightInfoStore")) {
      console.log("Failsafe");
      return of("f");
    } else {
      // Server is returning a status requiring the client to try something else.
      console.log("Error");
      alert(
        "OOPS! We seem to have trouble connecting to the API... How embarrising"
      );
      return of({ error: true, message: `Error ${response.status}` });
    }
  }),
  catchError((err) => {
    // Network or other error, handle appropriately
    console.error("The error is" + err);
    return of({ error: true, message: err.message });
  })
);
