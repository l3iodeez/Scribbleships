Asteroids = window.Asteroids = window.Asteroids || {};

Asteroids.Game = function (canvasEl, ctx) {

  this.DIM_Y = 1500;
  this.DIM_X = 3000;

  this.level = 0;
  this.NUM_ASTEROIDS = 1;
  this.asteroids = [];
  this.populateAsteroids();
  this.ship = new Asteroids.Ship([this.DIM_X / 2, this.DIM_Y / 2], this);
  this.bullets = [];
  this.powerups = [];
  this.lives = 5;
  this.points = 0;
  this.time = 60;
  this.exitOpen = false;
  this.ctx = ctx;
  this.planetTime = 30;

};

Asteroids.Game.prototype.randomPosition = function () {
  var x = Math.floor(Math.random() * this.DIM_X);
  var y = Math.floor(Math.random() * this.DIM_Y);
  return [x, y];
};

Asteroids.Game.prototype.populateAsteroids = function () {
  while (this.asteroids.length < this.level * 5) {
    this.spawnAsteroid(this.randomPosition(), Asteroids.randomVec(5), "large", this);
  }
};

Asteroids.Game.prototype.spawnAsteroid = function (pos, vec, type, game) {
  var asteroid = new Asteroids.Asteroid(pos, vec, type, game);
  this.asteroids.push(asteroid);
};

Asteroids.Game.prototype.spawnPowerup= function (type, pos, game) {
  var powerup = new Asteroids.Powerup(type, pos, game);
  this.powerups.push(powerup);
};

Asteroids.Game.prototype.addAsteroids = function (asteroids) {
  this.asteroids = this.asteroids.concat(asteroids);
};

Asteroids.Game.prototype.advanceLevel = function () {
  this.level += 1;
  this.asteroids = [];
  this.populateAsteroids();
  this.powerups = [];
  this.bullets = [];
  this.time += 60;
  this.ship.pos = this.randomPosition();
  this.exitOpen = false;
  this.gameview.message = "Entering level " + this.level;
  this.gameview.messagePos = 600;

  var img = new Image(); // CODE FOR BACKGROUND IMAGE
  img.src = 'image/Background'+((this.level -1) % 3+1)+'.svg';
  img.onload = function () {
    this.ptrn = this.ctx.createPattern(img, 'repeat');
  }.bind(this);

  setTimeout(function () {
    var points = this.level * this.level * 100;
    this.gameview.messagePos = 600;
    this.gameview.messageText = "Get " + points + " points to exit level.";
  }.bind(this), 3000);
};

Asteroids.Game.prototype.addTime = function () {
  this.time += 10;
};

Asteroids.Game.prototype.spawnExit = function () {
  this.gameview.messagePos = 750;
  this.gameview.messageText = "Find the exit.";
  this.spawnPowerup("exit", undefined, this);
  this.exitOpen = true;

};

Asteroids.Game.prototype.renderBorder = function (context) {
  var color = "red";
  context.save();
  context.lineWidth = 12;
  context.strokeStyle = color;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(this.DIM_X, 0);
  context.lineTo(this.DIM_X, this.DIM_Y);
  context.lineTo(0, this.DIM_Y);
  context.lineTo(0, 0);
  context.closePath();
};

Asteroids.gridColors = {
  1: "#00ACEC", //level 1 grid color
  2: "#ca0088", //level 2 grid color
  3: "#bbff00", //level 3 grid color
}

Asteroids.gridColors[1,2,3];

Asteroids.Game.prototype.renderGrid = function (context) {
    var gridPixelSize = 50;
    var color = Asteroids.gridColors[((this.level-1) % 3) + 1];

        context.save();
        context.lineWidth = 0.8;
        context.strokeStyle = color;

        // horizontal grid lines
        var viewOrigin = this.gameview.translateViewToGlobalCoordinates([0,0], this.ship.pos);

        for(var i = 0; i <= this.DIM_Y; i = i + gridPixelSize)
        {
            context.beginPath();
            context.moveTo(0, i);
            context.lineTo(this.DIM_X, i);
            context.closePath();
            context.stroke();
        }

        // vertical grid lines
        for(var j = 0; j <= this.DIM_X; j = j + gridPixelSize)
        {
            context.beginPath();
            context.moveTo(j, 0);
            context.lineTo(j, this.DIM_Y);
            context.closePath();
            context.stroke();
        }

        context.restore();
};
Asteroids.Game.prototype.draw = function (ctx, delta) {
  ctx.clearRect(-1, -1, this.DIM_X, this.DIM_Y);
  ctx.fillStyle = this.ptrn;
  var centerPoint = this.gameview.centerPoint();
  ctx.translate(-(this.ship.pos[0] - centerPoint[0]), -(this.ship.pos[1] - centerPoint[1]));
  ctx.fillRect(0,0, this.DIM_X, this.DIM_Y);

  this.renderGrid(ctx);
  var globalOrigin = this.gameview.translateGlobalToViewCoordinates([0,0], this.ship.pos);
  ctx.translate((this.ship.pos[0] - centerPoint[0]), (this.ship.pos[1] - centerPoint[1]));


  this.allObjects().forEach(function (el) {
    var viewPos = this.gameview.translateGlobalToViewCoordinates(el.pos, this.ship.pos);
    el.draw(ctx, this.mousePos, viewPos, delta);
  }.bind(this));



};

Asteroids.Game.prototype.moveObjects = function () {
  this.allObjects().forEach(function (el) {
    el.move(this.gameview.timeDelta);
  }.bind(this));
};

Asteroids.Game.prototype.wrap = function (pos) {
  if(pos[0] > this.DIM_X) {

    pos[0] = 0;
  } else if (pos[0] < 0) {
    pos[0] = this.DIM_X;
  }
  if(pos[1] > this.DIM_Y) {
    pos[1] = 0;
  } else if (pos[1] < 0) {
    pos[1] = this.DIM_Y;
  }
  return pos;
};

Asteroids.Game.prototype.checkCollisions = function () {
  var game = this;
  game.allObjects().forEach(function (el1) {
    game.allObjects().forEach(function (el2) {
      if (el1 !== el2 && el1.isCollidedWith(el2)) {

        el1.collideWith(el2);
      }
    });
  });
};
Asteroids.Game.prototype.isOutOfBounds = function (pos) {
  if (pos[0] < 0 || pos[0] > this.DIM_X || pos[1] < 0 || pos[1] > this.DIM_Y ) {
    return true;
  }
  return false;
};

Asteroids.Game.prototype.step = function () {


};

Asteroids.Game.prototype.remove = function (obj) {
  if (obj instanceof Asteroids.Asteroid) {
    this.asteroids = this.asteroids.filter(function (el) {
      this.points += 1;
      return obj != el;
    });
  } else if (obj instanceof Asteroids.Bullet) {
    this.bullets = this.bullets.filter(function (el) {
      return obj != el;
    });

  }
  else if (obj instanceof Asteroids.Powerup) {
   this.powerups = this.powerups.filter(function (el) {
     return obj != el;
   });

 }
};

Asteroids.Game.prototype.allObjects = function () {
  return this.powerups.concat(this.asteroids).concat(this.bullets).concat(this.ship);
};

Asteroids.Game.prototype.add = function (obj) {
  if (obj instanceof Asteroids.Asteroid) {
    this.asteroids.push(obj);
  } else if (obj instanceof Asteroids.Bullet) {
    this.bullets.push(obj);
  } else if (obj instanceof Asteroids.Powerup) {
    this.powerups.push(obj);
  }
};
