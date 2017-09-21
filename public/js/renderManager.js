window.qc = window.qc || {};
window.qc.RenderManager = RenderManager;


function RenderManager(renderer) {
  var gameStep = -1;
  var maxStep = renderer.numMoves;
  var timeoutId = null;

  this.playing = false;
  this.playByTime = playByTime;
  this.stepGame = stepGame;
  this.cancelPlayback = cancelPlayback;


  function playByTime(time, loop) {
    this.playing = true;
    gameStep++;
    renderer.playGame(gameStep);

    if(gameStep === maxStep + 1) {
      if(loop) {
        gameStep = -1;
      }
    }

    if(gameStep <= maxStep) {
      timeoutId = setTimeout(playByTime, time, time, loop);
    } else {
      this.playing = false;
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
      this.playing = false;
    }
  }
}
