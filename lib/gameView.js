var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.GameView = function () {

  this.messageText = "Welcome to ScribbleShips";
  // this.messagePos = 650;
  this.lastTime = 0;
  this.delta = 0;
  this.maxFPS = 90;
  var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;

  if ( app ) {
    this.platform = "phonegap";
    this.menuClass = "menu android";
    // this.setupMobileListeners();
  } else {
    this.platform = "browser";
    this.menuClass = "menu";
  }
};

Asteroids.GameView.prototype.start = function (canvasEl) {
  canvasEl.height = canvasEl.scrollHeight;
  canvasEl.width = canvasEl.scrollWidth;
  if (this.platform === "phonegap") {
    canvasEl.className = "canvas android";
  }
  var ctx = canvasEl.getContext("2d");
  this.ctx = ctx;
  this.game = new Asteroids.Game(canvasEl, ctx);
  this.game.gameview = this;
  this.game.advanceLevel();
  this.status = "start";
  this.setupListeners(canvasEl);

  this.renderMenu();

};
Asteroids.GameView.prototype.setupMobileListeners = function () {

};
Asteroids.GameView.prototype.setupListeners = function (canvasEl) {

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
    }
  }.bind(this), true);

  canvasEl.addEventListener('touchmove', function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var mousePos = this.getMousePos(canvasEl, evt);
    this.mousePos = mousePos;
    this.game.mousePos = mousePos;
  }.bind(this), true);




    var _func;
    var resume = document.getElementById("resume");
    var restart = document.getElementById("restart");
    var start = document.getElementById("start");

     _func = function (evt) {
       evt.preventDefault();
       evt.stopPropagation();
       this.resetGame();
     }.bind(this);

    restart.addEventListener('click', _func, true);

    _func = function (evt) {

      if (evt.keyCode === 80 || evt.keyCode === 112) {
        if (this.status === "paused") {
          this.resumeGame();
        } else {
          this.pauseGame();
        }      }
    }.bind(this);

    document.addEventListener('keypress', _func, false);

    _func = function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      this.resumeGame();

    }.bind(this);

    start.addEventListener('click',  _func, true);
    resume.addEventListener('click',  _func, true);
};

Asteroids.GameView.prototype.animate = function (currentTime) {
  if (currentTime < this.lastTime + (1000 / this.maxFPS)) {
    window.requestAnimationFrame(this.animate.bind(this));
    return;
  }
  if (this.status === "playing") {
    var timestep = 1000 / 60;

    this.delta += currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.game.time -= this.delta/1000;
    this.game.planetTime -= this.delta/1000;
    if (this.game.planetTime < 0) {
        this.game.planetTime = 60;
        this.game.spawnAsteroid(this.game.randomPosition(), Asteroids.randomVec(1), "planet", this.game);
    }
    this.game.draw(this.ctx, this.delta);

    var numUpdateSteps = 0;
    while (this.delta >= timestep) {
      this.game.moveObjects(timestep);
      this.delta -= timestep;
      if (++numUpdateSteps >= 240) {

        break; // bail out
      }
    }
    this.game.checkCollisions();
    this.checkWinLoss();
    this.handleInputs();
    this.updateStats();
    window.requestAnimationFrame(this.animate.bind(this));
  }
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
  this.ctx.fillText("Time: " + Math.floor(this.game.time), 70, 160);
  this.ctx.fillText("Level: " + this.game.level, 70, 180);
  // this.ctx.fillText("Plat: " + this.platform, 70, 200); // uncommment to display platform
  if (this.messageText) {
    var messageWidth = this.ctx.measureText(this.messageText).width;
    var width = this.ctx.canvas.width;
    this.ctx.fillText(this.messageText, (width-messageWidth)/2, 100);
  }
};
Asteroids.GameView.prototype.renderMenu = function (context) {

  var menuContainer = document.getElementById("menu");
  menuContainer.className = this.menuClass;
  var resume = document.getElementById("resume");
  var restart = document.getElementById("restart");
  var start = document.getElementById("start");

  if (this.status === "paused") {

    start.className = "hidden";
    restart.className = "";
    resume.className = "";


  } else {

    start.className = "";
    restart.className = "hidden";
    resume.className = "hidden";
  }


};
Asteroids.GameView.prototype.resetGame = function () {
  var canvasEl = document.getElementById("game-canvas");

  this.game = new Asteroids.Game(canvasEl, this.ctx);
  this.game.gameview = this;
  this.game.advanceLevel();
  this.status = "playing";
  this.hideMenu();
  window.requestAnimationFrame(this.animate.bind(this));



};
Asteroids.GameView.prototype.pauseGame = function () {
  this.status = 'paused';
  this.renderMenu();
};
Asteroids.GameView.prototype.resumeGame = function () {
  this.lastTime = window.performance.now();
  this.status = 'playing';
  this.hideMenu();

  window.requestAnimationFrame(this.animate.bind(this));
};
Asteroids.GameView.prototype.hideMenu = function () {
  var menuContainer = document.getElementById("menu");
  menuContainer.className = this.className + " hidden";
};
Asteroids.GameView.prototype.checkWinLoss = function () {
  if (this.game.lives <= 0) {
    // alert("Tough luck. You reached level " + this.game.level + " and earned " + this.game.points + " points");
    document.location.reload();
  } else if (this.game.time <= 0) {
    // alert("Time up. You reached level " + this.game.level + " and earned " + this.game.points + " points");
    document.location.reload();

  }
  else if (this.game.asteroids.length === 0) {
    this.game.advanceLevel();
  }
};
Asteroids.GameView.prototype.getMousePos = function (canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  if (evt.type === "touchmove") {
    evt = evt.touches[0];
  }
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
      if (pressedKeys.indexOf(32) != -1) {
        // this.game.ship.fireBullet();
      }

};
