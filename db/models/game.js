'use strict';

var BoardState = require('../../lib/boardState.js').default;
const uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  var Game = sequelize.define('Game', {
    gameId: DataTypes.UUID,
    player0Id: DataTypes.UUID,
    player1Id: DataTypes.UUID,
    isPlayer0First: DataTypes.BOOLEAN,
    boardHeights: DataTypes.ARRAY(DataTypes.INTEGER),
    winCondition: DataTypes.ARRAY(DataTypes.INTEGER),
    moves: DataTypes.ARRAY(DataTypes.INTEGER)
  });

  Game.findByGameId = function(gameId) {
    return Game.find({where: {gameId: gameId}});
  }

  Game.findByGameAndPlayerId = function(gameId, playerId) {
    return Game.find({where: {
      gameId: gameId,
      $or: [
        {
          player0Id: {
            $eq: playerId
          }
        },
        {
          player1Id: {
            $eq: playerId
          }
        }
      ]
    }});
  }

  Game.joinEmptyOrCreate = function(user) {
    return Game.findAllEmpty().then(games => {
      let eligibleGames = eligibleGamesForUser(games, user);

      if(eligibleGames.length > 0) {
        return eligibleGames[0].addUserToGame(user);
      } else {
        return Game.createGameWithUser(user);
      }
    });
  }

  //Filters out games that player is already a part of
  function eligibleGamesForUser(games, user) {
    return games.filter(game => {
      return game.player0Id !== user.userId && game.player0Id != user.userId;
    })
  }

  Game.findAllEmpty = function() {
    return Game.findAll({where: {player1Id: null}});
  }

  Game.createGameWithUser = function(user) {
    return Game.create({
      gameId: uuidv4(),
      player0Id: user.userId,
      player1Id: null,
      isPlayer0First: true,
      boardHeights: [8,8,8,8,8,8,8],
      winCondition: [4],
      moves: []
    });
  }

  Game.prototype.addUserToGame = function(user) {
    return this.update({player1Id: user.userId});
  }

  //Given moves by a player, make sure that they match up, and extract which "move" they want to make
  //Returns the column which the player intends to make a move, or null if the moveset does not match up
  Game.prototype.extractIntendedMove = function(moves) {
    if(moves.length !== this.moves.length + 1) {
      return null;
    }

    for(let i = 0; i < this.moves.length; i++) {
      if(this.moves[i] !== moves[i]) {
        return null;
      }
    }

    return moves[moves.length - 1];
  }

  Game.prototype.isPlayerTurnById = function(playerId) {
    let isPlayer0 = this.player0Id === playerId;

    return isPlayer0 === this.isPlayer0Turn();
  }

  Game.prototype.isPlayer0Turn = function() {
    let isFirstPlayersTurn = this.moves.length % 2 == 0;

    return isFirstPlayersTurn === this.isPlayer0First;
  }

  Game.prototype.isStarted = function() {
    return this.player0Id !== null && this.player1Id !== null;
  }

  Game.prototype.isGameOver = function () {
    let bs = new BoardState(this);

    return bs.isGameOver();
  }

  Game.prototype.makeMove = function(move) {
    this.moves.push(move);
  }

  Game.prototype.isMoveLegal = function(move) {
    if(move === null || move < 0 || move >= this.boardHeights.length) {
      return false;
    }

    if(this.moveCountForCol(move) >= this.boardHeights[move]) {
      return false;
    }

    return true;
  }

  Game.prototype.moveCountForCol = function(col) {
    return this.moves.filter(move => {
      return(move === col);
    }).length;
  }

  Game.prototype.gameState = function() {
    return {
      gameId: this.gameId,
      isPlayer0First: this.isPlayer0First,
      isStarted: this.isStarted(),
      boardHeights: this.boardHeights,
      winCondition: this.winCondition,
      moves: this.moves
    }
  }

  return Game;
};
