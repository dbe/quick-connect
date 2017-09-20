import test from 'ava';
import { Game } from '../../db/models';


test('detects legal move', t => {
  let game = Game.build({
    moves: [1, 2, 2],
    boardHeights: [0, 1, 3]
  });

  t.false(game.isMoveLegal(0))
  t.false(game.isMoveLegal(-1))
  t.false(game.isMoveLegal(3))
  t.false(game.isMoveLegal(1))

  t.true(game.isMoveLegal(2))
});


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
