var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.GameView = function () {
  this.messageText = "Welcome to Scribbleships";
  this.messagePos = 650;
  this.lastTime = 0;
};


Asteroids.GameView.prototype.start = function (canvasEl, statsEl) {
  canvasEl.height = canvasEl.scrollHeight;
  canvasEl.width = canvasEl.scrollWidth;
  var ctx = canvasEl.getContext("2d");
  this.ctx = ctx;
  this.game = new Asteroids.Game(canvasEl, ctx);
  this.game.gameview = this;
  this.game.advanceLevel();
  window.requestAnimationFrame(this.animate.bind(this));

};
Asteroids.GameView.prototype.animate = function (currentTime) {


  var delta = currentTime - this.lastTime;
  this.lastTime = currentTime;
  window.requestAnimationFrame(this.animate.bind(this));
  this.game.moveObjects(delta);
  this.game.checkCollisions();
  this.game.handleInputs();
  this.game.draw(this.ctx, delta);
  this.checkWinLoss();
  this.updateStats();
};
Asteroids.GameView.prototype.updateMsg = function () {
  if (this.game.exitOpen) {
    this.messagePos = 750;
    this.messageText = "Find the exit.";
  }
};
Asteroids.GameView.prototype.centerPoint = function () {
  return [this.ctx.canvas.width / 2, this.ctx.canvas.height / 2];
};
Asteroids.GameView.prototype.translateViewToGlobalCoordinates = function (viewPos, shipPos) {
  var viewHeight = this.ctx.canvas.height;
  var viewWidth = this.ctx.canvas.width;
  var viewOrigin = [shipPos[0] - viewWidth/2, shipPos[1] - viewHeight/2 ];
  return [viewPos[0] + viewOrigin[0], viewPos[1] + viewOrigin[1]];
};
Asteroids.GameView.prototype.translateGlobalToViewCoordinates = function (globalPos, shipPos) {
  var viewHeight = this.ctx.canvas.height;
  var viewWidth = this.ctx.canvas.width;
  var viewOrigin = [shipPos[0] - viewWidth/2, shipPos[1] - viewHeight/2 ];
  return [globalPos[0] - viewOrigin[0], globalPos[1] - viewOrigin[1]];
};
Asteroids.GameView.prototype.updateStats = function () {
  this.ctx.font = "36px sans-serif";

  this.ctx.fillStyle = "yellow";
  this.ctx.fillText("Score: " + this.game.points, 100, 100);
  this.ctx.fillText("Lives: " + this.game.lives, 100, 150);
  this.ctx.fillText("Time: " + this.game.time, 100, 200);
  this.ctx.fillText("Level: " + this.game.level, 100, 250);
  if (this.messageText) {
    this.ctx.fillText(this.messageText, this.messagePos, 150);
  }
};

Asteroids.GameView.prototype.checkWinLoss = function () {
  if (this.game.lives <= 0) {
    alert("Tough luck. You reached level " + this.game.level + " and earned " + this.game.points + " points");
    document.location.reload();
  } else if (this.game.time <= 0) {
    alert("Time up. You reached level " + this.game.level + " and earned " + this.game.points + " points");
    document.location.reload();

  }
  else if (this.game.asteroids.length === 0) {
    this.game.advanceLevel();
  }
};
