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

    function createURLFromInput(city) {
        if (city) {
            return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        }
    }

    function createURLfromId(id) {
        return 'https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}&units=metric';
    }

    function displayCities(recentCities) {
        cityListElm.empty();
        recentCities.splice(5);
        let sortedCities = [...recentCities];
        sortedCities.sort(compare);
        sortedCities.forEach(function (location){
            let cityDiv = $('<div>').addClass('col-12 city');
            let cityBtn = $('<button>').addClass('btn btn-light city-btn').text(location.city);
            cityDiv.append(cityBtn);
            cityListElm.append(cityDiv);
        });
    }

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

    function getWeather(queryURL) {
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {

            let city = response.name;
            let id = response.id;

            if (recentCities[0]) {
                recentCities = $.grep(recentCities, function (storedCity) {
                    return id !== storedCity.id;
                })
            };

    recentCities.unshift({city, id});
    storedCities();
    displayCities(recentCities);
    


    cityElm.text(response.name);
    let setDate = moment.unix(response.dt).format('L');
    dateElm.text(setDate);
    let weatherIcon = response.weather[0].icon;
    weatherIconElm.attr('src', `http://openweathermap.org/img/wn/${weatherIcon}.png`).attr('alt', response.weather[0].description);
    temperatureElm.html(response.main.temp);
    humidityElm.text(response.main.humidity);
    windElm.text((response.wind.speed * 2.237).toFixed(1));
    });
    let lat = response.coord.lat;
    let lon = response.coord.lon;
    let queryURLAll = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
                $.ajax({
                    url: queryURLAll,
                    method: 'GET'
                }).then(function (response) {
                    let uvIndex = response.current.uvi;
                    let uvColor = detUVIndexColor(uvIndex);
                    uvIndexEl.text(response.current.uvi);
                    uvIndexEl.attr('style', `background-color: ${uvColor}; color: ${uvColor === "yellow" ? "black" : "white"}`);
                    let fiveDay = response.daily;
                
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
                });

                function showRecentlySearchCity() {
                    if (recentCities[0]) {
                        let = queryURL = createURLfromId(recentCities[0].id);
                        searchWeather(queryURL);
                    } else {
                        let queryURL = createURLFromInput("Detroit");
                        searchWeather(queryURL);
                    }
                }

                $('#search-btn').on('click', function (event){
                    event.noDefault();

                    let city = cityInput.val().trim();
                    city = city.replace(' ', '%20');

                    cityInput.val('');

                    if (city) {
                        let queryURL = createURLFromInput(city);
                        searchWeather(queryURL);
                    }
                });

                $(document).on("click", "button.city-btn", function(event) {
                    let clickedCity = $(this).text();
                    let foundCity = $.grep(recentCities, function (storedCity) {
                        return clickedCity === storedCity.city;
                    })
                    let queryURL = createURLFromId(foundCity[0].id)
                    searchWeather(queryURL);
                });

                loadCities();
                displayCities(recentCities);

                showRecentlySearchCity();
    };