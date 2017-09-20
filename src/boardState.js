export default class BoardState {
  constructor(game) {
    this.state = this.buildBoardState(game.moves, game.boardHeights, game.isPlayer0First);
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

  isGameOver() {

  }
}
