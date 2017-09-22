var jayson = require('jayson');
var PORT = 3001;


var client = jayson.client.http({port: PORT});
console.log("Connected to server on port: ", PORT);

//Run-thru all of the commands
// logGenericResult('echo', {message: 'oreo'}, client);
logGenericResult('getOpenGames', null, client);
// logGenericResult('joinGame', {userName: 'test', password: 'test', gameId: 'ab45e27a-df6b-457c-88fd-51b14751c954'}, client);
// logGenericResult('createGame', null, client);
// logGenericResult('getGameState', {gameId: 'df32fdf8-b198-43cd-bb46-86a777fe676d'}, client);
// logGenericResult('makeMove', {gameId: '3c9943a2-776a-4f88-ae29-2a07aa2c1d06', playerId: '10605276-c846-454a-93fc-d22f4b99e33e', moves: [6]}, client);


function logGenericResult(procedureName, args, client) {
  client.request(procedureName, args, function(err, response) {
    if(err) throw err;
    if(response.error) console.log(response.error.message);

    console.log(`${procedureName}:`);
    console.log(response.result);
    console.log();
  });
}
