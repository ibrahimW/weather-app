require('dotenv').config();
const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
 .options({
   a: {
     demand: true,
     alias: 'address',
     describe: 'address to fetch weather for',
     string: true
   }
 })
 .help()
 .alias('help', 'h')
 .argv;

var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}` + '&key=' + process.env.API_KEY;

axios.get(geocodeUrl).then((response) => {
  if (response.data.status === 'ZERO_RESULTS') {
    throw new Error('Unable to find that address.');
  }

  var lat = response.data.results[0].geometry.location.lat;
  var lng =  response.data.results[0].geometry.location.lng;
  var weatherUrl = `https://api.darksky.net/forecast/${process.env.WEATHER_API}/${lat},${lng}`;
  console.log(response.data.results[0].formatted_address);
  return axios.get(weatherUrl);
}).then((response) => {
  var temperature = response.data.currently.temperature;
  var apparentTemperature = response.data.currently.apparentTemperature;
  console.log(`its currently ${temperature}. It feels like ${apparentTemperature}.`)
}).catch((e) => {
  if (e.code === 'ENOTFOUND') {
    console.log('unable to connect to API servers.');
  } else {
    console.log(e.message);
  }
});
