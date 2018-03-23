var five = require("johnny-five");
var board = new five.Board();
var baselineTemp = 20.0;

board.on("ready", function() {
  var that = this;
  var analog = new five.Pin("A0");
  var io; // sockets

  require('mahrio').runServer( process.env, __dirname)
    .then( function(server){

      io = require('socket.io').listen( server.listener );
      io.on('connection', function( socket ) {
        console.log('connection: ', socket.id );
      });

      setInterval( function(){
        analog.query(function(sensor) {
              var val = sensor.value,
                vlt = (val / 1024.0) * 5.0,
                clc = (vlt - .5) * 100,
                frh = (clc * 1.8) + 32.0;

              if( io ) {
                io.sockets.emit('event:temp:read', frh );
              }
            });
      }, 1000);

      server.route({
        path: '/',
        method: 'GET',
        handler: function(request, reply) {
          reply.view('sockets-temp');
        }
      });
    });
// Server runs http://127.0.0.1:6085
});




