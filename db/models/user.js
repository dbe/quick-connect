'use strict';
var forge = require('node-forge');
var Promise = require("bluebird");

module.exports = (sequelize, DataTypes) => {
  var Rating = sequelize.models.Rating;
  const KEY = 'the best way to protect the humans is to destroy them';
  var User = sequelize.define('User', {
    userName: DataTypes.STRING,
    passwordHash: DataTypes.STRING
  });

  User.createWithPassword = function(username, password) {
    return User.create({
      userName: username,
      passwordHash: User.hashPassword(password)
    })
  }

  User.hashPassword = function(password) {
    return forge.md.sha256.create().update(password).digest().toHex();
  }

  User.login = (userName, password) => {
    return new Promise(function(resolve, reject) {
      User.findByUserName(userName).then(user => {
        if (user && user.validPassword(password)) {
          resolve(user);
        } else {
          reject();
        }
      })
    })
  }

  User.findByUserName = (userName) => {
    return User.find({ where: {userName}});
  }

  User.prototype.validPassword = (password) => {
    return this.passwordHash === User.hashPassword(password);
  }

  User.prototype.rating = function() {
    return Rating.findAll({
      where: {userName: this.userName},
      limit: 1,
      order: [['createdAt', 'DESC']]
    }).then(ratings => {
      return ratings.length > 0 ? ratings[0] : Rating.DEFAULT_RATING;
    });
  }

  return User;
}
