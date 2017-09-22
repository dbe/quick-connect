'use strict';

var User = require('../models').User;

module.exports = {
  up: (queryInterface, Sequelize) => {
    let users = [
      {
        userName: 'iwin',
        passwordHash: User.hashPassword('iwin'),
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        userName: 'iwin2',
        passwordHash: User.hashPassword('iwin2'),
        "createdAt": new Date(),
        "updatedAt": new Date()
      }
    ];

    return queryInterface.bulkInsert('Users', users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
