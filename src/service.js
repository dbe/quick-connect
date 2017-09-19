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

function joinGame(args, callback) {
  if(isRandomFail()) {
    callback({code: 500, message: "Cannot Join Game"});
  } else {
    callback(null, {playerId: uuidv4(), isPlayer0: true})
  }
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
  }).then((a, b, c) =>  {
    console.log("In callback of create");
    console.log(a);
    console.log(b);
    console.log(c);
  });

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

export default service;
