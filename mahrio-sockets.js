var state = false;
require('mahrio').runServer( process.env, __dirname)
  .then( function(server){
    io = require('socket.io').listen( server.listener );
    io.on('connection', function( socket ) {
      console.log('connection: ', socket.id );
    });

    setInterval( () => {
      state = !state;
      io.sockets.emit('event:led', state);
    }, 1000);

    server.route({
      path: '/',
      method: 'GET',
      handler: function(request, reply) {
        reply.view('sockets');
      }
    });
  });