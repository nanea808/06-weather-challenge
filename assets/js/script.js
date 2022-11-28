$(() => {
    var searchButton = $('#search-btn');
    var searchForm = $('#search-form');
    var currentWeatherEl = $('#current-weather');
    var fiveDayEl = $('#5-day').children().eq(1);

    console.log(fiveDayEl);

    function setWeatherData(weather, El) {
        var iconUrl = "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png";

        if (El.attr('id') === 'current-weather') {
            El.children().eq(0).text(weather.name + ' ' + dayjs(weather.dt * 1000).format('MM/DD/YYYY'));
        } else {
            El.children().eq(0).text(dayjs(weather.dt * 1000).format('MM/DD/YYYY'));
        }

        El.children().eq(1).attr('src', iconUrl);
        El.children().eq(2).text('Temp: ' + weather.main.temp + '°F');
        El.children().eq(3).text('Wind: ' + weather.wind.speed + ' MPH');
        El.children().eq(4).text('Humidity: ' + weather.main.humidity + ' %');
    }

    function averageData(list) {
        console.log(list);
        var averages = {
            temp: 0,
            wind: 0,
            humidity: 0
        }

        for (var x = 0; x < 8; x++) {
            averages.temp += list[x].main.temp;
            averages.wind += list[x].wind.speed;
            averages.humidity += list[x].main.humidity;
        }

        averages.temp = averages.temp / 8;
        averages.wind = averages.wind / 8;
        averages.humidity = averages.humidity / 8;
        console.log(averages);
    }

    function getWeatherData5Day(lat, lon) {
        var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=' + lat + '&lon=' + lon + '&appid=a6e98ccb06f33151ebb17a9d35aa5234';

        fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                averageData(data.list);
                // for (var x = 0; x < 5; x++) {
                //     // setweather()
                // }
            });
    }

    function getWeatherData(lat, lon) {
        var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=' + lat + '&lon=' + lon + '&appid=a6e98ccb06f33151ebb17a9d35aa5234';

        fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                setWeatherData(data, currentWeatherEl);
            });
    }

    function getGeoData(city) {
        var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=a6e98ccb06f33151ebb17a9d35aa5234';
        fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                getWeatherData(data[0].lat, data[0].lon);
                getWeatherData5Day(data[0].lat, data[0].lon);
            });
    }

    searchButton.click(function (e) {
        e.preventDefault();
        var cityName = searchForm.children('input').val().trim();
        console.log(cityName);
        getGeoData(cityName);
    });
});