// http://johnny-five.io/examples/led/
var five = require("johnny-five");
var board = new five.Board();
process.env.NODE_URL = '10.10.162.111';

board.on("ready", function() {
  var led3 = new five.Led(3);
  var led4 = new five.Led(4);
  var led5 = new five.Led(5);

  // Week 1: Mahrio Server
  require('mahrio').runServer( process.env, __dirname)
    .then( function(server){
      server.route({
        path: '/led/{number}', // led/3 or led/4 or led/5
        method: 'POST',
        handler: function(request, reply) {
          var led = request.params.number;
          var val = !!request.payload.led;
          switch( led ) {
            case '3':
              val ? led3.on() : led3.off();
              break;
            case '4':
              val ? led4.on() : led4.off();
              break;
            case '5':
              val ? led5.on() : led5.off();
              break;
            default:

          }
          reply('LED toggle');
        }
      });
    });
  // Server runs http://127.0.0.1:6085
});



