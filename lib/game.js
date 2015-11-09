Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.Game = function (canvasEl, ctx) {

  this.DIM_Y = canvasEl.scrollHeight;
  this.DIM_X = canvasEl.scrollWidth;

  this.NUM_ASTEROIDS = 6;
  this.asteroids = this.spawnAsteroids();
  this.ship = new Asteroids.Ship([this.DIM_X / 2, this.DIM_Y / 2], this);
  this.bullets = [];
  this.lives = 5;
  this.points = 0;

  canvasEl.addEventListener('mousemove', function(evt) {
        this.mousePos = this.getMousePos(canvasEl, evt);
      }.bind(this), false);

  canvasEl.addEventListener('click', function(evt) {
        this.ship.fireBullet();
      }.bind(this), false);

  var img = new Image(); // CODE FOR BACKGROUND IMAGE
  img.src = '../image/bg.jpg';
  img.onload = function () {
    this.ptrn = ctx.createPattern(img, 'repeat');
    ctx.fillStyle = this.ptrn;
    ctx.fillRect(0,0, canvasEl.width, canvasEl.height);
  }.bind(this);


};

Asteroids.Game.prototype.getMousePos = function (canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
};

Asteroids.Game.prototype.randomPosition = function () {
  var x = Math.floor(Math.random() * this.DIM_X);
  var y = Math.floor(Math.random() * this.DIM_Y);
  return [x, y];
};

Asteroids.Game.prototype.spawnAsteroids = function () {
  var asteroids = [];
  while (asteroids.length < this.NUM_ASTEROIDS) {
    asteroids.push(new Asteroids.Asteroid(this.randomPosition(), Asteroids.randomVec(5), "large", this));
    // asteroids.push(new Asteroids.Asteroid([200,200], [0.5,0.5], "large", this));
  }
  return asteroids;
};
Asteroids.Game.prototype.addAsteroids = function (asteroids) {
  this.asteroids = this.asteroids.concat(asteroids);
};

Asteroids.Game.prototype.draw = function (ctx, img) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  ctx.fillStyle = this.ptrn;
  ctx.fillRect(0,0, this.DIM_X, this.DIM_Y);
  console.log(this.mousePos);
  console.log(Asteroids.vectorToAngle([this.mousePos.x, this.mousePos.y]) * (180/Math.PI));
  console.log(Asteroids.vectorToAngle([this.mousePos.x, this.mousePos.y]));
  this.allObjects().forEach(function (el) {
    el.draw(ctx, this.mousePos);
  }.bind(this));
};

Asteroids.Game.prototype.moveObjects = function () {
  this.allObjects().forEach(function (el) {
    el.move();
  });
};

Asteroids.Game.prototype.wrap = function (pos) {
  if(pos[0] > this.DIM_X) {
    pos[0] = 0;
  } else if (pos[0] < 0) {
    pos[0] = this.DIM_X;
  }
  if(pos[1] > this.DIM_Y) {
    pos[1] = 0;
  } else if (pos[1] < 0) {
    pos[1] = this.DIM_Y;
  }
  return pos;
};

Asteroids.Game.prototype.checkCollisions = function () {
  var game = this;
  game.allObjects().forEach(function (el1) {
    game.allObjects().forEach(function (el2) {
      if (el1 !== el2 && el1.isCollidedWith(el2)) {

        el1.collideWith(el2);
      }
    });
  });
};
Asteroids.Game.prototype.isOutOfBounds = function (pos) {
  if (pos[0] < 0 || pos[0] > this.DIM_X || pos[1] < 0 || pos[1] > this.DIM_Y ) {
    return true;
  }
  return false;
};

Asteroids.Game.prototype.step = function () {
  this.moveObjects();
  this.checkCollisions();
  this.handleInputs();
};

Asteroids.Game.prototype.handleInputs = function () {


      // this.game.ship.power(this.game.ship.calculateImpulse(pressedKeys)); // THIS LINE FOR KEY BASED MOVEMENT

      if (this.mousePos) {
        var mouseDirection = Asteroids.directionVector(this.ship.pos, [this.mousePos.x, this.mousePos.y]);
        var mouseDist = Asteroids.dist(this.ship.pos, [this.mousePos.x, this.mousePos.y]);
        this.ship.vel = Asteroids.scaleVector(mouseDirection, mouseDist / 30);
      }
      var pressedKeys = key.getPressedKeyCodes();
      if (pressedKeys.indexOf(32) != -1) {
        // this.game.ship.fireBullet();
      }
};

Asteroids.Game.prototype.remove = function (obj) {
  if (obj instanceof Asteroids.Asteroid) {
    this.asteroids = this.asteroids.filter(function (el) {
      this.points += 1;
      return obj != el;
    });
  } else if (obj instanceof Asteroids.Bullet) {
    this.bullets = this.bullets.filter(function (el) {
      return obj != el;
    });

  }
};

Asteroids.Game.prototype.allObjects = function () {
  return this.asteroids.concat(this.ship).concat(this.bullets);
};

Asteroids.Game.prototype.add = function (obj) {
  if (obj instanceof Asteroids.Asteroid) {
    this.asteroids.push(obj);
  } else if (obj instanceof Asteroids.Bullet) {
    this.bullets.push(obj);
  }
};
