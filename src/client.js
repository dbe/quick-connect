var jayson = require('jayson');
var PORT = 3001;


var client = jayson.client.http({port: PORT});
console.log("Connected to server on port: ", PORT);

//Run-thru all of the commands
// logGenericResult('echo', {message: 'oreo'}, client);
// logGenericResult('getOpenGames', null, client);
// logGenericResult('joinGame', {gameId: '3ae8d73e-91e3-4ec2-992f-d0fa937d67a3'}, client);
// logGenericResult('createGame', null, client);
// logGenericResult('getGameState', {gameId: 'df32fdf8-b198-43cd-bb46-86a777fe676d'}, client);
logGenericResult('makeMove', {gameId: '3ae8d73e-91e3-4ec2-992f-d0fa937d67a3', playerId: 'acd67dd4-ce33-43a8-9691-9de087793411', moves: [6]}, client);


function logGenericResult(procedureName, args, client) {
  client.request(procedureName, args, function(err, response) {
    if(err) throw err;
    if(response.error) console.log(response.error.message);

    console.log(`${procedureName}:`);
    console.log(response.result);
    console.log();
  });
}
