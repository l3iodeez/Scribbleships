var gObj = window.Asteroids = window.Asteroids || {};

gObj.Game = function () {
  this.DIM_X = 900;
  this.DIM_Y = 700;
  this.NUM_ASTEROIDS = 17;
  this.asteroids = this.addAsteroids();
  this.ship = new gObj.Ship(this.randomPosition(), this);
  this.bullets = [];
  this.lives = 5;
  this.points = 0;
};

gObj.Game.prototype.randomPosition = function () {
  var x = Math.floor(Math.random() * this.DIM_X);
  var y = Math.floor(Math.random() * this.DIM_Y);
  return [x, y];
};

gObj.Game.prototype.addAsteroids = function () {
  var asteroids = [];
  while (asteroids.length < this.NUM_ASTEROIDS) {
    asteroids.push(new gObj.Asteroid(this.randomPosition(), gObj.randomVec(5), Math.floor(Math.random() * 35) + 10, this));
  }
  return asteroids;
};

gObj.Game.prototype.draw = function (ctx, img) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  ctx.drawImage(img, 0, 0);

  this.allObjects().forEach(function (el) {
    el.draw(ctx);
  });


};

gObj.Game.prototype.moveObjects = function () {
  this.allObjects().forEach(function (el) {
    el.move();
  });
};

gObj.Game.prototype.wrap = function (pos) {
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

gObj.Game.prototype.checkCollisions = function () {
  var game = this;
  game.allObjects().forEach(function (el1) {
    game.allObjects().forEach(function (el2) {
      if (el1 !== el2 && el1.isCollidedWith(el2)) {

        el1.collideWith(el2);
      }
    });
  });
};
gObj.Game.prototype.isOutOfBounds = function (pos) {
  if (pos[0] < 0 || pos[0] > this.DIM_X || pos[1] < 0 || pos[1] > this.DIM_Y ) {
    return true;
  }
  return false;
};

gObj.Game.prototype.step = function () {
  this.moveObjects();
  this.checkCollisions();
};

gObj.Game.prototype.remove = function (obj) {
  if (obj instanceof Asteroids.Asteroid) {
    this.asteroids = this.asteroids.filter(function (el) {
      return obj != el;
    });
  } else if (obj instanceof Asteroids.Bullet) {
    this.bullets = this.bullets.filter(function (el) {
      return obj != el;
    });

  }
};

gObj.Game.prototype.allObjects = function () {
  return this.asteroids.concat(this.ship).concat(this.bullets);
};

gObj.Game.prototype.add = function (obj) {
  if (obj instanceof Asteroids.Asteroid) {
    this.asteroids.push(obj);
  } else if (obj instanceof Asteroids.Bullet) {
    this.bullets.push(obj);
  }
};
