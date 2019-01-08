require('dotenv').config();
const http = require('http');
const url = require('url');
const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

const PORT = process.env.PORT;

http.createServer(function (req, res) {
  const query = url.parse(req.url, true).query;
  console.log(`Received query address ${query.address}`);
  res.writeHead(200, {'Content-Type': 'text/html'});
  geocode.geocodeAddress(query.address, (errorMessage, results) => {
    if (errorMessage) {
      console.log(errorMessage);
    } else {
      res.write(results.address);
      weather.getWeather(results.latitude, results.longitude, (errorMessage, weatherResults) => {
        if (errorMessage)  {
          console.log(errorMessage);
        } else {
          res.write(`<br>Its currently ${weatherResults.temperature}. It feels like ${weatherResults.apparentTemperature}.`);
          res.end();
        }
      });
    }
  });

}).listen(PORT);
