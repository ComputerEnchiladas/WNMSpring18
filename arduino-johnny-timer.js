var getRandomArbitrary = function (min, max) { return Math.random() * (max - min) + min; };
var five = require("johnny-five");
var leds = [false, false, false];
var board = new five.Board();
var start = null;
var end = null;
var done = false;

board.on("ready", function() {

  function begin(){
    var rand = getRandomArbitrary(5000, 10000);
    setTimeout(function(){
      if( done ) return;
      led1.on();
      leds[0] = true;
      setTimeout(function(){
        if( done ) return;
        led2.on();
        leds[1] = true;
        setTimeout(function(){
          if( done ) return;
          led3.on();
          leds[2] = true;
          start = (new Date).getTime();
        }, rand)
      }, 1000);
    }, 1000);
  }
  function reset(){
    led1.off();
    led2.off();
    led3.off();
    start = end = null;
    leds[0] = leds[1] = leds[2] = false;
    done = false;
  }

  var led1 = new five.Led(3);
  var led2 = new five.Led(4);
  var led3 = new five.Led(5);
  var button = new five.Button(12);

  button.on("press", function() {
    if( done ) return;
    done = true;
    if( leds[0] && leds[1] && leds[2] ) {
      end = (new Date).getTime();
      console.log('It took you '+ (end - start)+ ' milliseconds to react');
    }
    if( !leds[0] || !leds[1] || !leds[2] ) {
      console.log('You Lose!');
    }
  });
  button.on("hold", function() {
    console.log('Restarting...')
    reset();
    begin();
  });

  begin();
});