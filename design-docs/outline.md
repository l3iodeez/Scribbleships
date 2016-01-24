## Future Plans
  - GamePlay
    - 5 second invulnerability at spawn
  - PowerUps
    - Extra lives
    - Bigger, more powerful bullets
    - Spray bullets
    - Shields
  - MOBS
    - Paper airplane
    - Spitball ("Spitball incoming!")
    - Rubber band ball planet

### Object classes
  - Game
    - Manages connection to server, game start/end etc.
      - Server returns:
        - Start pos in global coordinates.
        - Objects in range
    - Keeps track of lives/points, passed from server.
    - Keeps track of objects in range of maximum possible view, passed from server.
    - Keeps track of ship, sends its pos/vel to the server.
      - Server sanity checks ship movement and fire rate to prevent cheating.
    - Receives new objects from server as they enter view space, dumps them when they exit.
  - GameView
    - Grabs viewport size from window.
    - Converts global coordinates to view coordinates based on current viewport size.
    - Renders ship at center of view.
    - Renders objects in view by converting their global coordinates to view coordinates.  
    - Renders options menu / start menu etc.

### Todo
  - Android menu rendering.
