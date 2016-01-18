var Asteroids = window.Asteroids = window.Asteroids || {};

 Asteroids.MovingObject = function (opt) {
  this.pos = opt.pos;
  this.vel = opt.vel;
  this.radius = opt.radius;
  this.color = opt.color;
  this.sprite = opt.sprite;
  this.rotationAngle = opt.rotationAngle || 0;
  this.rotationSpeed = opt.rotationAngle || 0;
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

Asteroids.MovingObject.prototype.drawSprite = function (ctx, viewPos, scale) {
  this.spriteOffset = this.spriteOffset || {x: 0, y: 0};
  this.spriteScale = this.spriteScale || 1;
  ctx.translate(viewPos[0], viewPos[1]);
  ctx.rotate(this.rotationAngle);
  ctx.drawImage(this.sprite, this.spriteOffset.x, this.spriteOffset.y, scale, scale * this.sprite.height / this.sprite.width);
  ctx.rotate(-this.rotationAngle);
  ctx.translate(-(viewPos[0]), -(viewPos[1]));
};

Asteroids.MovingObject.prototype.move = function (timeDelta) {

  timeDelta = timeDelta || 1;
  this.pos[0] += this.vel[0] * timeDelta/2;
  this.pos[1] += this.vel[1] * timeDelta/2;
  this.rotationAngle += this.rotationSpeed * timeDelta/500;
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
