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
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Game.prototype.openGameFormat = function() {
    return {
      gameId: this.gameId,
      isPlayer0First: this.isPlayer0First,
      boardHeights: this.boardHeights,
      winCondition: this.winCondition
    }
  }

  return Game;
};
