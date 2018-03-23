// npm install socket.io mahrio
var io; // sockets
var five = require("johnny-five");
var board = new five.Board();
var toHex = function(d){
  return ("0"+(Number(d).toString(16))).slice(-2).toUpperCase();
};
var a1 = toHex(0);

board.on("ready", function() {
  var analog1 = new five.Pin("A0");

  this.loop( 10, () => {
    analog1.query(function(sensor) {
      a1 = toHex(sensor.value); // HEX 0 = 00, 255 = FF
    });
  });

  require('mahrio').runServer( process.env, __dirname)
    .then( function(server){

      io = require('socket.io').listen( server.listener );

      setInterval( function(){
        io.sockets.emit('event:rgb', '#0000' + a1 );
      }, 100);

      server.route({
        path: '/',
        method: 'GET',
        handler: function(request, reply) {
          reply.view('sockets');
        }
      });
    });
  // Server runs http://127.0.0.1:6085
});


