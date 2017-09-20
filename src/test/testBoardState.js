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
