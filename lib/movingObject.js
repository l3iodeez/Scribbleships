var mObj = window.Asteroids = window.Asteroids || {};

 mObj.MovingObject = function (opt) {
  this.pos = opt.pos;
  this.vel = opt.vel;
  this.radius = opt.radius;
  this.color = opt.color;
};
mObj.MovingObject.prototype.isWrappable = true;

mObj.MovingObject.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();

  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI,
    false
  );
  ctx.fill();
};

mObj.MovingObject.prototype.move = function () {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
  if (this.isWrappable) {
    this.pos = this.game.wrap(this.pos);
  }
  else if (this.game.isOutOfBounds(this)) {
    this.game.remove(this);
  }
};

mObj.MovingObject.prototype.isCollidedWith =  function (otherObject) {
  if (mObj.dist(this.pos, otherObject.pos) < this.radius + otherObject.radius) {
    return true;
  }
  return false;
};

mObj.MovingObject.prototype.collideWith =  function (otherObject) {

};
