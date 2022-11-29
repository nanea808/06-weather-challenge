$(() => {
    var searchButton = $('#search-btn');
    var searchForm = $('#search-form');
    var currentWeatherEl = $('#current-weather');
    var fiveDayEl = $('#5-day').children().eq(1);

    console.log(fiveDayEl);

    function setWeatherData(weather, El) {
        

        if (El.attr('id') === 'current-weather') {
            var iconUrl = "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png";
            El.children().eq(0).text(weather.name + ' ' + dayjs(weather.dt * 1000).format('MM/DD/YYYY'));
            El.children().eq(1).attr('src', iconUrl);
            El.children().eq(2).text('Temp: ' + weather.main.temp + '°F');
            El.children().eq(3).text('Wind: ' + weather.wind.speed + ' MPH');
            El.children().eq(4).text('Humidity: ' + weather.main.humidity + ' %');
        } else {
            El.children().eq(0).text(dayjs(weather.date * 1000).format('MM/DD/YYYY'));
            El.children().eq(1).text('Temp: ' + weather.temp + '°F');
            El.children().eq(2).text('Wind: ' + weather.wind + ' MPH');
            El.children().eq(3).text('Humidity: ' + weather.humidity + ' %');
        }
    }

    function averageData(list) {
        console.log(list);
        var fiveDayAverages= []
        var start = 0;
        var end = 8;

        for (var i = 0; i < 5; i++) {
            var average = {
                temp: 0,
                wind: 0,
                humidity: 0,
                date: null
            }

            for (var x = start; x < end; x++) {
                average.temp += list[x].main.temp;
                average.wind += list[x].wind.speed;
                average.humidity += list[x].main.humidity;
            }
            

            average.temp = Math.round(average.temp / 8);
            average.wind = Math.round(average.wind / 8);
            average.humidity = Math.round(average.humidity / 8);
            average.date = list[start].dt;
            
            fiveDayAverages[i] = average;

            start += 8;
            end += 8;
        }
        
        return fiveDayAverages;
    }

    function getWeatherData5Day(lat, lon) {
        var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=' + lat + '&lon=' + lon + '&appid=a6e98ccb06f33151ebb17a9d35aa5234';

        fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var forcast = averageData(data.list);
                for (var x = 0; x < 5; x++) {
                    setWeatherData(forcast[x], fiveDayEl.children().eq(x));
                }
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
        var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=a6e98ccb06f33151ebb17a9d35aa5234';
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