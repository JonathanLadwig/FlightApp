import { timer } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { concatMap, switchMap } from "rxjs/operators";

const issURL = `https://api.wheretheiss.at/v1/satellites/25544`;
const openskyURL =
  "https://opensky-network.org/api/states/all?offset=0&limit=30";

//Totally not a copy of Tim's code ;)
export const issPos$ = timer(0, 5000).pipe(
  concatMap(() =>
    fromFetch(issURL).pipe(switchMap((response) => response.json()))
  )
);

export const flightPositions$ = timer(0, 100000).pipe(
  concatMap(() =>
    fromFetch(openskyURL).pipe(switchMap((response) => response.json()))
  )
);
