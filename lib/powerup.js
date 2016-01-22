var Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.Powerup = function (type, pos, game) {
  this.type = type;
  this.vel =  Asteroids.powerupStats[type].vel();
  this.RADIUS = Asteroids.powerupStats[type].RADIUS;
  this.COLOR = Asteroids.powerupStats[type].COLOR;
  this.game = game;
  this.pos = pos || this.game.randomPosition();

  var powerUpSprite = new Image();
  if (typeof Asteroids.powerupStats[type].SPRITE.PATH === 'string') {
    powerUpSprite.src = Asteroids.powerupStats[type].SPRITE.PATH
  } else {
    powerUpSprite.src = Asteroids.powerupStats[type].SPRITE.PATH(game.level);
  }

  this.spriteOffset = Asteroids.powerupStats[type].SPRITE.OFFSET;
  this.spriteScale = Asteroids.powerupStats[type].SPRITE.SCALE;

  Asteroids.MovingObject.call(this, {
    color: this.COLOR,
    radius: this.RADIUS,
    pos: this.pos,
    vel: this.vel,
    sprite: powerUpSprite,
    spriteOffset: this.spriteOffset,
    spriteScale: this.spriteScale
  });
};

Asteroids.powerupStats= {
  "exit": {
    onPickup: function (powerup) {
      powerup.game.advanceLevel();
    },
    vel: function () {
      return [0,0];
    },
    RADIUS: 50,
    COLOR: "#0F0",
    PICKUPMESSAGE: null,
    SPRITE:{
      PATH:function(levelNumber) {
        return 'image/ExitHole'+((levelNumber -1) % 3+1)+'.png';
      },
      SCALE:100,
      OFFSET:{x:-35,y:-60}
    }
  },
  "extraTime": {
    onPickup: function (powerup) {
      powerup.game.addTime(10);
    },
    vel: function () {
      return Asteroids.randomVec(1);
    },
    RADIUS: 10,
    COLOR: "#00F",
    PICKUPMESSAGE: "+10 seconds",
    MESSAGEPOS: 750,
    SPRITE:{PATH:"image/ClockPowerup.png", SCALE:14, OFFSET:{x:-5,y:-4}}
  }
};

Asteroids.inherits(Asteroids.Powerup, Asteroids.MovingObject);

Asteroids.Powerup.prototype.collideWith = function (otherObject) {

  if (otherObject instanceof Asteroids.Ship) {
    this.game.remove(this);
    var msg = Asteroids.powerupStats[this.type].PICKUPMESSAGE;
    var pos = Asteroids.powerupStats[this.type].MESSAGEPOS;
    if (msg) {
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

Asteroids.Powerup.prototype.draw = function (ctx, mousePos, viewPos) {
  this.drawSprite(ctx, viewPos,  this.spriteScale);

 // ctx.fillStyle = this.color;
 //    ctx.beginPath();
 //    ctx.arc(
 //      viewPos[0],
 //      viewPos[1],
 //      this.radius,
 //      0,
 //      2 * Math.PI,
 //      false
 //    );
 //    ctx.fill();

};
