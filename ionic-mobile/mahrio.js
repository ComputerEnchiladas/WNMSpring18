var five = require('johnny-five');
var red = 10;
var green = 9;
var blue = 6;

var board = new five.Board({});

board.on("ready", function() {
  var that = this;
  this.pinMode(red, five.Pin.PWM);
  this.pinMode(green, five.Pin.PWM);
  this.pinMode(blue, five.Pin.PWM);

  require('mahrio').runServer( process.env, __dirname)
    .then( function(server){
      server.route({
        method: 'GET',
        path: '/',
        handler: function(req, rep){
          rep.view('index');
        }
      });

      server.route({
        method: 'POST',
        path: '/color',
        handler: function(req, rep){
          var c = req.payload;


          that.analogWrite(red, c.red );
          that.analogWrite(green, c.green );
          that.analogWrite(blue, c.blue );

          console.log('rgb('+c.red+','+c.green+','+c.blue+')');
          rep();
        },
        config: {
          cors: true
        }
      });
    });
});
