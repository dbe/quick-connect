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
