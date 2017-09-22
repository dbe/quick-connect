'use strict';
var uuidv4 = require('uuid/v4');
module.exports = {
  up: (queryInterface, Sequelize) => {
    let games = [];
    for(let i = 0; i < 100; i++) {
      let sampleGame = {
        gameId: uuidv4(),
        player0: 'Player 0',
        player1: 'Player 1',
        isPlayer0First: true,
        boardHeights: [8, 8, 8, 8, 8, 8, 8],
        winCondition: [4],
        moves: [0, 1, 4, 6, 3, 5, 3, 2, 0, 1, 4, 4, 3, 5, 3, 2],
        "createdAt": new Date(),
        "updatedAt": new Date()
      };

      games.push(sampleGame);
    }

    // return queryInterface.bulkInsert('Games', games, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Games', null, {});
  }
};
