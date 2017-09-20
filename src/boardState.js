export default class BoardState {
  constructor(game) {
    this.state = this.buildBoardState(game.moves, game.boardHeights, game.isPlayer0First);
    this.game = game;
  }

  buildBoardState(moves, boardHeights, isPlayer0First) {
    let state = [];
    let player = isPlayer0First ? 0 : 1;

    for(let i = 0; i < boardHeights.length; i++) {
      state.push([]);
    }

    moves.forEach(move => {
      state[move].push(player);
      player = (player + 1) % 2;
    });

    return state;
  }

  isPlayerToken(col, row, playerNumber) {
    // if(col < )
  }

  containsToken(col, row) {
    return !(
      col < 0 ||
      col >= this.state.length ||
      row < 0 ||
      row >= this.state[col].length
    );
  }

  isGameOver() {
    console.log("Calculating whether game is over")
    //TODO: This only handles single win conditions
    let winCount = this.game.winCondition[0]

    for(let col = 0; col < this.game.boardHeights.length; col++) {
      for(let row = 0; row < this.game.boardHeights[col]; row++) {
        console.log(`col: ${col} row: ${row}`);


      }
    }
  }
}
