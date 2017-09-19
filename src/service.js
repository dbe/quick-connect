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

}

function createGame(args, callback) {

}

function getGameState(args, callback) {

}

function makeMove(args, callback) {

}

export default service;
