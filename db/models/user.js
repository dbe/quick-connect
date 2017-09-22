'use strict';
var forge = require('node-forge');
var Promise = require("bluebird");

module.exports = (sequelize, DataTypes) => {
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
        if (user && user.validPassword(user, password)) {
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

  User.prototype.validPassword = (user, password) => {
    return user.passwordHash === User.hashPassword(password);
  }

  return User;
}
