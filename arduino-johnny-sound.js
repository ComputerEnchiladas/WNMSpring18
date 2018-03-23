var five = require('johnny-five');
var songs = require('j5-songs');
var io = null;

five.Board().on('ready', function () {
  var p = new five.Piezo(13);
  var play = function(song) {
    p.play({
      song: [
        [song, 1 / 4],
      ],
      tempo: 100
    });
  };

  require('mahrio').runServer( process.env, __dirname).then( function(server){
    server.route({
      method: 'GET',
      path: '/key/{name}',
      handler: function( request, reply){

        play( request.params.name.replace('-','#') );
        reply.view('piano');
      }
    });
  });
});