import './styles.scss'
import axios from "axios";
import { latLng } from 'leaflet';

var latitude = 0;
var longitude = 0;
const flightData = [];
const apiurl = 'https://api.wheretheiss.at/v1/satellites/25544';
const openskyURL = 'https://opensky-network.org/api/states/all';

//setPos();
setISSPos();

var map = L.map('map', {
    maxZoom: 10,
    minZoom: 2,
    zoomControl: false
});
drawMap(latitude,longitude);
var markerISS = L.marker([latitude, longitude]).addTo(map).on('mouseover', onClick);
markerISS.bindPopup("<b>ISS Location:</b>").openPopup();

// OpenSkyAPI
function setPos(){
axios
.get(openskyURL)
.then((responseJSON) => {
    // for (const flight of responseJSON.data.states){
    //     console.log(responseJSON.data.states[flight]);
    //     flightData[flight] = responseJSON.data.states[flight];
    // }
    for (var i = 0; i < 20; i++) {
        console.log(responseJSON.data.states[i]);
        flightData[i] = responseJSON.data.states[i];
        marker = new L.marker([flightData[i].latitude, flightData[i].longitude])
        .bindPopup(locations[i][0])
        .addTo(map);
    }
});
}

//ISSAPI
function setISSPos(){
axios
.get(apiurl)
.then((responseJSON) => {
        latitude = responseJSON.data.latitude;
        longitude = responseJSON.data.longitude;
});
}

//drawing the map
function drawMap(latitude, longitude){
    map.setView([latitude, longitude], 2);
    //markerISS = L.marker([latitude, longitude]).addTo(map);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);
}

//redrawing the ISS
function redrawMap(latitude, longitude){
    //map.setView([latitude, longitude], 5);
    var latLng = new L.LatLng(latitude, longitude);
    markerISS.setLatLng(latLng)
}

//CLicking a marker
function onClick(){
    map.setView([latitude, longitude], 5); 
}

var intervalId = window.setInterval(function(){
    setISSPos();
    redrawMap(latitude, longitude);
  }, 1000);