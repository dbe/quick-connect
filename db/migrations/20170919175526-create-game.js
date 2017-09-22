'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gameId: {
        type: Sequelize.UUID
      },
      player0: {
        type: Sequelize.STRING
      },
      player1: {
        type: Sequelize.STRING
      },
      isPlayer0First: {
        type: Sequelize.BOOLEAN
      },
      boardHeights: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      winCondition: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      moves: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Games');
  }
};
