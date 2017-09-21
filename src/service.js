import { sequelize, Game, User } from '../db/models';

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
    callback(null, games.map(game => game.gameState()));
  });
}

//Expects: args: {gameId: uuid, userName: string, password: string}
//Returns: {playerId: uuid} if successfully joined
//Throws: CannotJoin
//TODO: Clean this up, add transactions to avoid race conditions
function joinGame(args, callback) {
  User.login(args.userName, args.password,
    (user) => {
      Game.find({where: {gameId: args.gameId}}).then(game => {
        if(game.player1Id !== null) {
          callback({code: 500, message: "Game was already full."});
        } else {
          game.update({player1Id: user.userId}).then((updatedGame) => {
            callback(null, {playerId: updatedGame.player1Id});
          });
        }
      });
    },
    () => {
      callback({code: 500, message: "Invalid login"});
    })
}

//Expects no args
//Returns: {gameId: uuid, playerId: uuid}
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
    callback(null, {gameId: game.gameId, playerId: game.player0Id});
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

//Expects: {gameId: uuid, playerId: uuid, moves: List<int>}
//Returns: {status: string}
function makeMove(args, callback) {
  Game.findByGameAndPlayerId(args.gameId, args.playerId).then(game => {
    if(game === null) {
      return callback({code: 500, message: "Could not find game"});
    }

    if(!game.isStarted()) {
      return callback({code: 500, message: "Game has not started yet. Please wait for another player to join"});
    }

    let gameOver = game.isGameOver();
    if(gameOver) {
      return callback({code: 500, message: `Cannot make move. Game is over: ${gameOver.message}`});
    }

    if(!game.isPlayerTurnById(args.playerId)) {
      return callback({code: 500, message: "It is not your turn."});
    }

    let move = game.extractIntendedMove(args.moves);
    if(game.isMoveLegal(move) === false) {
      return callback({code: 500, message: "Illegal Move"});
    }

    game.makeMove(move);
    game.update({moves: game.moves}).then(game => {
      return callback(null, {status: "ok"});
    });
  });
}

export default service;
