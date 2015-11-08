var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.GameView = function () {
};



Asteroids.GameView.prototype.start = function (canvasEl, statsEl) {
  canvasEl.height = canvasEl.scrollHeight;
  canvasEl.width = canvasEl.scrollWidth;
  var ctx = canvasEl.getContext("2d");
  this.ctx = ctx;
  this.game = new Asteroids.Game(canvasEl, ctx);


  window.setInterval((function () {
    this.game.step();
    this.game.draw(ctx);

  }).bind(this), 40);


};
