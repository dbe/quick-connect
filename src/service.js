import { sequelize, Game, User } from '../db/models';
const uuidv4 = require('uuid/v4');
const Promise = require("bluebird");

const service = {
  echo,
  joinGame,
  getGameState,
  makeMove
}

//Expects args: {message: string}
function echo(args, callback) {
  callback(null, args.message);
}

//TODO: Clean this up, add transactions to avoid race conditions
//Expects: {userName: string, password: string}
//Returns: {gameId: string}
function joinGame(args, callback) {
  loginOrFail(args.userName, args.password, callback).then(user => {
    Game.joinEmptyOrCreate(user).then(game => {
      if(game.isStarted()) {
        setTurnTimeout(game);
      }

      callback(null, {gameId: game.gameId});
    });
  });
}

//Expects: {gameId: uuid}
//Returns: GameState
//TODO: Handle gameId not defined as well as the error case when no game is found
function getGameState(args, callback) {
  Game.findByGameId(args.gameId).then(game => {
    callback(null, game.gameState());
  });
}

//Expects: {userName: string, password: string, gameId: string, moves: [int]}
//Returns: {status: int} (200 is 'ok', 500 is 'error')
function makeMove(args, callback) {
  loginOrFail(args.userName, args.password, callback).then(user => {
    Game.findByGameAndUserName(args.gameId, user.userName).then(game => {
      if(game === null) {
        return callback({code: 500, message: "Could not find game"});
      }

      if(!game.isStarted()) {
        return callback({code: 500, message: "Game has not started yet. Please wait for another player to join"});
      }

      if(game.isGameOver) {
        return callback({code: 500, message: `Cannot make move. Game is over`});
      }

      if(!game.isUserTurnByUserName(user.userName)) {
        return callback({code: 500, message: "It is not your turn."});
      }

      let move = game.extractIntendedMove(args.moves);
      if(game.isMoveLegal(move) === false) {
        return callback({code: 500, message: "Illegal Move"});
      }

      game.makeMove(move).then((game) => {
        if(game.isGameOver()) {
          clearTurnTimeout(game);
        } else {
          setTurnTimeout(game);
        }

        return callback(null, {code: 200});
      });
    });
  });
}

//----------Util----------

// const TURN_TIMEOUT = 10 * 60 * 1000; //10 minutes
const TURN_TIMEOUT = 12000 //12 seconds
let gameTimeouts = {};

function setTurnTimeout(game) {
  clearTurnTimeout(game);

  gameTimeouts[game.gameId] = setTimeout(gameTimeout, TURN_TIMEOUT, game);
}

function clearTurnTimeout(game) {
  let timeout = gameTimeouts[game.gameId];
  if(timeout) {
    clearTimeout(timeout);
    delete gameTimeouts[game.gameId];
  }
}

//Times out game if needed
function gameTimeout(game) {
  console.log(`Game: ${game.gameId} timed out.`);

  clearTurnTimeout(game);
}

function loginOrFail(userName, password, callback) {
  return new Promise(function(resolve, reject) {
    User.login(userName, password).then(user => {
      resolve(user);
    }).catch(err => {
      callback({code: 500, message: "Invalid login"});
    });
  });
}

export default service;
