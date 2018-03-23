var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var analog1 = new five.Pin("A0");
  var analog2 = new five.Pin("A1");
  var analog3 = new five.Pin("A2");

  this.pinMode(3, five.Pin.PWM);
  this.pinMode(5, five.Pin.PWM);
  this.pinMode(6, five.Pin.PWM);

  this.loop( 10, () => {
    analog1.query( (sensor) => {
      this.analogWrite(3, sensor.value * 255 / 1023 );
    });
    analog2.query((sensor) => {
      this.analogWrite(6, sensor.value * 255 / 1023 );
    });
    analog3.query((sensor) => {
      this.analogWrite(5, sensor.value * 255 / 1023 );
    });
  });
});
