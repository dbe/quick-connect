'use strict';
module.exports = (sequelize, DataTypes) => {
  var Rating = sequelize.define('Rating', {
    gameId: DataTypes.UUID,
    userName: DataTypes.STRING,
    opponent: DataTypes.STRING,
    rating: DataTypes.BIGINT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Rating.DEFAULT_RATING = 1500;

  return Rating;
};
