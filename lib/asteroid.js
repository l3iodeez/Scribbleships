var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.Asteroid = function (pos, vel, game) {
  this.COLOR = "#0000FF";
  this.RADIUS = 10;
  this.game = game;
  Asteroids.MovingObject.call(this, {color: this.COLOR, radius: this.RADIUS, pos: pos, vel: vel});
};

Asteroids.inherits(Asteroids.Asteroid, Asteroids.MovingObject);

Asteroids.Asteroid.prototype.collideWith =  function (otherObject) {
  if (otherObject instanceof Asteroids.Ship) {
    otherObject.relocate();
  }
};
