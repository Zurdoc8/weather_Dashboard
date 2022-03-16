const apiKey = '946994a2a1dc51e7beeabccea231123e';

const cityElm = $('h2#city');
const dateElm = $('h3#date');
const temperatureElm = $('span#temperature');
const humidityElm = $('span#humidity');
const windElm = $('span#wind');
const uvIndexElm = $('span#uv-index');
const weatherIconElm = $('img#weather-icon');
const cityListElm = $('div.recentList');

const cityInput = $('#city-sel');

let recentCities = [];

function loadCities() {
    const storedCities = JSON.parse(localStorage.getItem(recentCities));
    if (storedCities) {
        recentCities = storedCities;
    }
}

function storedCities() {
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
}

