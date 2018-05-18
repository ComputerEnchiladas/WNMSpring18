var Five = require("johnny-five");

var board = new Five.Board();

board.on("ready", function() {

  var stepper = new Five.Stepper({
    type: Five.Stepper.TYPE.FOUR_WIRE,
    stepsPerRev: 200,
    pins: [ 4, 5, 6, 7 ]
  });

  stepper.rpm(180).ccw().step(2000, function() {
    console.log("done");
  });

  this.repl.inject({
    stepper: stepper
  });
});