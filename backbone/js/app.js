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

function convertElevation(K, measurement) {
    var newTemp;
    if (measurement === "F") {
        newTemp = ((K - 273.15) * 1.8) + 32;
    } else if (measurement === "C") {
        newTemp = K - 273.15;
    }
    newTemp = Math.round(newTemp);
    return newTemp; 
};

function getTimezone(lat, lon) {
    return $.ajax({
        method: "GET",
        url: '/timezone?lat=' + lat + '&lon=' + lon,
        dataType: 'JSON',
    });
};

function getElevation(lat, lon) {
    return $.ajax({
        method: "GET",
        url: '/elevation?lat=' + lat + '&lon=' + lon,
        dataType: 'JSON',
    });
};

var Weather = Backbone.Model.extend({
    initialize: function () {
        var self = this;
        this.on('sync', function () {
            console.log("I'm learning backbone");
            var code = this.get("cod");
            if (code === "404" || code === 404) {
                alert("Please enter a valid zip code.");
            }
            else if (code === "200" || code === 200) {
                var coord = this.get("coord");
                getElevation(coord.lat, coord.lon).then(function onSuccess(res) {
                    var tempElevation = res.results[0].elevation;
                    self.set({ elevation: Math.round(tempElevation) });
                });
                getTimezone(coord.lat, coord.lon).then(function onSuccess(res) {
                    self.set({ timezone: res.timeZoneName });
                });
            }
        });
    },
    url: "/weather"
});

var AppView = Backbone.View.extend({
    el: "#app",
    events: {
        "click #check": "onClick"
    },
    initialize: function () {
        $("#zip").keyup(function (event) {
            if (event.keyCode === 13) {
                $("#check").click();
            }
        });
    },
    onClick: function () {
        var zip = $("#zip").val();
        if (zip !== undefined && zip !== "") {
            var weather = new Weather();
            weather.fetch({ data: $.param({ zip: zip }) }).done(function () {
                var weatherView = new WeatherView({ model: weather });
            });
        } else {
            alert("Zip code is required.");
        }
    }
});
var appView = new AppView();

var WeatherView = Backbone.View.extend({
    el: '#output',
    initialize: function () {
        this.model.on('change', this.render, this);
        this.render();
    },
    render: function () {
        if (this.model.get("name")) {
            var cityName = this.model.attributes.name;
            var temperature = convertTemp(this.model.attributes.main.temp, "F");
            var timezone = this.model.attributes.timezone;
            var elevation = this.model.attributes.elevation;
            var weatherString = "It's currently " + temperature + "&#8457; in " + cityName + ". The timezone for the area is " + timezone + " and the elevation is " + elevation + " meters.";
            this.$el.html(weatherString);
        }
    }
});