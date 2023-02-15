import './styles.scss'
import axios from "axios";
import { latLng } from 'leaflet';

var latitude = 0;
var longitude = 0;
const flightData = [];
const apiurl = 'https://api.wheretheiss.at/v1/satellites/25544';
const openskyURL = 'https://opensky-network.org/api/states/all';

console.log("I am here");
setPos();
setISSPos();
var map = L.map('map', {
    maxZoom: 10,
    minZoom: 2,
    zoomControl: false
});
var marker = L.marker([latitude, longitude]).addTo(map);
drawMap(latitude,longitude);

function setPos(){
axios
.get(openskyURL)
.then((responseJSON) => {
    for (const flight of responseJSON.data.states){
        console.log(responseJSON.data.states[flight]);
        flightData[flight] = responseJSON.data.states[flight];
    }
});
}

//API
function setISSPos(){
axios
.get(apiurl)
// .then((responseJSON) => console.log(responseJSON))
.then((responseJSON) => {
    // for(flights of responseJSON.results){
        latitude = responseJSON.data.latitude;
        longitude = responseJSON.data.longitude;
        // drawMap(latitude, longitude)
    // }
    // document.getElementById('app').appendChild(flights)
});
}
// .catch((error) => console.error(error))

//drawing the map
function drawMap(latitude, longitude){
    map.setView([latitude, longitude], 5);
    marker = L.marker([latitude, longitude]).addTo(map);

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
    var latLng = new L.LatLng(latitude, longitude);
    marker.setLatLng(latLng)
}

var intervalId = window.setInterval(function(){
    setISSPos();
    redrawMap(latitude, longitude);
  }, 1000);