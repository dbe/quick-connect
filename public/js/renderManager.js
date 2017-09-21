window.qc = window.qc || {};
window.qc.RenderManager = RenderManager;


function RenderManager(renderer) {
  var gameStep = 0;

  this.playByTime = playByTime;

  function playByTime(time) {
    console.log("In playByTime: ", gameStep);
    console.log(playByTime);
    renderer.playGame(gameStep);
    gameStep++;

    setTimeout(playByTime, time, time);
  }
}
