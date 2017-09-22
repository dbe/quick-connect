let userName = process.argv[2];
let password = process.argv[3];

if(!userName || !password) {
  console.log("Please pass userName and password via command line.");
  console.log("Usage: node lib/iWinBot.js userName password");
  process.exit(1);
}

var jayson = require('jayson');
var PORT = 3001;
var client = jayson.client.http({port: PORT});
console.log("Connected to server on port: ", PORT);

client.request('joinGame', {userName, password}, (err, res) => {
  console.log(res);
});




// function logGenericResult(procedureName, args, client) {
//   client.request(procedureName, args, function(err, response) {
//     if(err) throw err;
//     if(response.error) console.log(response.error.message);
//
//     console.log(`${procedureName}:`);
//     console.log(response.result);
//     console.log();
//   });
// }
