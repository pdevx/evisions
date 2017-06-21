var express = require('express');
var router = express.Router();
var http = require('http');
var https = require('https');
var app = express();
var bodyParser = require('body-parser');

// body-parser config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname));

app.use('/angular', express.static(__dirname + '/angular/app/.www/'));

app.use('/backbone', express.static(__dirname + '/backbone/'));

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname });
});

app.get('/angular', function (req, res) {
  res.sendFile('index.html', { root: __dirname + '/angular/app/.www/' });
});

app.get('/backbone', function (req, res) {
  res.sendFile('index.html', { root: __dirname + '/backbone/' });
});

app.get('/weather', function (req, res) {
  http.get('http://api.openweathermap.org/data/2.5/weather?zip=' + req.query.zip + '&APPID=217ebdc2b872df5ab5460b7bb1fedf19', function (response) {
    var bodyChunks = [];
    response.on('data', function (chunk) {
      bodyChunks.push(chunk);
    }).on('end', function () {
      var body = Buffer.concat(bodyChunks);
      console.log('BODY: ' + body);
      res.send(body);
    })
  })
    .on('error', function (err) {
      console.log(err);
    });
});

app.get('/timezone', function (req, res) {
  https.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + req.query.lat + ',' + req.query.lon + '&timestamp=1458000000&key=AIzaSyBwImGzkGUEitQ2q0nK4QiGdJwrcsqsemY', function (response) {
    var bodyChunks = [];
    response.on('data', function (chunk) {
      bodyChunks.push(chunk);
    }).on('end', function () {
      var body = Buffer.concat(bodyChunks);
      console.log('BODY: ' + body);
      res.send(body);
    })
  })
    .on('error', function (err) {
      console.log(err);
    });
});

app.get('/elevation', function (req, res) {
  https.get('https://maps.googleapis.com/maps/api/elevation/json?locations=' + req.query.lat + ',' + req.query.lon + '&key=AIzaSyBwImGzkGUEitQ2q0nK4QiGdJwrcsqsemY', function (response) {
    var bodyChunks = [];
    response.on('data', function (chunk) {
      bodyChunks.push(chunk);
    }).on('end', function () {
      var body = Buffer.concat(bodyChunks);
      console.log('BODY: ' + body);
      res.send(body);
    })
  })
    .on('error', function (err) {
      console.log(err);
    });
});

app.get('/location', function (req, res) {
  https.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + req.query.lat + ',' + req.query.lon + '&sensor=true&key=AIzaSyBwImGzkGUEitQ2q0nK4QiGdJwrcsqsemY', function (response) {
  var bodyChunks = [];
    response.on('data', function (chunk) {
      bodyChunks.push(chunk);
    }).on('end', function () {
      var body = Buffer.concat(bodyChunks);
      console.log('BODY: ' + body);
      res.send(body);
    })
  })
    .on('error', function (err) {
      console.log(err);
    });
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});