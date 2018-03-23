var five = require("johnny-five"),
  board = new five.Board(),
  messages = [{t: 'Hello', b: 'World'}, {t: 'Arduino', b: 'Rocks'}, {t: 'Johnny-Five', b: 'Awesome'}],
  index = 0,
  lcd,
  p,
  rgb = [0,0,0];
var getRandomArbitrary = function (min, max) { return Math.random() * (max - min) + min; };
var play = function(p, song) {
  p.play({
    song: [
      [song, 1 / 4],
    ],
    tempo: 100
  });
};

board.on("ready", function() {
  lcd = new five.LCD({
    pins: [12,11,5,4,3,2],
    backlight: 6,
    rows: 2,
    cols: 20
  });
  p = new five.Piezo(13);
  this.pinMode(6, five.Pin.PWM);
  this.pinMode(9, five.Pin.PWM);
  this.pinMode(10, five.Pin.PWM);


  this.loop(1000, () => {
    lcd.clear().cursor(0, 0).print( messages[index].t );
    lcd.cursor(1, 0).print( messages[index].b );

    if(index == 2){
      index = 0;
    } else {
      index += 1;
    }
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


  require('mahrio').runServer( process.env, __dirname)
    .then( function(server){
      server.route({
        method: 'GET',
        path: '/key/{name}',
        handler: function( request, reply){
          play( p, request.params.name.replace('-','#') );
          reply.view('piano');
        }
      });
    });
});