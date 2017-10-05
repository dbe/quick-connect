'use strict';

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
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Games', 'isGameOver'),
      queryInterface.removeColumn('Games', 'isPlayer0Winner')
    ]);
  }
};
