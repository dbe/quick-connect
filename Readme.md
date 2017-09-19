To run server:
yarn start

To run Client:
yarn start-client

Service Definition:
getOpenGames() -> List<{gameId: string, description: string}>
joinGame(gameId) -> {playerId:string, isPlayer0:boolean} throws CannotJoin
createGame() -> {gameId: string, playerId: string, isPlayer0:boolean}
getGameState(gameId, playerId) -> GameState
makeMove(GameState) -> status:string throws InvalidMove

GameState: {
  isPlayer0First: boolean,
  boardHeights: List<int>,
  winCondition: List<int>,
  moves: List<int>
}

Example GameState: {
  isPlayer0First: true,
  boardHeights: [4, 4, 4, 4, 4], //5x4 grid (width of 5, height of 4)
  winCondition: [4], //Just get 4 in a row
  moves: [0, 1, 4, 4, 2] //Player 0 placed in column 0, 4, and 2. Player 1 placed in columns 1 and 4.
}



Models:

Game
  - gameId: uuid
  - player0Id: uuid
  - player1Id: uuid
  - isPlayer0First: boolean
  - boardHeights: List<int>
  - winCondition: List<int>
  - moves: List<int>


  //./node_modules/.bin/sequelize model:generate --name Game --attributes gameId:uuid,player0Id:uuid,player1Id:uuid,isPlayer0First:boolean,
