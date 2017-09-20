'use strict';
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

  //TODO: Finish this
  Game.prototype.isGameOver = function () {
    return false;
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
      boardHeights: this.boardHeights,
      winCondition: this.winCondition,
      moves: this.moves
    }
  }

  return Game;
};
