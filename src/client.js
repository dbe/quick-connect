var jayson = require('jayson');
var PORT = 3001;

var models = require('../db/models');
var sequelize = models.sequelize;
var Game = require('../db/models').Game;

var client = jayson.client.http({port: PORT});
console.log("Connected to server on port: ", PORT);

//Run-thru all of the commands
logGenericResult('echo', {message: 'oreo'}, client);
logGenericResult('getOpenGames', null, client);
logGenericResult('joinGame', null, client);
logGenericResult('createGame', null, client);
logGenericResult('getGameState', null, client);
logGenericResult('makeMove', null, client);

Game.findAll().then(games => {
  console.log(games);
  sequelize.close();
}).catch(err => console.log(err));

function logGenericResult(procedureName, args, client) {
  client.request(procedureName, args, function(err, response) {
    if(err) throw err;
    if(response.error) console.log(response.error.message);

    console.log(`${procedureName}:`);
    console.log(response.result);
    console.log();
  });
}
