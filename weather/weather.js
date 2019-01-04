require('dotenv').config();
const request = require('request');

var getWeather = (lat, lng, callback) => {
  request({
    url: `https://api.darksky.net/forecast/${process.env.WEATHER_API}/${lat},${lng}`,
    json: true
  }, (error, response, body) => {
     if (!error && response.statusCode === 200) {
       //console.log(body.currently.temperature);
       callback(undefined, {
         temperature: body.currently.temperature,
         apparentTemperature: body.currently.apparentTemperature
       });
     } else {
      callback('Unable to fetch Weather.');
    }
  });
};

module.exports.getWeather = getWeather;
