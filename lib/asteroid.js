var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.Asteroid = function (pos, vel, sizeClass, game) {
  this.sizeClass = sizeClass;
  this.COLOR = Asteroids.rockSTATS[sizeClass].COLOR;
  this.radius = Asteroids.rockSTATS[sizeClass].SIZE;
  this.game = game;
  this.damage = 0;
  this.rotationAngle = (Math.PI * 2) * ((Math.floor(Math.random() * 360)/360));
  this.rotationSpeed = ((Math.random() * 2) - 1)/5;
  var rockImage = new Image();
  rockImage.src = Asteroids.rockSTATS[sizeClass].SPRITE.PATH;
  Asteroids.MovingObject.call(this, {color: this.COLOR, radius: this.radius, pos: pos, vel: vel, sprite: rockImage});
  // Asteroids.MovingObject.call(this, {color: this.COLOR, radius: this.radius, pos: [500,500], vel: [0,0], sprite: rockImage});

};

Asteroids.inherits(Asteroids.Asteroid, Asteroids.MovingObject);

Asteroids.rockSTATS = {
  "small": {"COLOR": "#FBB",
            "HP":1,
            "POINTVALUE": 1,
            "SPLIT":0,
            "SPLITINTO":"",
            "SIZE": 13,
            "SPRITE": {"PATH": "image/SmallRock.png", "OFFSET": {x: -40, y: -40}, "SCALE": 35}
             },
  "medium": {"COLOR": "#CFC",
             "HP":3,
             "POINTVALUE": 5,
             "SPLIT":3,
             "SPLITINTO":"small",
             "SIZE": 35,
            "SPRITE": {"PATH": "image/MediumRock.png", "OFFSET": {x: -75, y:-60}, "SCALE": 100}
           },
  "large":  {"COLOR": "#EEF",
             "HP":5,
             "POINTVALUE": 10,
             "SPLIT":6,
             "SPLITINTO":"medium",
             "SIZE": 55,
            "SPRITE": {"PATH": "image/LargeRock.png", "OFFSET": {x: -125, y:-95}, "SCALE": 145}

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
  var scale = Asteroids.rockSTATS[this.sizeClass].SPRITE.SCALE;

  ctx.translate(this.pos[0], this.pos[1]);

  ctx.rotate(this.rotationAngle);
  var xTranslation = this.sprite.width/2 + Asteroids.rockSTATS[this.sizeClass].SPRITE.OFFSET.x;
  var yTranslation = this.sprite.height/2 + Asteroids.rockSTATS[this.sizeClass].SPRITE.OFFSET.y;

  ctx.translate(-xTranslation, -yTranslation);

  ctx.drawImage(this.sprite, 0, 0, scale, scale * this.sprite.height / this.sprite.width);

  ctx.translate(xTranslation, yTranslation);

  ctx.rotate(-this.rotationAngle);
  this.rotationAngle += this.rotationSpeed;

    ctx.translate(-this.pos[0], -this.pos[1]);
    // ctx.fillStyle = this.color;
    // ctx.beginPath();
    // ctx.arc(
    //   this.pos[0],
    //   this.pos[1],
    //   this.radius,
    //   0,
    //   2 * Math.PI,
    //   false
    // );
    // ctx.fill();

};
