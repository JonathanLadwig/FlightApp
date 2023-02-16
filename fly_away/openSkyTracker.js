export { setPos };
import axios from "axios";

const openskyURL = "https://opensky-network.org/api/states/all";

// OpenSkyAPI
function setPos() {
  axios.get(openskyURL).then((responseJSON) => {
    for (var i = 0; i < 20; i++) {
      if (
        responseJSON.data.states[i][6] !== null &&
        responseJSON.data.states[i][5] !== null
      ) {
        //Add it as a marker
        L.marker([
          responseJSON.data.states[i][6],
          responseJSON.data.states[i][5],
        ])
          .addTo(map)
          .on("mouseover", onClick);

        //Add it as a button to the sidebar
        const flightbutt = document.createElement("button");
        flightbutt.innerHTML = `<button>${responseJSON.data.states[i][1]}</button>`;
        document.getElementById("mySidebar").appendChild(flightbutt);
      }
    }
  });
}
