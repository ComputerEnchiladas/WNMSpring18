var five = require('johnny-five');
var songs = require('j5-songs');

five.Board().on('ready', function () {
  var piezo = new five.Piezo(13);

  piezo.play( songs.load('mario-intro') );
});