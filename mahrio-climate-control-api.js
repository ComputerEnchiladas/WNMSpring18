process.env.PORT = 6262;
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/temperatures';

var mongoose = require('mongoose');
var schema = mongoose.Schema({
  value: {type: Number, required: true},
  created: {type: Date, default: Date.now }
});
var Temperature = mongoose.model('Temperature', schema);

var computeFunctionOne = function( data ){ return 100; };
var computeFunctionTwo = function( data ){ return 2; };

require('mahrio').runServer( process.env, __dirname)
  .then( (server) => {
    server.route({
      method: 'GET',
      path: '/temperatures',
      handler: function(request, reply){
        Temperature.find().exec( (err, temps) => {
          if( err || !temps){ return reply('No Readings'); }

          reply({temperatures: temps});
        })
      }
    });
    server.route({
      method: 'GET',
      path: '/compute/{point}',
      handler: function(req ,rep){
        Temperature.find().exec( (err, temps) => {
          if( err || !temps){ return reply('No Readings'); }

          switch( req.params.point ) {
            case 'two':
              rep( computeFunctionTwo( temps ) );
              break;
            default:
              rep( computeFunctionOne( temps ) );
              break;
          }
        });
      }
    });
    server.route({
      method: 'POST',
      path: '/temperatures',
      handler: function(request, reply){
        if( !request.payload.temperature ) { return reply('Invalid Input'); }

        Temperature.create({value: request.payload.temperature}, (err, temp) => {
          if( err || !temp){ return reply('Not Created'); }

          reply({temperature: temp});
        })
      }
    });
    server.route({
      method: 'DELETE',
      path: '/temperatures/{id}',
      handler: function(request, reply){
        Temperature.remove({_id: request.params.id}).exec( function(err, temp) {
          if( err ) { return rep( 'Not Deleted' ); }

          if( temp && temp.result && temp.result.ok ) {
            reply({deleted: true});
          } else {
            reply({deleted: false});
          }
        });
      }
    });
  });