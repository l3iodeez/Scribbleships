var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.GameView = function () {

  this.messageText = "Welcome to ScribbleShips";
  // this.messagePos = 650;
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
  this.status = "start";


  canvasEl.addEventListener('mousemove', function(evt) {
        var mousePos = this.getMousePos(canvasEl, evt);
        this.mousePos = mousePos;
        this.game.mousePos = mousePos;
      }.bind(this), false);

  canvasEl.addEventListener('click', function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (this.status === "playing") {
        this.game.ship.fireBullet();
      } else if (this.status === "start") {
        window.requestAnimationFrame(this.animate.bind(this));
        this.status = "playing";
      } else if (this.status === "paused") {
        this.status = "playing";
      }
    }.bind(this), true);

      window.requestAnimationFrame(this.animate.bind(this));

};

Asteroids.GameView.prototype.animate = function (currentTime) {
  var delta = currentTime - this.lastTime;
  this.lastTime = currentTime;
  this.game.time -= delta/1000;

  this.game.moveObjects(delta);
  this.game.checkCollisions();
  this.game.draw(this.ctx, delta);
  this.checkWinLoss();
  this.handleInputs();
  this.updateStats();
  if (this.status === "paused" || this.status === "start") {
    window.requestAnimationFrame(this.pausedLoop.bind(this));
  } else {
    window.requestAnimationFrame(this.animate.bind(this));
  }
};
Asteroids.GameView.prototype.pausedLoop = function (currentTime) {
  var delta = currentTime - this.lastTime;
  var mouseEvent =
  this.lastTime = currentTime;
  if (this.status === "paused" || this.status === "start") {
    window.requestAnimationFrame(this.pausedLoop.bind(this)); //this makes loop
  } else {
    window.requestAnimationFrame(this.animate.bind(this)); //this makes loop
  }
  this.renderMenu(this.ctx);
  this.handleInputs();

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

  var logo = new Image();
  logo.src = "image/ScribbleShipsLogo.png";

  this.ctx.drawImage(logo, 10, 10, 196, 80);

  this.ctx.font = "20px 'Gloria Hallelujah'";

  this.ctx.fillStyle = "yellow";
  this.ctx.fillText("Score: " + this.game.points, 70, 120);
  this.ctx.fillText("Lives: " + this.game.lives, 70, 140);
  this.ctx.fillText("Time: " + this.game.time, 70, 160);
  this.ctx.fillText("Level: " + this.game.level, 70, 180);
  if (this.messageText) {
    var messageWidth = this.ctx.measureText(this.messageText).width;
    var width = this.ctx.canvas.width;
    this.ctx.fillText(this.messageText, (width-messageWidth)/2, 100);
  }
};
Asteroids.GameView.prototype.renderMenu = function (context) {
  var color = "orange";
  context.beginPath();
  context.moveTo(400,100);
  context.lineTo(1200,100);
  context.lineTo(1200,500);
  context.lineTo(400,500);
  context.closePath();
  var chalk = new Image();
  chalk.src = "image/Chalkboard.png";
  var width = context.canvas.width;
  var height = context.canvas.height;
  var chalkwidth = chalk.width;
  context.drawImage (chalk, (width-chalkwidth)/2,150);
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
Asteroids.GameView.prototype.getMousePos = function (canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
};


Asteroids.GameView.prototype.handleInputs = function () {


      // this.game.ship.power(this.game.ship.calculateImpulse(pressedKeys)); // THIS LINE FOR KEY BASED MOVEMENT

      if (this.mousePos) {
        var mouseDirection = Asteroids.directionVector(this.centerPoint(), [this.mousePos.x, this.mousePos.y]);
        var mouseDist = Asteroids.dist(this.centerPoint(), [this.mousePos.x, this.mousePos.y]);
        this.game.ship.vel = Asteroids.scaleVector(mouseDirection, mouseDist / 30);
      }
      var pressedKeys = key.getPressedKeyCodes();
      console.log(pressedKeys);
      if (pressedKeys.indexOf(32) != -1) {
        // this.game.ship.fireBullet();
      }
      if (pressedKeys.indexOf(80) != -1) {

        if (this.status !== "paused") {
          this.status = "paused";

        }
      }
};
