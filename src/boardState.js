const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

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
    return this.containsToken(col, row) && this.state[col][row] === playerNumber;
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
    //TODO: This only handles single win conditions
    let winCount = this.game.winCondition[0]

    for(let col = 0; col < this.game.boardHeights.length; col++) {
      for(let row = 0; row < this.game.boardHeights[col]; row++) {
        let player = this.state[col][row];

        for(let dirIndex = 0; dirIndex < DIRECTIONS.length; dirIndex++) {
          let dir = DIRECTIONS[dirIndex];
          let win = true;

          for(let count = 1; count < winCount; count++) {
            let checkCol = col + (count * dir[0]);
            let checkRow = row + (count * dir[1]);
            if(!this.isPlayerToken(checkCol, checkRow, player)) {
              win = false;
              break;
            }
          }

          if(win) {
            let message = `Player ${player} wins. Starting at: [${col},${row}] going in direction: ${dir}`;
            console.log(message);

            return {
              message,
              winner: player,
              col: col,
              row: row,
              dir: dir
            }
          }
        }
      }
    }

    return false;
  }
}
