var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var analog1 = new five.Pin("A0");

  this.pinMode(9, five.Pin.SERVO);

  this.loop( 10, () => {
    analog1.query( (sensor) => {
      this.servoWrite(9, sensor.value * 180 / 1023 );
    });
  });
});
