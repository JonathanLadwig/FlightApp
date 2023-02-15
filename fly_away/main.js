import './styles.scss'
import axios from "axios";

var latitude = 80;
var longitude = 1;
const apiurl = 'https://api.wheretheiss.at/v1/satellites/25544';

axios
.get(apiurl)
// .then((responseJSON) => console.log(responseJSON))
.then((responseJSON) => {
    // for(flights of responseJSON.results){
        latitude = responseJSON.data.latitude;
        longitude = responseJSON.data.longitude;
        console.log(latitude);
        console.log(longitude);
        drawMap(latitude, longitude)
    // }
    // document.getElementById('app').appendChild(flights)
})
// .catch((error) => console.error(error))

function drawMap(latitude, longitude){
    var map = L.map('map').setView([latitude, longitude], 5);

    var marker = L.marker([latitude, longitude]).addTo(map);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

    marker.bindPopup("<b>ISS Location:</b>").openPopup();
}

// var map = L.map('map').setView([latitude, longitude], 13);

// var marker = L.marker([latitude, longitude]).addTo(map);

// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);
