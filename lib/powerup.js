var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.Powerup = function (type, pos, game) {
  this.type = type;
  this.vel =  Asteroids.powerupStats[type].vel();
  this.RADIUS = Asteroids.powerupStats[type].radius;
  this.COLOR = Asteroids.powerupStats[type].color;
  this.game = game;
  this.pos = pos || this.game.randomPosition();

  Asteroids.MovingObject.call(this, {color: this.COLOR, radius: this.RADIUS, pos: this.pos, vel: this.vel});

};
Asteroids.powerupStats= {
  "exit": {
    onPickup: function (powerup) {
      powerup.game.advanceLevel();
    },
    vel: function () {
      return [0,0];
    },
    radius: 20,
    color: "#0F0",
    pickupMessage: null
  },
  "extraTime": {
    onPickup: function (powerup) {
      powerup.game.addTime(10);
    },
    vel: function () {
      return Asteroids.randomVec(1);
    },
    radius: 10,
    color: "#00F",
    pickupMessage: "+10 seconds",
    messagePos: 750
  }
};
Asteroids.inherits(Asteroids.Powerup, Asteroids.MovingObject);

Asteroids.Powerup.prototype.collideWith = function (otherObject) {

  if (otherObject instanceof Asteroids.Ship) {
    this.game.remove(this);
    var msg = Asteroids.powerupStats[this.type].pickupMessage;
    var pos = Asteroids.powerupStats[this.type].messagePos;
    if (msg) {
      debugger
      var prevMsg = this.game.gameview.messageText;
      var prevPos = this.game.gameview.messagePos;
      this.game.gameview.messageText = msg;
      this.game.gameview.messagePos = pos;

      setTimeout(function () {
        this.game.gameview.messageText = prevMsg;
        this.game.gameview.messagePos = prevPos;

      }.bind(this), 3000);
    }
    Asteroids.powerupStats[this.type].onPickup(this);
  }
};
