var jayson = require('jayson');
var PORT = 3001;


var client = jayson.client.http({port: PORT});
console.log("Connected to server on port: ", PORT);

//Run-thru all of the commands
// logGenericResult('echo', {message: 'oreo'}, client);
// logGenericResult('getOpenGames', null, client);
// logGenericResult('joinGame', {gameId: 'df32fdf8-b198-43cd-bb46-86a777fe676d'}, client);
// logGenericResult('createGame', null, client);
// logGenericResult('getGameState', {gameId: 'df32fdf8-b198-43cd-bb46-86a777fe676d'}, client);
logGenericResult('makeMove', {gameId: 'df32fdf8-b198-43cd-bb46-86a777fe676d', playerId: '03dabd18-ed45-4672-9a3f-209b7a0070ae'}, client);


function logGenericResult(procedureName, args, client) {
  client.request(procedureName, args, function(err, response) {
    if(err) throw err;
    if(response.error) console.log(response.error.message);

    console.log(`${procedureName}:`);
    console.log(response.result);
    console.log();
  });
}
