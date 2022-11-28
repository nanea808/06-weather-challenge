$(() => {
    var searchButton = $('#search-btn');
    var searchForm = $('#search-form');

    function getWeatherData(lat, lon) {
        var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=' + lat + '&lon=' + lon +'&appid=a6e98ccb06f33151ebb17a9d35aa5234';
        fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
            })
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
            });
    }

    searchButton.click(function (e) {
        e.preventDefault();
        var cityName = searchForm.children('input').val().trim();
        console.log(cityName);
        getGeoData(cityName);
    });
});