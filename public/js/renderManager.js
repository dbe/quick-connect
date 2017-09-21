window.qc = window.qc || {};
window.qc.RenderManager = RenderManager;


function RenderManager(renderer) {
  var gameStep = 0;
  var maxStep = renderer.numMoves;
  var timeoutId = null;

  this.playByTime = playByTime;
  this.stepGame = stepGame;
  this.cancelPlayback = cancelPlayback;


  function playByTime(time, loop) {
    console.log("In playByTime: ", gameStep);
    renderer.playGame(gameStep);
    gameStep++;

    if(gameStep === maxStep + 1) {
      if(loop) {
        gameStep = 0;
      }
    }

    if(gameStep <= maxStep) {
      timeoutId = setTimeout(playByTime, time, time, loop);
    }
  }

  function stepGame(step) {
    var nextStep = gameStep + step;

    if(nextStep < 0 || nextStep > maxStep) {
      return;
    }

    gameStep = nextStep;
    renderer.playGame(gameStep);
  }

  function cancelPlayback() {
    if(timeoutId !== null) {
      clearTimeout(timeoutId);
    }
  }
}
