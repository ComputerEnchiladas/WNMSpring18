process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/temperatures';

var five = require("johnny-five"),
  mongoose = require('mongoose'),
  schema = mongoose.Schema({
    key: {type: String, require: true},
    value: {type: String, required: true},
    created: {type: Date, default: Date.now }
  }),
  Monitor = mongoose.model('Monitor', schema),
  board = new five.Board(),
  io = null,
  currentTemp;

board.on("ready", function() {
  var tempSensor = new five.Pin("A0");
  var oneMinuteTemp = [];

  require('mahrio').runServer( process.env, __dirname)
    .then( (server) => {
      io = require('socket.io').listen( server.listener );
      io.on('connection', function(socket){
        socket.emit('event:temp', currentTemp);
      });

      setInterval(function(){
        tempSensor.query(function(temp) {
          var val = temp.value,
            vlt = (val / 1024.0) * 5.0,
            clc = (vlt - .5) * 100,
            frh = (clc * 1.8) + 32.0;

          if( io ) {
            io.sockets.emit('event:temp', frh);
          }

          oneMinuteTemp.push( frh );

          if( oneMinuteTemp.length == 60 ) {
            // when we have ten data points, use reduce to sum them up then divide by 10 to get average
            currentTemp = oneMinuteTemp.reduce((accumulator, currentValue) => accumulator + currentValue) / 10;
            Monitor.create({key: 'temp', value: currentTemp}, function(err, monitor){
              console.log('Saved');
            });
            oneMinuteTemp = [];
          }
        });
      }, 1000);

      server.route({
        method: 'GET',
        path: '/api/temperature',
        handler: function(req, rep){
          Monitor.find({}).exec().then( function(temps){
            return rep({temperatures: temps});
          }, function(){
            return rep({temperatures: []});
          })
        }
      })
    });
});
