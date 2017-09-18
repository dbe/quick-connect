var jayson = require('jayson');

// create a client
var client = jayson.client.http({
  port: 3001
});

// invoke "add"
console.log("Adding 1 + 1");
client.request('add', [1, 1], function(err, response) {
  if(err) throw err;
  console.log(response.result); // 2
});
