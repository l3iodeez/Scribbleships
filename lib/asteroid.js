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
            "SPRITE": {"PATH": "image/Asteroid3.png", "OFFSET": {x: -10, y: -10}, "SCALE": 30}
             },
  "medium": {"COLOR": "#CFC",
             "HP":3,
             "POINTVALUE": 5,
             "SPLIT":3,
             "SPLITINTO":"small",
             "SIZE": 35,
            "SPRITE": {"PATH": "image/Asteroid2.png", "OFFSET": {x: -20, y:-20}, "SCALE": 100}
           },
  "large":  {"COLOR": "#EEF",
             "HP":5,
             "POINTVALUE": 10,
             "SPLIT":6,
             "SPLITINTO":"medium",
             "SIZE": 55,
            "SPRITE": {"PATH": "image/Asteroid1.png", "OFFSET": {x: -60, y:-60}, "SCALE": 145}

           }
};

Asteroids.Asteroid.prototype.collideWith =  function (otherObject) {
  if (otherObject instanceof Asteroids.Ship) {
    otherObject.relocate();
    this.game.lives -=1;
  }
};

Asteroids.Asteroid.prototype.split = function (sizeClass) {
  var spawnPowerup = Math.floor(Math.random() * 10) === 0;
  this.game.points += Asteroids.rockSTATS[sizeClass].POINTVALUE;
  if (this.game.points > (this.game.level * this.game.level  * 100) && this.game.exitOpen === false) {
    this.game.spawnExit();
  }
  var vectors = this.splitVectors(Asteroids.rockSTATS[sizeClass].SPLIT);
  var fragments = [];
  for (var i = 0; i < vectors.length; i++) {
    Asteroids.scaleVector(vectors[i], Asteroids.dist([0,0], this.vel) );
    fragments.push(new Asteroids.Asteroid(
      this.pos.slice(),
      vectors[i],
      Asteroids.rockSTATS[sizeClass].SPLITINTO,
      this.game));
      if (i === 0 && spawnPowerup) {
        this.game.spawnPowerup("extraTime", this.pos, this.game);
      }
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

Asteroids.Asteroid.prototype.draw = function (ctx, mousePos, viewPos, delta) {
  var scale = Asteroids.rockSTATS[this.sizeClass].SPRITE.SCALE;

  ctx.translate(viewPos[0], viewPos[1]);

  ctx.rotate(this.rotationAngle);
  var xTranslation = this.sprite.width/2 + Asteroids.rockSTATS[this.sizeClass].SPRITE.OFFSET.x;
  var yTranslation = this.sprite.height/2 + Asteroids.rockSTATS[this.sizeClass].SPRITE.OFFSET.y;

  ctx.translate(-xTranslation, -yTranslation);

  ctx.drawImage(this.sprite, 0, 0, scale, scale * this.sprite.height / this.sprite.width);

  ctx.translate(xTranslation, yTranslation);

  ctx.rotate(-this.rotationAngle);
  this.rotationAngle += this.rotationSpeed * delta/20;

    ctx.translate(-viewPos[0], -viewPos[1]);

};
