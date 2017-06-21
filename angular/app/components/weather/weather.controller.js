var weatherController = angular.module('weather.controller', []);

weatherController.controller('weatherController', function ($scope, $http, $q, $filter, $mdDialog) {
    var vm = {};

    vm.weather = {};
    vm.hasWeather = false;
    vm.loading = false;
    vm.zipRegex = /^(\d{5})?$/;

    // Check for geolocation capability
    if (navigator.geolocation) {
        vm.hasLocation = true;
    }

    // Convert Kelvin to Fahrenheit or Celsius
    function convertTemp(K, measurement) {
        var newTemp;
        if (measurement === "F") {
            newTemp = ((K - 273.15) * 1.8) + 32;
        } else if (measurement === "C") {
            newTemp = K - 273.15;
        }
        newTemp = Math.round(newTemp);
        return newTemp;
    };

    // Open WeatherMap data from zip code
    function getWeather(zip) {
        var deferred = $q.defer();
        $http.get('/weather?zip=' + zip).then(function onSuccess(res) {
            deferred.resolve(res.data);
        }, function onError(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    // Google API for timezone from latitude and longitude
    function getTimezone(lat, lon) {
        var deferred = $q.defer();
        $http.get('/timezone?lat=' + lat + '&lon=' + lon).then(function onSuccess(res) {
            var weatherData = res.data;
            vm.weather.timezone = weatherData.timeZoneName;
            deferred.resolve();
        }, function onError() {
            deferred.reject();
        });
        return deferred.promise;
    };

    // Google API for elevation
    function getElevation(lat, lon) {
        var deferred = $q.defer();
        $http.get('/elevation?lat=' + lat + '&lon=' + lon).then(function onSuccess(res) {
            var weatherData = res.data;
            var tempElevation = weatherData.results[0].elevation;
            vm.weather.elevation = Math.round(tempElevation);
            deferred.resolve();
        }, function onError() {
            deferred.reject();
        });
        return deferred.promise;
    };

    // Show message for invalid zip code
    function showInvalid(ev) {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title($filter('translate')('INVALID_TITLE'))
                .textContent($filter('translate')('INVALID_TEXT'))
                .ariaLabel('Alert Invalid Zip')
                .ok($filter('translate')('OK'))
                .targetEvent(ev)
        );
    };

    // Show message for no location found
    function showNoLocation(ev) {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.body))
                .clickOutsideToClose(true)
                .title($filter('translate')('NO_LOCATION_TITLE'))
                .textContent($filter('translate')('NO_LOCATION_TEXT'))
                .ariaLabel('Alert No Location')
                .ok($filter('translate')('OK'))
                .targetEvent(ev)
        );
    };

    // Get location using location services
    vm.getLocation = function () {
        vm.loading = true;
        vm.hasWeather = false;
        navigator.geolocation.getCurrentPosition(function (pos) {
            console.log(pos);
            $http.get('/location?lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude).then(function onSuccess(res) {
                console.log(res);
                var addressParts = res.data.results;
                for (var i = 0; i < addressParts.length; i++) {
                    if (addressParts[i].types[0] === "postal_code") {
                        vm.zip = addressParts[i].address_components[0].short_name;
                        console.log(vm.zip);
                        break;
                    }
                }
                vm.getItAll(vm.zip);
            }, function onError(err) {
                console.log(err);
                vm.loading = false;
                showNoLocation();
            });
        });
    }

    // Make all them calls
    vm.getItAll = function (zip) {
        vm.loading = true;
        vm.hasWeather = false;
        getWeather(zip).then(function onSuccess(data) {
            console.log(data);
            if (data.cod === "404" || data.cod === 404) {
                vm.loading = false;
                showInvalid();
            }
            else if (data.cod === "200" || data.cod === 200) {
                vm.weather.cityName = data.name;
                vm.weather.temperature = convertTemp(data.main.temp, "F");

                var lat = data.coord.lat;
                var lon = data.coord.lon;
                var promises = [
                    getTimezone(lat, lon),
                    getElevation(lat, lon)
                ];

                $q.all().then(function onSuccess(data) {
                    vm.loading = false;
                    vm.hasWeather = true;
                }, function onError(err) {
                    console.log(err);
                });
            }
        }, function onError(err) {
            console.log(err);
        });
    };

    return vm;
});
