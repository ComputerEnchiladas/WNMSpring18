var five = require("johnny-five");
var board = new five.Board();
var baselineTemp = 20.0;

process.env.MONGODB_URI = 'mongodb://INSERT_YOUR_URI';
var mongoose = require('mongoose');
var schema = mongoose.Schema({
  key: {type: String, require: true},
  value: {type: String, required: true},
  created: {type: Date, default: Date.now }
});
var Monitor = mongoose.model('Monitor', schema);

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

      Monitor.create({key: 'temp', value: frh}, function(err, monitor){
        console.log('Saved');
      });
    });
  }, 60000);

  require('mahrio').runServer(process.env, __dirname)
    .then( function(server){
      server.route({
        method: 'GET',
        path: '/api/temperatures',
        handler: function( request, reply){
          Monitor.find({key: 'temp'}).exec(function(err, monitor){
            if( err || !monitor || !monitor.length ){ return reply({error: true}); }

            reply({
              length: monitor.length,
              first: 'First reading was ' + monitor[0].value + ' degrees on ' + monitor[0].created,
              last: 'Last reading was ' + monitor[monitor.length - 1].value + ' degrees on ' + monitor[monitor.length - 1].created,
            });
          })
        }
      })
    });
});
