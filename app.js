const request = require('request');

request({
  url: 'https://maps.googleapis.com/maps/api/geocode/json?address=1301%20lombard%20street%20philadelphia&key=AIzaSyDQkcL6XAkC1M2u0IQpCS7MZDC71cpvatc',
  json: true
}, (error, response, body) => {
  console.log(body);
});
