let userName = process.argv[2];
let password = process.argv[3];

if(!userName || !password) {
  console.log("Please pass userName and password via command line.");
  console.log("Usage: node lib/iWinBot.js userName password");
  process.exit(1);
}

var jayson = require('jayson');
var Promise = require("bluebird");

var client = jayson.client.http('http://localhost:3002/rpc');
var request = Promise.promisify(client.request, {context: client});

joinGame(userName, password).then(gameId => {
  console.log("Joined game: ", gameId);
  play(gameId);
})

function play(gameId) {
  waitForMyTurn(gameId).then(gameState => {
    console.log(`gameState.isGameOver: ${gameState.isGameOver}`);
    if(!gameState.isGameOver) {
      makeMove(gameId, decideMove(gameState)).then(() => {
        play(gameId);
      });
    }
  });
}

function waitForMyTurn(gameId) {
  return new Promise((resolve) => {
    pollUntilMyTurn(gameId, resolve);
  });
}

function pollUntilMyTurn(gameId, resolve) {
  getGameState(gameId).then(gameState => {
    if(gameState.isStarted && isMyTurn(gameState)) {
      resolve(gameState);
    } else {
      console.log("Still not my turn");
      if(!gameState.isGameOver) {
        setTimeout(pollUntilMyTurn, 1000, gameId, resolve);
      }
    }
  });
}

function makeMove(gameId, moves) {
  return request('makeMove', {gameId, userName, password, moves}).then(resp => {
    return resp.result;
  });
}

function getGameState(gameId) {
  return request('getGameState', {gameId}).then(resp => {
    return resp.result;
  });
}

function joinGame(userName, password) {
  return request('joinGame', {userName, password}).then(resp => {
    console.log(resp);
    return resp.result.gameId;
  });
}

//Pure Game Logic Code
function isMyTurn(gameState) {
  return amIplayer0(gameState) === isPlayer0Turn(gameState);
}

function amIplayer0(gameState) {
  return gameState.player0 === userName;
}

function isPlayer0Turn(gameState) {
  return gameState.moves.length % 2 === 0;
}

function decideMove(gameState) {
  return gameState.moves.concat(Math.floor(Math.random() * gameState.boardHeights.length));
}
