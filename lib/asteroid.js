var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.Asteroid = function (pos, vel, sizeClass, game) {
  this.sizeClass = sizeClass;
  this.COLOR = Asteroids.Asteroid.COLORS[sizeClass];
  this.radius = this.calculateSize();
  this.game = game;
  this.damage = 0;
  Asteroids.MovingObject.call(this, {color: this.COLOR, radius: this.radius, pos: pos, vel: vel});
};

Asteroids.inherits(Asteroids.Asteroid, Asteroids.MovingObject);
Asteroids.Asteroid.COLORS = {
  "small": "#fbb",
  "medium": "#cfc",
  "large": "#eef"
};

Asteroids.Asteroid.HITS = {
  "small": 1,
  "medium": 2,
  "large": 5
};

Asteroids.Asteroid.prototype.collideWith =  function (otherObject) {
  if (otherObject instanceof Asteroids.Ship) {
    otherObject.relocate();
  }
};
Asteroids.Asteroid.prototype.calculateSize = function () {
    if (this.sizeClass === "large") {
      return Math.floor(Math.random() * 15) + 45;
    }
    else if (this.sizeClass === "medium") {
      return Math.floor(Math.random() * 10) + 30;
    }
    else if (this.sizeClass === "small") {
      return Math.floor(Math.random() * 5) + 10;
    }
};

Asteroids.Asteroid.prototype.split = function (sizeClass) {

  var vectors = this.splitVectors();
  var fragments = [];
  for (var i = 0; i < vectors.length; i++) {
    Asteroids.scaleVector(vectors[i], Asteroids.dist([0,0], this.vel) );
    fragments.push(new Asteroids.Asteroid(this.pos.slice(), vectors[i], sizeClass, this.game));
  }
  this.game.addAsteroids(fragments);
  this.game.remove(this);

};

Asteroids.Asteroid.prototype.splitVectors = function () {
  var currentAngle = Asteroids.vectorToAngle(this.vel);
  var currentSpeed = Asteroids.dist([0,0], this.vel);
  var splitVector1 = Asteroids.angleToVector(currentAngle + 0.523599);
  var splitVector2 = Asteroids.angleToVector(currentAngle - 0.523599);

  return [Asteroids.scaleVector(splitVector1, currentSpeed - 1), Asteroids.scaleVector(splitVector2, currentSpeed - 1)];

};

Asteroids.Asteroid.prototype.getShot = function () {

  if (this.sizeClass === "large") {
    if (this.damage < Asteroids.Asteroid.HITS.large) {
      this.damage += 1;
    } else {
      this.split("medium");
    }
  }
  else if (this.sizeClass === "medium") {
    if (this.damage < Asteroids.Asteroid.HITS.medium) {
      this.damage += 1;
    } else {
      this.split("small");
    }
  }
  else if (this.sizeClass === "small") {
    if (this.damage < Asteroids.Asteroid.HITS.small) {
      this.damage += 1;
    } else {
      this.game.remove(this);
    }
  }
};
