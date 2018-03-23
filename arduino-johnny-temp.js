var five = require("johnny-five");
var board = new five.Board();
var baselineTemp = 20.0;

// process.env.MONGODB_URI = 'mongodb://heroku_lhd6x742:8vov6sj92v9nn1v0bjh9j0qd29@ds053156.mlab.com:53156/heroku_lhd6x742';
// var mongoose = require('mongoose');
// var schema = mongoose.Schema({
//   key: {type: String, require: true},
//   value: {type: String, required: true},
//   created: {type: Date, default: Date.now }
// });
// var Monitor = mongoose.model('Monitor', schema);

board.on("ready", function() {
  var analog = new five.Pin("A0");

  setInterval(function(){
    analog.query(function(sensor) {
      var val = sensor.value,
        vlt = (val / 1024.0) * 5.0,
        clc = (vlt - .5) * 100,
        frh = (clc * 1.8) + 32.0;

      console.log('Sensor Value: ' + val);
      console.log('Voltage Value: ' + vlt );
      console.log('Celcius Value: ' + clc);
      console.log('Fahrenheit Value: ' + frh);

      // Monitor.create({key: 'temp', value: frh}, function(err, monitor){
      //   console.log('Saved');
      // });
    });
  }, 2000);

  //require('mahrio').runServer(process.env, __dirname);
});
