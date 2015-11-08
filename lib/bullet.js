var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.Bullet = function (pos, vel, game) {
  this.RADIUS = 5;
  this.COLOR = "#ff0000";
  this.game = game;

  Asteroids.MovingObject.call(this, {color: this.COLOR, radius: this.RADIUS, pos: pos.slice(), vel: vel.slice() });

  this.isWrappable = false;
};
Asteroids.inherits(Asteroids.Bullet, Asteroids.MovingObject);

Asteroids.Bullet.prototype.collideWith = function (otherObject) {

  if (otherObject instanceof Asteroids.Asteroid) {
    this.game.points += 1;
    this.game.remove(this);
    otherObject.getShot();
  }
};
