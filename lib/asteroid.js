var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.Asteroid = function (pos, vel, sizeClass, game) {
  this.sizeClass = sizeClass;
  this.COLOR = Asteroids.rockSTATS[sizeClass].COLOR;
  this.radius = Asteroids.rockSTATS[sizeClass].SIZE();
  this.game = game;
  this.damage = 0;
  this.rotationAngle = 0;

  var rockImage = new Image();
  rockImage.src = Asteroids.rockSTATS[sizeClass].SPRITE;
  Asteroids.MovingObject.call(this, {color: this.COLOR, radius: this.radius, pos: pos, vel: vel, sprite: rockImage});
};

Asteroids.inherits(Asteroids.Asteroid, Asteroids.MovingObject);

Asteroids.rockSTATS = {
  "small": {"COLOR": "#FBB",
            "HP":1,
            "POINTVALUE": 1,
            "SPLIT":0,
            "SPLITINTO":"",
            "SIZE": function () {
               return Math.floor(Math.random() * 5) + 10;
             },
             "SPRITE": "../image/SmallRock.png"
             },
  "medium": {"COLOR": "#CFC",
             "HP":3,
             "POINTVALUE": 5,
             "SPLIT":3,
             "SPLITINTO":"small",
             "SIZE": function () {
                return Math.floor(Math.random() * 10) + 30;
              },
              "SPRITE": "../image/MediumRock.png"
           },
  "large":  {"COLOR": "#EEF",
             "HP":5,
             "POINTVALUE": 10,
             "SPLIT":6,
             "SPLITINTO":"medium",
             "SIZE": function () {
                return Math.floor(Math.random() * 15) + 45;
              },
              "SPRITE": "../image/LargeRock.png"

           }
};

Asteroids.Asteroid.prototype.collideWith =  function (otherObject) {
  if (otherObject instanceof Asteroids.Ship) {
    otherObject.relocate();
    this.game.lives -=1;
  }
};

Asteroids.Asteroid.prototype.split = function (sizeClass) {
  this.game.points += Asteroids.rockSTATS[sizeClass].POINTVALUE;
  var vectors = this.splitVectors(Asteroids.rockSTATS[sizeClass].SPLIT);
  var fragments = [];
  for (var i = 0; i < vectors.length; i++) {
    Asteroids.scaleVector(vectors[i], Asteroids.dist([0,0], this.vel) );
    fragments.push(new Asteroids.Asteroid(
      this.pos.slice(),
      vectors[i],
      Asteroids.rockSTATS[sizeClass].SPLITINTO,
      this.game));
  }
  this.game.addAsteroids(fragments);
  this.game.remove(this);

};

Asteroids.Asteroid.prototype.splitVectors = function (number) {
  var currentAngle = Asteroids.vectorToAngle(this.vel);
  var currentSpeed = Asteroids.dist([0,0], this.vel);
  var vectors = [];
  var vector;
  for (var i = 0; i < number; i++) {
    vector = Asteroids.angleToVector(currentAngle + ( i * ( (2* Math.PI) / number )));
    Asteroids.scaleVector(vector, currentSpeed + 1);
    vectors.push(vector);
  }
  return vectors;

};

Asteroids.Asteroid.prototype.getShot = function () {

  this.damage += 1;
  if (this.damage >= Asteroids.rockSTATS[this.sizeClass].HP) {
    this.split(this.sizeClass);
  }

};

Asteroids.Asteroid.prototype.draw = function (ctx, mousePos) {


  ctx.translate(this.pos[0], this.pos[1]);

  ctx.rotate(this.rotationAngle);

  ctx.translate(-this.sprite.width/4, -this.sprite.height/4);
  ctx.drawImage(this.sprite, 0, 0, 100, 100 * this.sprite.height / this.sprite.width);
  ctx.translate(this.sprite.width/4, this.sprite.height/4);

  // ctx.drawImage(this.sprite, 0, 0);
  ctx.rotate(-this.rotationAngle);
  this.rotationAngle += (Math.PI/180);

    ctx.translate(-this.pos[0], -this.pos[1]);

};
