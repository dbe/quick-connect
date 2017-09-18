var jayson = require('jayson');
var PORT = 3001;

var client = jayson.client.http({
  port: PORT
});

console.log("Connected to server on port: ", PORT);
getOpenGames(client);


function getOpenGames(client) {
  client.request('getOpenGames', null, function(err, response) {
    if(err) throw err;
    if(response.error) throw response.error.message;

    console.log("Open Games: ", response.result)
  });
}
