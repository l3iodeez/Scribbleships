var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.inherits = function (ChildClass,ParentClass) {
  var Surrogate = function () {};
  Surrogate.prototype = ParentClass.prototype;
  ChildClass.prototype = new Surrogate ();
  ChildClass.prototype.constructor = ChildClass;
};

Asteroids.randomVec = function (length) {
  var x = Math.random() * length;
  var xMult = [-1,1][Math.floor(Math.random() * 2)];
  var yMult = [-1,1][Math.floor(Math.random() * 2)];
  var y = Math.sqrt(Math.pow(length,2) - Math.pow(x,2));
  return [x * xMult, y * yMult];
};

Asteroids.dist = function (pos1, pos2) {
  return Math.sqrt((Math.pow((pos1[0] - pos2[0]), 2) + (Math.pow((pos1[1] - pos2[1]), 2))));

};

Asteroids.directionVector = function (origin, vector) {
  var inputLength = Asteroids.dist(origin, vector);
  var factor = 1 / inputLength;
  return [(vector[0] - origin[0]) * factor, (vector[1] - origin[1]) * factor];
};

Asteroids.scaleVector = function (vector, units) {
  var extension = Asteroids.directionVector([0,0],vector);
  return [(vector[0] + (units * extension[0]) )/2, (vector[1] + (units * extension[1]))/2];
};

Asteroids.vectorAdd = function (vector1, vector2) {
  return [vector1[0] + vector2[0],vector1[1] + vector2[1]];
};

Asteroids.vectorToAngle = function (vector) {
  if (vector[1] >= 0) {
    if (vector[0] >= 0) {
      return Math.atan(Math.abs(vector[1])/Math.abs(vector[0]));
    }
    else {
      return (Math.PI) - Math.atan(Math.abs(vector[1])/Math.abs(vector[0]));
    }
  }
  else {
    if (vector[0] >= 0) {
      return (2 * Math.PI) - Math.atan(Math.abs(vector[1])/Math.abs(vector[0]));
    }
      return (Math.PI) + Math.atan(Math.abs(vector[1])/Math.abs(vector[0]));
  }
};

Asteroids.angleToVector = function (angle) {
  var y = Math.sin(angle);
  var x = Math.cos(angle);
  return [x,y];
};
