// npm install request mahrio
var request = require('request');

require('mahrio').runServer( process.env, __dirname)
  .then( function(server){
    server.route({
      path: '/',
      method: 'GET',
      handler: function(req, reply) {

        request({
          method: 'GET',
          uri: 'http://127.0.0.1:6087/data'
        }, function(err, headers, body){
          reply(body);
        });
      }
    });
  });
// Server runs http://127.0.0.1:6085
