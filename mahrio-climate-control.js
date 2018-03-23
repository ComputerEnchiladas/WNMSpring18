var five = require("johnny-five"),
  board = new five.Board(),
  request = require('request'),
  io = null,
  targetTemp,
  marginTempControl = 5,
  currentTemp;

board.on("ready", function() {
  var marginUp = new five.Button(0);
  var marginDown = new five.Button(1);
  var powerLed = new five.Led(13);
  var heatLed = new five.Led(10);
  var acLed = new five.Led(9);
  var lcd = new five.LCD({
    pins: [12,11,5,4,3,2],
    backlight: 6,
    rows: 2,
    cols: 20
  });
  var tempSensor = new five.Pin("A0");
  var controlKnob = new five.Sensor({
    pin: "A1",
    freq: 100       // freq equals time distance in milliseconds between sample here it's 100ms
  });
  var tenSecondsTemp = [];

  marginUp.on("press", function() {
    if( marginTempControl < 5 ) {
      marginTempControl += 1;
    }
    if( io ) {
      io.sockets.emit('event:margin', marginTempControl);
    }
    lcd.cursor(1, 0).print('Margin Control: ' + marginTempControl);
  });
  marginDown.on("press", function() {
    if( marginTempControl > 0 ) {
      marginTempControl -= 1;
    }
    if( io ) {
      io.sockets.emit('event:margin', marginTempControl);
    }
    lcd.cursor(1, 0).print('Margin Control: ' + marginTempControl);
  });
  controlKnob.on("data", function() {
    targetTemp = 60 + (this.value * 30 / 1024); // 60 + (0-30)
    if( io ) {
      io.sockets.emit('event:target', targetTemp);
    }
    lcd.cursor(1, 0).print('Target Temp: ' + targetTemp);
  });

  require('mahrio').runServer( process.env, __dirname)
    .then( (server) => {
      io = require('socket.io').listen( server.listener );

      powerLed.on();

      setInterval(function(){
        tempSensor.query(function(temp) {
          var val = temp.value,
            vlt = (val / 1024.0) * 5.0,
            clc = (vlt - .5) * 100,
            frh = (clc * 1.8) + 32.0;

          tenSecondsTemp.push( frh );

          if( tenSecondsTemp.length == 10 ) {
            // when we have ten data points, use reduce to sum them up then divide by 10 to get average
            currentTemp = tenSecondsTemp.reduce((accumulator, currentValue) => accumulator + currentValue) / 10;
            if( io ) {
              io.sockets.emit('event:temp', currentTemp);
            }

            lcd.clear().cursor(0, 0).print('Temp: ' + currentTemp);
            lcd.cursor(1, 0).print('Margin Control: ' + marginTempControl);

            request({
              method: 'POST',
              path: 'http://127.0.0.1:6262/temperatures',
              body: 'value='+ currentTemp
            }, function(err, headers, body){
              console.log( body );
            });

            // What value does this control logic provide?
            if( currentTemp > (targetTemp+marginTempControl) ) {
              acLed.on(); heatLed.off();
            } else if( currentTemp < (targetTemp-marginTempControl)){
              heatLed.on(); acLed.off();
            } else {
              acLed.off();
              heatLed.off();
            }
            tenSecondsTemp = [];
          }
        });
      }, 1000);

      server.route({
        method: 'GET',
        path: '/setting',
        handler: function(req, rep){
          rep({
            target: targetTemp,
            margin: marginTempControl,
            current: currentTemp
          })
        }
      });
      server.route({
        method: 'POST',
        path: '/setting',
        handler: function(req, rep){
         targetTemp = req.payload.targetTemp || targetTemp;
         marginTempControl = req.payload.marginTempControl || marginTempControl;

         rep('Updated');
        },
        config: {
          cors: true
        }
      });
    });
});
