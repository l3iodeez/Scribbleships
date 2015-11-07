var util = window.Asteroids = window.Asteroids || {};

util.inherits = function (ChildClass,ParentClass) {
  var Surrogate = function () {};
  Surrogate.prototype = ParentClass.prototype;
  ChildClass.prototype = new Surrogate ();
  ChildClass.prototype.constructor = ChildClass;
};

util.randomVec = function (length) {
  var x = Math.random() * length;
  var xMult = [-1,1][Math.floor(Math.random() * 2)];
  var yMult = [-1,1][Math.floor(Math.random() * 2)];
  var y = Math.sqrt(Math.pow(length,2) - Math.pow(x,2));
  return [x * xMult, y * yMult];
};

util.dist = function (pos1, pos2) {

  return Math.sqrt((Math.pow((pos1[0] - pos2[0]), 2) + (Math.pow((pos1[1] - pos2[1]), 2))));

};

util.directionVector = function (origin, vector) {
  var inputLength = util.dist(origin, vector);
  var factor = 1 / inputLength;
  return [(vector[0] - origin[0]) * factor, (vector[1] - origin[1]) * factor];
};

util.scaleVector = function (vector, units) {
  var extension = Asteroids.directionVector([0,0],vector);

  return [(vector[0] + (units * extension[0]) ), (vector[1] + (units * extension[1]))];
};

util.vectorAdd = function (vector1, vector2) {
  return [vector1[0] + vector2[0],vector1[1] + vector2[1]];
};
