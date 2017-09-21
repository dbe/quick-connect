window.qc = window.qc || {};
window.qc.Renderer = Renderer;

function Renderer($play, maxDimension, game) {
  PLAYER_TO_COLOR = ['red', 'black'];

  buildGrid(game.boardHeights, maxDimension);
  var coords = movesToCoords(game.moves, game.boardHeights.length, game.isPlayer0First);

  this.numMoves = coords.length;
  this.playGame = function(endMove) {
    clear();

    for(var i = 0; i < endMove && i < coords.length; i++) {
      var coord = coords[i];
      playMove(coord.col, coord.row, coord.player);
    }

  }

  //Takes the moves list and converts it to a list of {col: int, row: int, player: int}
  function movesToCoords(moves, numCols, isPlayer0First) {
    var player = isPlayer0First ? 0 : 1;
    var coords = [];
    var colCounts = [];

    for(var i = 0; i < numCols; i++) {
      colCounts[i] = 0;
    }

    moves.forEach(function(move) {
      var row = colCounts[move];
      coords.push({col: move, row: row, player: player});

      colCounts[move] = row + 1;
      player = (player + 1) % 2;
    });


    return coords;
  }

  function playMove(col, row, player) {
    $box = $(`.box[col=${col}][row=${row}]`);
    $box.append(`<div class="circle ${PLAYER_TO_COLOR[player]}"></div>`);
  }

  //Setup html functions
  function clear() {
    $('.circle').remove();
  }

  function calculateBoxSize(heights, maxDimension) {
    var maxCount = Math.max(heights.length, Math.max(...heights));
    return Math.floor(maxDimension / maxCount);
  }

  function buildGrid(heights, maxDimension) {
    var boxSize = calculateBoxSize(heights, maxDimension);
    console.log("Box size: ", boxSize);

    $(`<style type='text/css'> .box, .circle{width: ${boxSize}; height: ${boxSize}} </style>`).appendTo("head");

    heights.forEach(function(height, i) {
      appendCol(i, height);
    });
  }

  function appendCol(colNum, height) {
    $('.play').append(generateCol(colNum, height));
  }

  function generateCol(colNum, height) {
    var col = `<div class="play-col" col=${colNum}>`;

    for(var i = 0; i < height; i++) {
      var rowNum = height - i - 1;
      col += `<div class="box" row="${rowNum}" col="${colNum}"></div>`;
    }

    return col;
  }
}
