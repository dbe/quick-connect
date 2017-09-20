import test from 'ava';
import { Game } from '../../db/models';




test('detects game over', t => {
  let game = Game.build({
    moves: [
      0, 1, 0, 1, 0, 1, 0
    ],
    boardHeights: [
      5, 5, 5, 5, 5
    ],
    winCondition: [4]
  });




	t.true(game.isGameOver());
});
