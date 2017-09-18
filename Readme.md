To run server:
yarn start

Service Definition:
getOpenGames() -> List<{gameId: string, description: string}>
joinGame(gameId) -> {playerId:string, isPlayer0:boolean} throws CannotJoin
createGame() -> {gameId: string, playerId: string, isPlayer0:boolean}
getGameState(gameId, playerId) -> GameState
makeMove(GameState) -> status:string throws InvalidMove

GameState: {
  boardHeights: List<int>,
  winCondition: List<int>,
  moves: List<int>
}

Example Board State: {
  boardHeights: [4, 4, 4, 4, 4], //5x4 grid (width of 5, height of 4)
  winCondition: [4], //Just get 4 in a row
  moves: [0, 1, 4, 4, 2] //Player 0 placed in column 0, 4, and 2. Player 1 placed in columns 1 and 4.
}
