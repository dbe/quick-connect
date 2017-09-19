var jayson = require('jayson');
var PORT = 3001;

var client = jayson.client.http({
  port: PORT
});
console.log("Connected to server on port: ", PORT);






logGenericResult('echo', {message: 'oreo'}, client);
getOpenGames(client);
logGenericResult('joinGame', null, client);
logGenericResult('createGame', null, client);
logGenericResult('getGameState', null, client);
logGenericResult('makeMove', null, client);

function logGenericResult(procedureName, args, client) {
  client.request(procedureName, args, function(err, response) {
    if(err) throw err;
    if(response.error) console.log(response.error.message);

    console.log(`${procedureName}:`);
    console.log(response.result);
    console.log();
  });
}

function getOpenGames(client) {
  logGenericResult('getOpenGames', null, client);
}
