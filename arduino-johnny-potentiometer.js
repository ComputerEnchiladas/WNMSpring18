var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var analog1 = new five.Pin("A0");
  var analog2 = new five.Pin("A1");
  var analog3 = new five.Pin("A2");

  this.loop( 10, () => {
    analog1.query(function(sensor) {
      console.log('Sensor 1 Value: ' + sensor.value);
    });
    analog2.query(function(sensor) {
      console.log('Sensor 2 Value: ' + sensor.value);
    });
    analog3.query(function(sensor) {
      console.log('Sensor 3 Value: ' + sensor.value);
    });
  });
});
