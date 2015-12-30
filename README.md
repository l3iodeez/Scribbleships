# ScribbleShips

  ScribbleShips (formerly JSAsteroids) is an implementation of the classic game Asteroids in pure JS and HTML5. It uses an HTML5 canvas element to draw the visual effects, and implements prototypical inheritance for a number of Javascipt object prototypes.

  Inspired by Asteroids and Spaceman Spiff (of Calvin & Hobbes), ScribbleShips is a game where you're a kid daydreaming in math class who desperately does not want to pay attention in class. You fights off classroom distractions to descend deeper and deeper into the daydream - but watch out, the teacher might notice and call you up to the blackboard!

### Object Class Prototypes
  - Game - Manages game stats and time steps
  - GameView - Renders the game into the page
  - MovingObject - Manages functions for all moving object types.
  - Ship - Ship Object
  - Bullet - Bullet Object
  - Asteroid - Asteroid object, takes a config hash and can represent asteroids with different stats and sprites, making it simple to add additional asteroid types.
