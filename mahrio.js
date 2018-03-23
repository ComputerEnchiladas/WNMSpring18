//process.env.NODE_URL = '10.10.162.111';
//process.env.PORT = 3000;


var computeAnnual = function( hourlyRate ) {
  return hourlyRate * 40 * 52;
};
var io, counter = 0;
require('mahrio').runServer( process.env, __dirname) 
  .then( function(server){

    io = require('socket.io').listen( server.listener );

    setInterval(function(){
      io.sockets.emit('event:hello', counter++);
    }, 1000);

    server.route({
      path: '/',
      method: 'GET',
      handler: function(request, reply) {
        reply('Hello');
      }
    });
    server.route({ 
      path: '/estimate-annual-income', 
      method: 'POST', 
      handler: function(request, reply) {
        reply('Estimate annual income is: $' + computeAnnual(request.payload.hourly || 0));
      }
    });

  });
  // Server runs http://127.0.0.1:6085
