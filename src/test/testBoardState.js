import test from 'ava';
import { Game } from '../../db/models';
import BoardState from '../boardState.js';

test('builds board state correctly', t => {
  let game = Game.build({
    moves: [1, 1, 2],
    boardHeights: [2, 2, 2],
    isPlayer0First: true
  });

  let bs = new BoardState(game);
  let expected = [
    [],
    [0, 1],
    [0]
  ];

  t.deepEqual(bs.state, expected);
});

test('containsToken works', t => {
  let game = Game.build({
    moves: [1, 1, 2],
    boardHeights: [2, 2, 2],
    isPlayer0First: true
  });

  let bs = new BoardState(game);

  console.log("OREO")
  console.log(bs)

  //Token
  t.true(bs.containsToken(1, 0));
  t.true(bs.containsToken(1, 1));
  t.true(bs.containsToken(2, 0));

  //No token
  t.false(bs.containsToken(0, 0));
  t.false(bs.containsToken(0, 1));
  t.false(bs.containsToken(0, 2));
  t.false(bs.containsToken(1, 2));
  t.false(bs.containsToken(2, 1));
  t.false(bs.containsToken(2, 2));

  //Out of bounds
  t.false(bs.containsToken(-1, 0));
  t.false(bs.containsToken(1, 3));
  t.false(bs.containsToken(1, -1));
});
