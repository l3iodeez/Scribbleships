var Asteroids = window.Asteroids = window.Asteroids || {};

 Asteroids.MovingObject = function (opt) {
  this.pos = opt.pos;
  this.vel = opt.vel;
  this.radius = opt.radius;
  this.color = opt.color;
  this.sprite = opt.sprite;
};
Asteroids.MovingObject.prototype.isWrappable = true;

Asteroids.MovingObject.prototype.draw = function (ctx, mousePos, viewPos) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      viewPos[0],
      viewPos[1],
      this.radius,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
};

Asteroids.MovingObject.prototype.move = function (timeDelta) {
  timeDelta = timeDelta || 1;
  this.pos[0] += this.vel[0] * timeDelta/2;
  this.pos[1] += this.vel[1] * timeDelta/2;
  if (this.isWrappable) {
    this.pos = this.game.wrap(this.pos);
  }
  else if (this.game.isOutOfBounds(this)) {
    this.game.remove(this);
  }
};

Asteroids.MovingObject.prototype.isCollidedWith =  function (otherObject) {
  if (Asteroids.dist(this.pos, otherObject.pos) < this.radius + otherObject.radius) {
    return true;
  }
  return false;
};

Asteroids.MovingObject.prototype.collideWith =  function (otherObject) {

};
