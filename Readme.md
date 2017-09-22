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

## Express server
Running the server will also create an http server on port 3002. The index of this server will show games in html form.

### Game data api
The express server also serves game data in json at the endpoint /api/v1/games

# Service Definition:
- (authenticated) joinGame(userName: string, password: string) -> {gameId:uuid}
- getGameState(gameId:uuid) -> GameState
- (authenticated) makeMove(gameId: uuid, userName: string, password: string, moves: List<int>) -> status:string ({code: 200} throws InvalidMove

GameState: {
  gameId: uuid,
  isPlayer0First: boolean,
  player0: string,
  player1: string,
  boardHeights: List<int>,  
  winCondition: List<int>,  
  moves: List<int>  
  isGameOver: boolean,
  isPlayer0Winner: boolean (nullable for draw)
}


Rating:
gameId
userName
opponent
rating
