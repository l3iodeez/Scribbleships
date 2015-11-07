var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.GameView = function () {
};



Asteroids.GameView.prototype.start = function (canvasEl, statsEl) {
  debugger
  canvasEl.height = canvasEl.scrollHeight;
  canvasEl.width = canvasEl.scrollWidth;
  var ctx = canvasEl.getContext("2d");
  this.ctx = ctx;
  // var img = new Image(); // CODE FOR BACKGROUND IMAGE
  // img.src = '../image/bg.jpg';
  // img.onload = function () {
  //   ctx.drawImage(img, 0, 0);
  // };

  this.game = new Asteroids.Game(canvasEl);


  window.setInterval((function () {
    this.game.step();
    this.game.draw(ctx);

  }).bind(this), 40);


};
