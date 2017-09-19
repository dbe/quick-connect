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
//Returns: [Game] where player1Id is null
function getOpenGames(args, callback) {
  Game.findAll({where: {player1Id: null}}).then(games => {
    callback(null, games.map(game => game.openGameFormat()));
  });
}

//Expects: args: {gameId: uuid}
//Returns: {playerId: uuid, isPlayer0: boolean} if successfully joined
//Throws: CannotJoin
//TODO: Clean this up, add transactions to avoid race conditions
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
//Returns: {gameId: uuid, playerId: uuid, isPlayer0: boolean}
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

  // callback(null, gameState);
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
