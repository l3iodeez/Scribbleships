var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.Asteroid = function (pos, vel, sizeClass, game) {
  this.sizeClass = sizeClass;
  this.COLOR = Asteroids.rockSTATS[sizeClass].COLOR;
  this.radius = Asteroids.rockSTATS[sizeClass].SIZE();
  this.game = game;
  this.damage = 0;
  Asteroids.MovingObject.call(this, {color: this.COLOR, radius: this.radius, pos: pos, vel: vel});
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
             }
             },
  "medium": {"COLOR": "#CFC",
             "HP":3,
             "POINTVALUE": 5,
             "SPLIT":3,
             "SPLITINTO":"small",
             "SIZE": function () {
                return Math.floor(Math.random() * 10) + 30;
              }
           },
  "large":  {"COLOR": "#EEF",
             "HP":5,
             "POINTVALUE": 10,
             "SPLIT":6,
             "SPLITINTO":"medium",
             "SIZE": function () {
                return Math.floor(Math.random() * 15) + 45;
              }
           }
};

Asteroids.Asteroid.prototype.collideWith =  function (otherObject) {
  if (otherObject instanceof Asteroids.Ship) {
    otherObject.relocate();
    this.game.lives -=1;
  }
};

Asteroids.Asteroid.prototype.split = function (sizeClass) {
  this.game.points += Asteroids.rockSTATS[sizeClass].POINTVALUE
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
