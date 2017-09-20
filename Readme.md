# Prereqs:
- Have postgres installed locally
- have npm or yarn installed locally

# Getting started:
- run `yarn` or `npm` to install node packages
- copy the database config template to the place your app will read from `cp db/database.json.template db/database.json`
- Edit db/database.json to reflect your postgres credentials
- run `./node_modules/.bin/sequelize db:create`
- run `./node_modules/.bin/sequelize db:migrate`


## To run server:
`yarn start`

## To run Client:
`yarn start-client`

## To run tests:
`yarn test`

# Service Definition:
- getOpenGames() -> List<GameState>
- joinGame(gameId) -> {playerId:uuid} throws CannotJoin
- createGame() -> {gameId: uuid, playerId: uuid}
- getGameState(gameId:uuid) -> GameState
- makeMove(gameId: uuid, playerId: uuid, moves: List<int>) -> status:string throws InvalidMove

GameState: {
  gameId: uuid,
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
