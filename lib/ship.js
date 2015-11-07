var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.Ship = function (pos, game) {
  this.vel = [0,0];
  this.RADIUS = 25;
  this.COLOR = "#FF0";
  this.pos = pos;
  this.game = game;
  Asteroids.MovingObject.call(this, {color: this.COLOR, radius: this.RADIUS, pos: pos, vel: this.vel});

}

Asteroids.inherits(Asteroids.Ship, Asteroids.MovingObject);

Asteroids.Ship.prototype.relocate = function () {

  this.pos = this.game.randomPosition();
  this.vel = [0,0];

};

Asteroids.Ship.prototype.power = function (impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
};

Asteroids.Ship.prototype.calculateImpulse = function (keys) {

  var impulse = [0,0];
  if (keys.indexOf(37) != -1 || keys.indexOf(65) != -1) {
    impulse[0] -= 1;
  }
  if (keys.indexOf(38) != -1 || keys.indexOf(87) != -1) {
    impulse[1] -= 1;
  }
  if (keys.indexOf(39) != -1 || keys.indexOf(68) != -1) {
    impulse[0] += 1;
  }
  if (keys.indexOf(40) != -1 || keys.indexOf(83) != -1) {
    impulse[1] += 1;
  }
  return impulse;
};

Asteroids.Ship.prototype.fireBullet = function () {

  var bullet = new Asteroids.Bullet(this.pos, this.bulletVector(), this.game);
  this.game.add(bullet);
};

Asteroids.Ship.prototype.bulletVector = function () {
  var bulletTrajectory = Asteroids.directionVector(this.pos, [this.game.mousePos.x,this.game.mousePos.y]);
  return Asteroids.scaleVector(bulletTrajectory,6);
};
