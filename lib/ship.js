var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.Ship = function (pos, game) {
  this.vel = [0,0];
  this.RADIUS = 25;
  this.COLOR = "#FF0";
  this.pos = pos;
  this.game = game;
  var shipImage = new Image();
  var shipTypes = ["chunky", "pointy"];
  this.shipType = shipTypes[1];

  shipImage.src = Asteroids.shipStats[this.shipType].sprite ;

  Asteroids.MovingObject.call(this, {color: this.COLOR, radius: this.RADIUS, pos: pos, vel: this.vel, sprite: shipImage});

};
Asteroids.shipStats = {
  chunky: {
    sprite: "image/ChunkyChugger.svg",
    offset: {x: 1000, y: -10}

  },
  pointy: {
    sprite: "image/PointyPew.svg",
    offset: {x: 20, y: -20}
  }
};
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
  var bulletDirection = Asteroids.directionVector(this.game.gameview.centerPoint(), [this.game.mousePos.x,this.game.mousePos.y]);
  var bulletVector = Asteroids.scaleVector(bulletDirection, 20);
  return [bulletVector[0] + this.vel[0], bulletVector[1] + this.vel[1]];
};



Asteroids.Ship.prototype.draw = function (ctx, mousePos) {
  if (typeof mousePos === "undefined") {
    mousePos = [0,0];
  }

  ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2);
  var xTranslation = Asteroids.shipStats[this.shipType].offset.x;
  var yTranslation = Asteroids.shipStats[this.shipType].offset.y;

  ctx.translate(-xTranslation, -yTranslation);


  var mouseAngle = Asteroids.vectorToAngle(Asteroids.directionVector(this.game.gameview.centerPoint(), [this.game.mousePos.x, this.game.mousePos.y])) - (3 * Math.PI /2) ;

  ctx.rotate(mouseAngle);

  ctx.drawImage(this.sprite, 0, 0, 50, 50 * this.sprite.height / this.sprite.width);

  ctx.rotate(-mouseAngle);
  ctx.translate(xTranslation, yTranslation);

    ctx.translate(-ctx.canvas.width/2, -ctx.canvas.height/2);

};