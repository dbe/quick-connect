'use strict';
var forge = require('node-forge');
var uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const KEY = 'the best way to protect the humans is to destroy them';
  var User = sequelize.define('User', {
    userId: DataTypes.UUID,
    userName: DataTypes.STRING,
    passwordHash: DataTypes.STRING
  });

  User.createWithPassword = function(username, password) {
    return User.create({
      userId: uuidv4(),
      userName: username,
      passwordHash: User.hashPassword(password)
    })
  }

  User.hashPassword = function(password) {
    return forge.md.sha256.create().update(password).digest().toHex();
  }

  User.login = (userName, password, successCallback, failureCallback) => {
    User.findByUserName(userName).then(user => {
      if (user && user.validPassword(user, password)) {
        successCallback(user);
      } else {
        failureCallback();
      }
    })
  }

  User.findByUserName = (userName) => {
    return User.find({ where: { userName } });
  }

  User.prototype.validPassword = (user, password) => {
    var md = forge.md.sha256.create();
    md.update(password);

    if (user.passwordHash === md.digest().toHex()) {
      return true;
    } else {
      return false;
    }
  }

  return User;
}
