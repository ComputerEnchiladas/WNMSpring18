var five = require('johnny-five');
var board = new five.Board();
var read = 0, dustVal;
board.on('ready', function(){
  var dustSensor = new five.Pin("A0");
  var led = new five.Led(7);

  setInterval( function(){
    read += 1;
    if( read === 1 ) {
      led.on();
      return;
    }

    if( read === 4){
      dustSensor.query( function(sensor){
        dustVal = sensor.value;
        var voltage = (sensor.value / 1024.0) * 5.0;
        console.log('Dust Sensor: ' + voltage + ' volts (' + sensor.value + '/1023)');
        led.off();
      });
    }

    if( read === 10 ) {
      read = 0;
    }

  }, 200);
});