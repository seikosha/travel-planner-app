const express = require('express');
const app = express();

//dependecies
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request-promise');

//middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));

//set up the server
const port = 8000;
app.listen(port, () => {console.log(`running on localhost: ${port}`)});

//post route
app.post('/travel',(req, res) => {
  processTravelData(req, res)
})

async function processTravelData(req, res) {
  //claim variables
  let longitude;
  let latitude;
  let weatherSummary;
  let tempHigh;
  let tempLow;
  let imageLink;
  let geoReq = false;
  let darkskyReq = false;


  //countdown the days left
  let currentDate = new Date();
  let travelDate = new Date(req.body.date);
  let countDown = Math.floor((travelDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)) + 1;

  //get geo data from API 
  let geonamesUrl = 'http://api.geonames.org/postalCodeSearchJSON?placename_startsWith=' + req.body.location + '&maxRows=1&username=' + process.env.GEONAMES_USERNAME
  await request(geonamesUrl, function(response, body) {
    let geonamesData = JSON.parse(body.body);    

    longitude = geonamesData.postalCodes[0].lng;
    latitude = geonamesData.postalCodes[0].lat;
    geoReq = true;
  });

  //get weather data from darksky API
  if (geoReq) {
    let darkskyUrl = 'https://api.darksky.net/forecast/' + process.env.DARKSKY_API_KEY + '/' + latitude + ',' + longitude + ',' + req.body.date + 'T00:00:00?exclude=currently,flags,hourly'
    console.log('already got geonames data, now into darksky data');
    
    await request(darkskyUrl, function (response, body) {
      let darkskyData = JSON.parse(body.body);

      weatherSummary = darkskyData.daily.data[0].summary;
      tempHigh = darkskyData.daily.data[0].temperatureHigh;
      tempLow = darkskyData.daily.data[0].temperatureLow;
      darkskyReq = true;
    })
  };

  //get image link from pixabay API
  let pixabayUrl = 'http://pixabay.com/api/?key=' + process.env.PIXABAY_API_KEY + '&q=' + req.body.location + '&image_type=photo'

  if (darkskyReq) {
    console.log('already got darksky right, now into pixabay data');

    await request(pixabayUrl, function(response, body) {
      let pixabayData = JSON.parse(body.body);

      imageLink = pixabayData.hits[0].webformatURL;
      pixabayReq = true;
    })
  };


    let travelData = {
      weathersummary: weatherSummary,
      hightemp: tempHigh,
      lowtemp: tempLow,
      countdowndays: countDown,
      imagelink: imageLink
    }

    return res.send(travelData);
    console.log(req.body);
    console.log(travelData);
  
  }