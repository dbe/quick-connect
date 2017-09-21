window.qc = window.qc || {};
window.qc.RenderManager = RenderManager;


function RenderManager(renderer) {
  var gameStep = 0;
  var maxStep = renderer.numMoves;
  var timeoutId = null;

  this.playByTime = playByTime;
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

  function cancelPlayback() {
    if(timeoutId !== null) {
      clearTimeout(timeoutId);
    }
  }
}
