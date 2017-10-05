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
    setBoardState(game.boardHeights, game.isPlayer0First, game.moves);
    setGameOver(game.boardHeights, game.moves, game.winCondition);
  }

  setBoardState(boardHeights, isPlayer0First, moves) {
    let state = [];
    let player = isPlayer0First ? 0 : 1;

    for(let i = 0; i < boardHeights.length; i++) {
      state.push([]);
    }

    moves.forEach(move => {
      state[move].push(player);
      player = (player + 1) % 2;
    });

    this.state = state;
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

  setGameOver(boardHeights, moves, winCondition) {
    //TODO: This only handles single win conditions
    let winCount = winCondition[0]

    for(let col = 0; col < boardHeights.length; col++) {
      for(let row = 0; row < boardHeights[col]; row++) {
        let player = this.state[col][row];
        if(player === undefined) continue;

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
            this.isGameOver = true;
            this.isPlayer0Winner = player === 0;
            return;
          }
        }
      }
    }

    //Draw
    if(this.isBoardFull(boardHeights, moves)) {
      this.isGameOver = true;
      this.isPlayer0Winner = null;
      return;
    }

    //Game not over
    this.isGameOver = false;
    this.isPlayer0Winner = null;
  }

  isBoardFull(boardHeights, moves) {
    return moves.length === boardHeights.reduce((sum, height) => sum + height, 0);
  }
}
