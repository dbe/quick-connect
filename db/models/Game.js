'use strict';

var BoardState = require('../../lib/boardState.js').default;
const uuidv4 = require('uuid/v4');
var EloRank = require('elo-rank');
var elo = new EloRank();


module.exports = (sequelize, DataTypes) => {
  var Rating = sequelize.import('./Rating');
  var User = sequelize.import('./User');

  var Game = sequelize.define('Game', {
    gameId: DataTypes.UUID,
    player0: DataTypes.STRING,
    player1: DataTypes.STRING,
    isGameOver: DataTypes.BOOLEAN,
    isPlayer0First: DataTypes.BOOLEAN,
    isPlayer0Winner: DataTypes.BOOLEAN,
    boardHeights: DataTypes.ARRAY(DataTypes.INTEGER),
    winCondition: DataTypes.ARRAY(DataTypes.INTEGER),
    moves: DataTypes.ARRAY(DataTypes.INTEGER)
  });

  Game.findByGameId = function(gameId) {
    return Game.find({where: {gameId: gameId}});
  }

  Game.findByGameAndUserName = function(gameId, userName) {
    return Game.find({where: {
      gameId: gameId,
      $or: [
        {
          player0: {
            $eq: userName
          }
        },
        {
          player1: {
            $eq: userName
          }
        }
      ]
    }});
  }

  Game.joinEmptyOrCreate = function(user) {
    return Game.findAllEmpty().then(games => {
      let eligibleGames = eligibleGamesForUser(games, user);

      if(eligibleGames.length > 0) {
        return eligibleGames[0].addUserToGame(user);
      } else {
        return Game.createGameWithUser(user);
      }
    });
  }

  //Filters out games that player is already a part of
  function eligibleGamesForUser(games, user) {
    return games.filter(game => {
      return game.player0 !== user.userName && game.player1 != user.userName;
    })
  }

  Game.findAllEmpty = function() {
    return Game.findAll({where: {player1: null}});
  }

  Game.createGameWithUser = function(user) {
    return Game.create({
      gameId: uuidv4(),
      player0: user.userName,
      player1: null,
      isPlayer0First: true,
      boardHeights: [8,8,8,8,8,8,8],
      winCondition: [4],
      moves: []
    });
  }

  function newRatingIfWon(a, b) {
    var expected = elo.getExpected(a, b);
    return elo.updateRating(expected, 1, a);
  }

  function newRatingIfLost(a, b) {
    var expected = elo.getExpected(a, b);
    return elo.updateRating(expected, 0, a);
  }

  //Only call when game first ends
  Game.prototype.updateRatings = function(isPlayer0Winner) {
    User.ratingByUserNames(this.player0, this.player1)
    .then(ratings => {
      let [player0Rating, player1Rating] = ratings;
      let newPlayer0Rating, newPlayer1Rating;

      //TODO: Handle actually calcing elo for draws
      if(isPlayer0Winner === null) {
        return;
      } else if(isPlayer0Winner) {
        newPlayer0Rating = newRatingIfWon(player0Rating, player1Rating);
        newPlayer1Rating = newRatingIfLost(player1Rating, player0Rating);
      } else {
        newPlayer0Rating = newRatingIfLost(player0Rating, player1Rating);
        newPlayer1Rating = newRatingIfWon(player1Rating, player0Rating);
      }

      Rating.create({
        gameId: this.gameId,
        userName: this.player0,
        opponent: this.player1,
        rating: newPlayer0Rating
      });

      Rating.create({
        gameId: this.gameId,
        userName: this.player1,
        opponent: this.player0,
        rating: newPlayer1Rating
      });
    });
  }

  //Make active player lose the game
  Game.prototype.timeout = function() {
    let update = {
      isGameOver: true,
      isPlayer0Winner: !this.isPlayer0Turn()
    }

    return this.update(update);
  }

  Game.prototype.addUserToGame = function(user) {
    return this.update({player1: user.userName});
  }

  //Given moves by a player, make sure that they match up, and extract which "move" they want to make
  //Returns the column which the player intends to make a move, or null if the moveset does not match up
  Game.prototype.extractIntendedMove = function(moves) {
    if(moves.length !== this.moves.length + 1) {
      return null;
    }

    for(let i = 0; i < this.moves.length; i++) {
      if(this.moves[i] !== moves[i]) {
        return null;
      }
    }

    return moves[moves.length - 1];
  }

  Game.prototype.isUserTurnByUserName = function(userName) {
    let isPlayer0 = this.player0 === userName;

    return isPlayer0 === this.isPlayer0Turn();
  }

  Game.prototype.isPlayer0Turn = function() {
    let isFirstPlayersTurn = this.moves.length % 2 == 0;

    return isFirstPlayersTurn === this.isPlayer0First;
  }

  Game.prototype.isStarted = function() {
    return this.player0 !== null && this.player1 !== null;
  }

  Game.prototype.getBoardState = function() {
    return new BoardState(this);
  }

  Game.prototype.makeMove = function(move) {
    this.moves.push(move);
    let update = { moves: this.moves };

    let bs = this.getBoardState();
    if(bs.isGameOver) {
      Object.assign(update, {
        isGameOver: bs.isGameOver,
        isPlayer0Winner: bs.isPlayer0Winner
      });

      this.updateRatings(bs.isPlayer0Winner);
    }

    return this.update(update);
  }

  Game.prototype.isMoveLegal = function(move) {
    if(move === null || move < 0 || move >= this.boardHeights.length) {
      return false;
    }

    //Handles case where numbers are not whole
    if(Math.floor(move) !== move) {
      return false;
    }

    if(this.moveCountForCol(move) >= this.boardHeights[move]) {
      return false;
    }

    return true;
  }

  Game.prototype.moveCountForCol = function(col) {
    return this.moves.filter(move => {
      return(move === col);
    }).length;
  }

  Game.prototype.gameState = function() {
    return {
      gameId: this.gameId,
      isPlayer0First: this.isPlayer0First,
      player0: this.player0,
      player1: this.player1,
      isStarted: this.isStarted(),
      isGameOver: this.isGameOver,
      isPlayer0Winner: this.isPlayer0Winner,
      boardHeights: this.boardHeights,
      winCondition: this.winCondition,
      moves: this.moves
    }
  }

  return Game;
};
