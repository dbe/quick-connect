import { sequelize, Game } from '../db/models';

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

//Expects: gameId:uuid
//Returns: playerId:uuid and isPlayer0:boolean if successfully joined
//Throws: CannotJoin
function joinGame(args, callback) {
  Game.find({where: {gameId: args.gameId}}).then(game => {
    if(game.player1Id !== null) {
      callback({code: 500, message: "Game was already full."});
    } else {
      game.update({player1Id: uuidv4()}).then((updatedGame) => {
        callback(null, {playerId: updatedGame.player1Id, isPlayer0: false});
      });
    }
  });
}

//Expects no args
function createGame(args, callback) {
  Game.create({
    gameId: uuidv4(),
    player0Id: uuidv4(),
    player1Id: null,
    isPlayer0First: true,
    boardHeights: [8,8,8,8,8,8,8],
    winCondition: [4],
    moves: []
  }).then(game =>  {
    callback(null, {gameId: game.gameId, playerId: game.player0Id, isPlayer0: true});
  });
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

export default service;
