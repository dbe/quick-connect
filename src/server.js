var jayson = require('jayson');

// create a server
var server = jayson.server({
  echo: function(args, callback) {
    callback(null, args);
  },
  getOpenGames: getOpenGames
});

function getOpenGames(args, callback) {
  callback(null, ['sdf3523h1h1lk3###', 'lkasdjfkl1188383838']);
}

server.http().listen(3001);
console.log("Listening on port 3001");
