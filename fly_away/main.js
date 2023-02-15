import './styles.scss'
import axios from "axios";

var latitude = 80;
var longitude = 1;
const apiurl = 'https://api.wheretheiss.at/v1/satellites/25544';
var map = L.map('map', {
    maxZoom: 10,
    minZoom: 2,
    zoomControl: false
});
getPos();
drawMap(latitude,longitude);

//API
function getPos(){
axios
.get(apiurl)
// .then((responseJSON) => console.log(responseJSON))
.then((responseJSON) => {
    // for(flights of responseJSON.results){
        latitude = responseJSON.data.latitude;
        longitude = responseJSON.data.longitude;
        console.log(latitude);
        console.log(longitude);
        // drawMap(latitude, longitude)
    // }
    // document.getElementById('app').appendChild(flights)
})
}
// .catch((error) => console.error(error))

//drawing the map
function drawMap(latitude, longitude){
    map.setView([latitude, longitude], 5);

    var marker = L.marker([latitude, longitude]).addTo(map);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);

    marker.bindPopup("<b>ISS Location:</b>").openPopup();
}

function redrawMap(latitude, longitude){
    map.setView([latitude, longitude], 5);
    marker = L.marker([latitude, longitude]).addTo(map);
}

var intervalId = window.setInterval(function(){
    getPos();
    redrawMap(latitude, longitude);
  }, 10000);