var five = require('johnny-five');
var songs = require('j5-songs');
var getRandomArbitrary = function (min, max) { return Math.random() * (max - min) + min; };

process.env.MONGODB_URI = 'mongodb://<db-user>:<password>@<>.mlab.com:13505/<>';
var mongoose = require('mongoose');
var schema = mongoose.Schema({
  key: {type: String, require: true},
  value: {type: String, required: true},
  created: {type: Date, default: Date.now }
});
var Monitor = mongoose.model('Monitor', schema);

five.Board().on('ready', function () {

  var temp = new five.Pin("A0");
  var button = new five.Button(0);
  var tilt = new five.Button(2);

  var led1 = new five.Led(3);
  var led2 = new five.Led(4);
  var led3 = new five.Led(5);
  this.pinMode(9, five.Pin.SERVO);
  var piezo = new five.Piezo(10);
  var relay = new five.Led(13);

  led1.blink(300);
  led3.blink(900);
  led2.blink(600);

  piezo.play( songs.load('tetris-theme') );

  var loop = 0;
  var temps = [];
  this.loop( 10, () => {
    loop += 10;
    if( loop > 500 ) {
      this.servoWrite(9, getRandomArbitrary(0, 180) );
      relay.toggle();
      loop = 0;
      temps.forEach( temp => {
        Monitor.create({key: 'temperature', value: temp});
      });
      temps = [];
    }
    temp.query(function(sensor) {
      var val = sensor.value,
        vlt = (val / 1024.0) * 5.0,
        clc = (vlt - .5) * 100,
        frh = (clc * 1.8) + 32.0;

      console.log('Sensor Value: ' + val);
      console.log('Voltage Value: ' + vlt );
      console.log('Celcius Value: ' + clc);
      console.log('Fahrenheit Value: ' + frh);
      temps.push( frh );
    });
  });
  button.on("press", function() {
    console.log('Button Pressed');
  });
  button.on("hold", function() {
    console.log('Button Held');
  });
  tilt.on("press", function() {
    console.log('Tilted');
  });
  tilt.on("hold", function() {
    console.log('Tilting');
  });

  require('mahrio').runServer( process.env, __dirname);
    // ADD WEB API CAPABILITY
});