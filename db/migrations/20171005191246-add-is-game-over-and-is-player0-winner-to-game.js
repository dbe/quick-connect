'use strict';

var Game = require('../models').Game;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Games',
        'isGameOver',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
      ),
      queryInterface.addColumn(
        'Games',
        'isPlayer0Winner',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    ]).then(() => {
      return Game.findAll().then(games => {
        let gameUpdates = [];

        games.forEach(game => {
          let bs = game.getBoardState();

          console.log(`Updating game over stats for gameId: ${game.gameId}`)
          gameUpdates.push(game.update({
            isGameOver: bs.isGameOver,
            isPlayer0Winner: bs.isPlayer0Winner
          }));
        });

        return Promise.all(gameUpdates);
      })
    });
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Games', 'isGameOver'),
      queryInterface.removeColumn('Games', 'isPlayer0Winner')
    ]);
  }
};
