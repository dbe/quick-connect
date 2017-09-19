var jayson = require('jayson');
var PORT = 3001;

var client = jayson.client.http({
  port: PORT
});
console.log("Connected to server on port: ", PORT);






// logGenericResult('echo', {message: 'oreo'}, client);
logGenericResult('joinGame', {message: 'oreo'}, client);
// getOpenGames(client);

function logGenericResult(procedureName, args, client) {
  client.request(procedureName, args, function(err, response) {
    if(err) throw err;
    if(response.error) throw response.error.message;

    console.log(`${procedureName}:`);
    console.log(response.result);
  });
}

function getOpenGames(client) {
  logGenericResult('getOpenGames', null, client);
}
