process.env.PORT = 6087;

require('mahrio').runServer( process.env, __dirname)
  .then( function(server){
    server.route({
      path: '/data',
      method: 'GET',
      handler: function(request, reply) {
        reply({
          attr1: true,
          attr2: 20
        });
      }
    });
  });
// Server runs http://127.0.0.1:6087
