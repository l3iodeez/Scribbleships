var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.Asteroid = function (pos, vel, sizeClass, game) {
  this.sizeClass = sizeClass;
  this.COLOR = Asteroids.rockSTATS[sizeClass].COLOR;
  this.radius = Asteroids.rockSTATS[sizeClass].SIZE;
  this.game = game;
  this.damage = 0;
  this.rotationAngle = (Math.PI * 2) * ((Math.floor(Math.random() * 360)/360));
  this.rotationSpeed = ((Math.random() * 2) - 1)/5;
  this.spriteOffset = Asteroids.rockSTATS[sizeClass].SPRITE.OFFSET;
  this.spriteScale = Asteroids.rockSTATS[sizeClass].SPRITE.SCALE;

  var rockImage = new Image();
  rockImage.src = Asteroids.rockSTATS[sizeClass].SPRITE.PATH;
  Asteroids.MovingObject.call(this, {
    color: this.COLOR,
    radius: this.radius,
    rotationSpeed: 0.1,
    rotationAngle: this.rotationAngle,
    spriteScale: Asteroids.rockSTATS[sizeClass].SPRITE.SCALE,
    spriteOffset: Asteroids.rockSTATS[sizeClass].SPRITE.OFFSET,
    pos: pos,
    vel: vel,
    // pos: [500,500],
    // vel: [0,0],
    sprite: rockImage
  });

  // Asteroids.MovingObject.call(this, {color: this.COLOR, radius: this.radius, pos: [500,500], vel: [0,0], sprite: rockImage});

};

Asteroids.inherits(Asteroids.Asteroid, Asteroids.MovingObject);

Asteroids.rockSTATS = {
  "small": {
            "COLOR": "#FBB",
            "HP":1,
            "POINTVALUE": 1,
            "SPLIT":0,
            "SPLITINTO":"",
            "SIZE": 17,
            "SPRITE": {"PATH": "image/Asteroid3.png", "OFFSET": {x: -10, y: -10}, "SCALE": 30}
             },
  "medium": {
             "COLOR": "#CFC",
             "HP":3,
             "POINTVALUE": 5,
             "SPLIT":3,
             "SPLITINTO":"small",
             "SIZE": 45,
             "SPRITE": {"PATH": "image/Asteroid2.png", "OFFSET": {x: -50, y:-50}, "SCALE": 100}
           },
  "large":  {
             "COLOR": "#EEF",
             "HP":5,
             "POINTVALUE": 10,
             "SPLIT":6,
             "SPLITINTO":"medium",
             "SIZE": 65,
             "SPRITE": {"PATH": "image/Asteroid1.png", "OFFSET": {x: -62, y:-62}, "SCALE": 145}
           },
  "planet": {
             "COLOR": "orange",
             "SIZE": 404,
             "HP":1000,
             "POINTVALUE": 10000,
             "SPLIT":0,
             "SPLITINTO":"",
             "SPRITE": {"PATH": "image/Planet.png", "OFFSET": {x: -450, y: -450}, "SCALE": 900}
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

Asteroids.Asteroid.prototype.draw = function (ctx, mousePos, viewPos) {
  if (false) { //for debugging sizes of asteroids
    Asteroids.MovingObject.prototype.draw.bind(this)(ctx, mousePos, viewPos);
  }
  this.drawSprite(ctx, viewPos, Asteroids.rockSTATS[this.sizeClass].SPRITE.SCALE);
};
