'use strict';
var uuidv4 = require('uuid/v4');
console.log("In seed games")

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Games', [
      {
        gameId: uuidv4(),
        player0Id: uuidv4(),
        player1Id: uuidv4(),
        isPlayer0First: true,
        boardHeights: [8, 8, 8, 8, 8, 8, 8],
        winCondition: [4],
        moves: [0, 1, 4, 6, 3, 5, 3, 2, 0, 1, 4, 4, 3, 5, 3, 2],
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        gameId: uuidv4(),
        player0Id: uuidv4(),
        player1Id: uuidv4(),
        isPlayer0First: true,
        boardHeights: [8, 7, 8, 6, 8, 4, 8],
        winCondition: [4],
        moves: [0, 1, 4, 6, 3, 5, 3, 2],
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        gameId: uuidv4(),
        player0Id: uuidv4(),
        player1Id: uuidv4(),
        isPlayer0First: true,
        boardHeights: [8, 8, 8, 8, 8, 8, 8],
        winCondition: [4],
        moves: [0, 1, 4, 6, 3, 5, 3, 2],
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        gameId: uuidv4(),
        player0Id: uuidv4(),
        player1Id: uuidv4(),
        isPlayer0First: true,
        boardHeights: [8, 8, 8, 8, 8, 8, 8],
        winCondition: [4],
        moves: [0, 1, 4, 6, 3, 5, 3, 2],
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        gameId: uuidv4(),
        player0Id: uuidv4(),
        player1Id: uuidv4(),
        isPlayer0First: true,
        boardHeights: [8, 8, 8, 8, 8, 8, 8],
        winCondition: [4],
        moves: [0, 1, 4, 6, 3, 5, 3, 2],
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        gameId: uuidv4(),
        player0Id: uuidv4(),
        player1Id: uuidv4(),
        isPlayer0First: true,
        boardHeights: [8, 8, 8, 8, 8, 8, 8],
        winCondition: [4],
        moves: [0, 1, 4, 6, 3, 5, 3, 2],
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Games', null, {});
  }
};
