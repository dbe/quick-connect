'use strict';
var forge = require('node-forge');
var Promise = require("bluebird");

module.exports = (sequelize, DataTypes) => {
  var Rating = sequelize.import('./Rating');
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

  User.ratingByUserName = function(userName) {
    return Rating.findAll({
      where: {userName: userName},
      limit: 1,
      order: [['createdAt', 'DESC']]
    }).then(ratings => {
      return ratings.length > 0 ? Number(ratings[0].rating) : Rating.DEFAULT_RATING;
    });
  }

  User.prototype.validPassword = function(password) {
    return this.passwordHash === User.hashPassword(password);
  }

  User.prototype.rating = function() {
    return User.ratingByUserName(this.userName);
  }

  return User;
}
