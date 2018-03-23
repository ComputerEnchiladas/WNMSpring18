var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var mic = new five.Sensor("A0");
  var led = new five.Led(9);

  mic.on("data", function() {
    console.log(this.value);
    led.brightness(this.value >> 2);
  });
});