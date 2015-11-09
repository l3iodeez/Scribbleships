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
    this.updateStats(statsEl);
    this.checkWinLoss();
  }).bind(this), 40);


};

Asteroids.GameView.prototype.updateStats = function (statsEl) {
  statsEl.innerHTML = "";
  var ul = document.createElement("ul");
  var html = "<li> Score:" + this.game.points + "</li>";
  html += "<li> Lives:" + this.game.lives + "</li>";
  ul.innerHTML = html;
  statsEl.appendChild(ul);
};

Asteroids.GameView.prototype.checkWinLoss = function () {
  if (this.game.lives === 0) {
    alert("You lost");
    document.location.reload();
  }
  else if (this.game.asteroids.length === 0) {
    alert("You won!");
    document.location.reload();
  }
};
