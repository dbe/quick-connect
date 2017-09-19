const uuidv4 = require('uuid/v4');

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
  callback(null, [uuidv4(), uuidv4()]);
}

function joinGame(args, callback) {
  if(isRandomFail()) {
    callback({code: 500, message: "Cannot Join Game"});
  } else {
    callback(null, {playerId: uuidv4(), isPlayer0: true})
  }
}

//Expects no args
function createGame(args, callback) {
  callback(null, {gameId: uuidv4(), playerId: uuidv4(), isPlayer0: false});
}

function getGameState(args, callback) {
  let gameState = {
    isPlayer0First: true,
    boardHeights: [4, 4, 4, 4, 4],
    winCondition: [4],
    moves: [0, 1, 4, 4, 2]
  };

  callback(null, gameState);
}

function makeMove(args, callback) {
  if(isRandomFail()) {
    callback({code: 500, message: "InvalidMove"});
  } else {
    callback(null, {status: 'ok'})
  }
}




//Just for testing purposes. Fakes functions randomly fail
function isRandomFail() {
  return Math.random() < 0.2;
}

//Just for testing, generates a uuid
function uuid() {

}

export default service;
