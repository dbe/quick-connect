const service = {
  echo,
  getOpenGames,
  joinGame,
  createGame,
  getGameState,
  makeMove
}

//Expects args: {message: string}
function echo(args, callback) {
  callback(null, args.message);
}

//Expects no args
function getOpenGames(args, callback) {
  callback(null, ['sdf3523h1h1lk3###', 'lkasdjfkl1188383838']);
}

function joinGame(args, callback) {
  if(isRandomFail()) {
    callback({code: 500, message: "Cannot Join Game"});
  } else {
    callback(null, {playerId: "lkajsdflkj1012893", isPlayer0First: true})
  }
}

function createGame(args, callback) {

}

function getGameState(args, callback) {

}

function makeMove(args, callback) {

}




//Just for testing purposes. Fakes functions randomly fail
function isRandomFail() {
  return Math.random() < 0.2;
}

export default service;
