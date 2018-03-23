var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

  var led1 = new five.Led(3);
  var led2 = new five.Led(4);
  var led3 = new five.Led(5);

  led1.blink(300);
  led2.blink(600);
  led3.blink(900);
});
