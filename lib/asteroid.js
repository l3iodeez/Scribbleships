var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.SmallAsteroid = function (pos, vel, radius, game) {
  this.COLOR = "#0000FF";
  this.radius = radius;
  this.game = game;
  Asteroids.MovingObject.call(this, {color: this.COLOR, radius: this.radius, pos: pos, vel: vel});
};

Asteroids.inherits(Asteroids.Asteroid, Asteroids.MovingObject);

Asteroids.SmallAsteroid.prototype.collideWith =  function (otherObject) {
  if (otherObject instanceof Asteroids.Ship) {
    otherObject.relocate();
  }
};
