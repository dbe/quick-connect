let userName = process.argv[2];
let password = process.argv[3];

if(!userName || !password) {
  console.log("Please pass userName and password via command line.");
  console.log("Usage: node lib/iWinBot.js userName password");
  process.exit(1);
}

var jayson = require('jayson');
var Promise = require("bluebird");
var PORT = 3001;
var client = jayson.client.http({port: PORT});
var request = Promise.promisify(client.request, {context: client});
console.log("Connected to server on port: ", PORT);

joinGame(userName, password).then(gameId => {
  console.log(gameId)
  // play(gameId);
})

function play(gameId) {
  waitForMyTurn(gameId).then(gameState => {
    console.log("My turn!");
    console.log(gameState);
    // makeMove(gameId, decideMove(gameState)).then(() => {
    //   play(gameId));
    // }
  });
}



function waitForMyTurn(gameId) {
  return new Promise((resolve) => {
    pollUntilMyTurn(gameId, resolve);
  });
}

function pollUntilMyTurn(gameId, resolve) {
  getGameState(gameId).then(gameState => {
    console.log(`gameState.isStarted: ${gameState.isStarted}`);
    console.log(`isMyTurn(gameState): ${isMyTurn(gameState)}`);
    if(gameState.isStarted && isMyTurn(gameState)) {
      resolve(gameState);
    } else {
      setTimeout(pollUntilMyTurn, 1000, gameId, resolve);
    }
  });
}

function getGameState(gameId) {
  return request('getGameState', {gameId}).then(resp => {
    return resp.result;
  });
}

function joinGame(userName, password) {
  return request('joinGame', {userName, password}).then(resp => {
    return resp.result.gameId;
  });
}



//Pure Game Logic Code
function isMyTurn(gameState) {
  return amIplayer0 === gameState.isPlayer0Turn;
}

function amIplayer0(gameState) {
  return gameState.player0UserName === userName;
}

function isPlayer0Turn(gameState) {
  return gameState.moves.length % 2 === 0;
}


// function logGenericResult(procedureName, args, client) {
//   client.request(procedureName, args, function(err, response) {
//     if(err) throw err;
//     if(response.error) console.log(response.error.message);
//
//     console.log(`${procedureName}:`);
//     console.log(response.result);
//     console.log();
//   });
// }
