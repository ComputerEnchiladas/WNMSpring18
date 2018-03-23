var five = require("johnny-five");
var board = new five.Board();
var getRandomArbitrary = function (min, max) { return Math.random() * (max - min) + min; };
var rgb = [0,0,0];

board.on("ready", function() {
  this.pinMode(6, five.Pin.PWM);
  this.pinMode(9, five.Pin.PWM);
  this.pinMode(10, five.Pin.PWM);


  this.loop(1000, () => {
    rgb[0] += getRandomArbitrary(0,50);
    rgb[1] += getRandomArbitrary(50,100);
    rgb[2] += getRandomArbitrary(100,150);
    if( rgb[0] > 255 ) { rgb[0] = 0; }
    if( rgb[1] > 255 ) { rgb[1] = 0; }
    if( rgb[2] > 255 ) { rgb[2] = 0; }

    this.analogWrite(6, rgb[0]);
    this.analogWrite(9, rgb[1]);
    this.analogWrite(10, rgb[2]);


  });
});
