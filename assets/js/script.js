    const apiKey = '946994a2a1dc51e7beeabccea231123e';

    var userInputElm = document.querySelector ('#search-btn');
    var cityElm = document.querySelector ('#city');
    var dateElm = document.querySelector ('#date');
    var temperatureElm = document.querySelector ('#temperature');
    var humidityElm = document.querySelector ('#humidity');
    var windElm = document.querySelector ('#wind');
    var uvIndexElm = document.querySelector ('#uv-index');
    var weatherIconElm = document.querySelector ('#weather-icon');
    var cityListElm = document.querySelector ('.recentList');
    var cityInput = document.querySelector ('#city-sel');
    let recentCities = [];


    function compare(a, b) {
        // Use toUpperCase() to ignore character casing
        const cityA = a.city.toUpperCase();
        const cityB = b.city.toUpperCase();
 
        let comparison = 0;
        if (cityA > cityB) {
            comparison = 1;
        } else if (cityA < cityB) {
            comparison = -1;
        }
        return comparison;
    }
 
    function loadCities() {
        const storedCities = JSON.parse(localStorage.getItem(recentCities));
        if (storedCities) {
            recentCities = storedCities;
        }
    }

    function storedCities() {
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
    }

    // function displayCities(recentCities) {
    //     cityListElm.empty();
    //     recentCities.splice(5);
    //     let sortedCities = [...recentCities];
    //     sortedCities.sort(compare);
    //     sortedCities.forEach(function (location) {
    //         let cityDiv = $('<div>').addClass('col-12 city');
    //         let cityBtn = $('<button>').addClass('btn btn-light city-btn').text(location.city);
    //         cityDiv.append(cityBtn);
    //         cityListElm.append(cityDiv);
    //     });
    // }

    function detUVIndexHue(uvi) {
        if (uvi < 3) {
            return 'green';
        } else if (uvi >= 3 && uvi < 6) {
            return 'yellow';
        } else if (uvi >= 6 && uvi < 8) {
            return 'orange';
        } else if (uvi >= 8 && uvi < 11) {
            return 'red';
        } else return 'purple';
    }

    var citySearchInput = function (){       
        var city = cityInput.value.trim();
        if (city) {
            getLatLon(city)
            //displayCities(city)
        } else {
            cityElm.textContent = "Error: Unknown City";
        }
    };

function getLatLon (city) {
    $.ajax({
        type:"GET",
        url:"https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metricl&appid="+apiKey,
        async:true,
        dataType: "json",
        success: (json) => {
            getLatLon.json = json;
            getWeather(json.coord);
            var Date = moment(json.dt * 1000).format('MM-DD-YYYY');
            var disCity = json.name;
            cityElm.textContent = disCity + " (" + Date + ")";
        },
        warn: function(err) {
            console.log(err);
        }
    })
}

function getWeather (coord) {
    $.ajax({
        type:"GET",
        url:"https://api.openweathermap.org/data/2.5/onecall?lat="+coord.lat+"&lon="+coord.lon+"&units=metric&appid="+apiKey,
        async:true,
        dataType: "json",
        success: function(json) {
            getWeather.json = json;

            var current = json.current;
            var uvIndex = Math.round(current.uvi);
            cityElm.text(current.name);
            let setDate = moment.unix(current.dt).format('L');
            dateElm.text(setDate);
            weatherIconElm.html("<img src='http://openweathermap.org/img/wn/"+iconId+"@2x.png'>")
            temperatureElm.html(current.main.temp);
            humidityElm.text(current.main.humidity);
            windElm.text((current.wind.speed * 2.237).toFixed(1));
    
            let uvColor = detUVIndexColor(uvIndex);
            uvIndexEl.text(result.current.uvi);
            uvIndexEl.attr('style', `background-color: ${uvColor}; color: ${uvColor === "yellow" ? "black" : "white"}`);
            let fiveDay = result.daily;
        
            for (let i = 0; i <= 5; i++) {
                let currentDay = fiveDay[i];
                $(`div.day-${i} .card-title`).text(moment.unix(currentDay.dt).format('L'));
                $(`div.day-${i} .fiveDay-img`).attr(
                    'src',
                    `http://openweathermap.org/img/wn/${currentDay.weather[0].icon}.png`
                ).attr('alt', currentDay.weather[0].description);
                $(`div.day-${i} .fiveDay-temp`).text(currentDay.temp.day);
                $(`div.day-${i} .fiveDay-humid`).text(currentDay.humidity);
            }
    }})
}       

function runRecent (event) {
    var searchEl = event.target;
    if (event.target.matches("button")){
      city=searchEl.textContent.trim();
      getCoordinates(city);
    }
  
  }

  $(document).ready(function(){
    console.log("hola");
    $("form").submit(function(e){
        e.preventDefault();
        citySearchInput();
    });
  });
  

                
                $("btn btn-light city-btn").click(runRecent);

                loadCities();
                // displayCities(recentCities);
