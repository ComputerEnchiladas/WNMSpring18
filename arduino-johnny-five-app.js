var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var button = new five.Button(12);

  button.on("press", function() {
    console.log('pressed...');
  });
  button.on("hold", function() {
    console.log('holding...');
  });
});




