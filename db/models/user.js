'use strict';
var forge = require('node-forge');

module.exports = (sequelize, DataTypes) => {
  const KEY = 'the best way to protect the humans is to destroy them';
  var User = sequelize.define('User', {
    userId: DataTypes.UUID,
    userName: DataTypes.STRING,
    passwordHash: DataTypes.STRING
  });

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
    // console.log(md.digest().toHex());
    // console.log(user.passwordHash);
    // console.log(user.passwordHash === md.digest().toHex());
    // console.log(user.passwordHash == md.digest().toHex());
    console.log(user.passwordHash.length);
    // console.log(md.digest().toHex().length);
    if (user.passwordHash === md.digest().toHex()) {
      return true;
    } else {
      return false;
    }
  }

  return User;
}
