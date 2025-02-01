var player; // Ensure this is defined globally for access

// Show on-screen controls if on mobile
if (/Mobi|Android/i.test(navigator.userAgent)) {
  document.getElementById("controls").style.display = "block";
}

// Add event listeners to the arrow buttons
document.getElementById("upButton").addEventListener("click", function () {
  if (player) player.handleKeyPress({ keyCode: 38 }); // Simulate up arrow key
});

document.getElementById("downButton").addEventListener("click", function () {
  if (player) player.handleKeyPress({ keyCode: 40 }); // Simulate down arrow key
});

document.getElementById("leftButton").addEventListener("click", function () {
  if (player) player.handleKeyPress({ keyCode: 37 }); // Simulate left arrow key
});

document.getElementById("rightButton").addEventListener("click", function () {
  if (player) player.handleKeyPress({ keyCode: 39 }); // Simulate right arrow key
});

document.querySelector('.info').addEventListener('click', function() {
  Swal.fire({
    title: 'Pac-Man: The Ghost Slayer',
    text: 'Trapped in a haunted maze, Pac-Man must outsmart and slay the ghost that has plunged the world into darkness. Armed with Power Pellets, he turns the tables on his spectral foes, battling to reclaim the sacred orbs and escape the labyrinth. Can Pac-Man conquer the maze and defeat the ghosts, or will he be lost forever?.',
    icon: 'info',
    confirmButtonText: 'Interesting!'
  });
});

document.addEventListener('touchstart', function (e) {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

// Prevent double-tap zooming
document.addEventListener('dblclick', function (e) {
  e.preventDefault();
});

function rand(max) {
    return Math.floor(Math.random() * max);
  }
  
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  
  function changeBrightness(factor, sprite) {
    var virtCanvas = document.createElement("canvas");
    virtCanvas.width = 500;
    virtCanvas.height = 500;
    var context = virtCanvas.getContext("2d");
    context.drawImage(sprite, 0, 0, 500, 500);
  
    var imgData = context.getImageData(0, 0, 500, 500);
  
    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = imgData.data[i] * factor;
      imgData.data[i + 1] = imgData.data[i + 1] * factor;
      imgData.data[i + 2] = imgData.data[i + 2] * factor;
    }
    context.putImageData(imgData, 0, 0);
  
    var spriteOutput = new Image();
    spriteOutput.src = virtCanvas.toDataURL();
    virtCanvas.remove();
    return spriteOutput;
  }
  
  let completedLevels = new Set(); // Track completed levels

function displayVictoryMess(moves) {
    completedLevels.add(difficulty - 4); // Mark current level as completed

    let levelButtons = "";
    for (let i = 1; i <= 40; i++) {
        let completedClass = completedLevels.has(i) ? "completed-level" : "remaining-level";
        levelButtons += `<div class="level-box ${completedClass}">${i}</div>`;
    }

    Swal.fire({
        title: `Level ${difficulty - 4} Completed!`,
        html: `
            <p>You finished in <b>${moves}</b> moves.</p>
            <div class="level-container">${levelButtons}</div>
            <p>Progressing to <b>Level ${Math.min(difficulty - 3, 40)}</b>...</p>
        `,
        icon: 'success',
        timer: 3000, // Auto-move after 3 sec
        showConfirmButton: false
    }).then(() => {
        difficulty = Math.min(difficulty+1, 40); // Move to the next level
        makeMaze();
    });
}

  function toggleVisablity(id) {
    if (document.getElementById(id).style.visibility == "visible") {
      document.getElementById(id).style.visibility = "hidden";
    } else {
      document.getElementById(id).style.visibility = "visible";
    }
  }
  
  function Maze(Width, Height) {
    var mazeMap;
    var width = Width;
    var height = Height;
    var startCoord, endCoord;
    var dirs = ["n", "s", "e", "w"];
    var modDir = {
      n: {
        y: -1,
        x: 0,
        o: "s"
      },
      s: {
        y: 1,
        x: 0,
        o: "n"
      },
      e: {
        y: 0,
        x: 1,
        o: "w"
      },
      w: {
        y: 0,
        x: -1,
        o: "e"
      }
    };
  
    this.map = function() {
      return mazeMap;
    };
    this.startCoord = function() {
      return startCoord;
    };
    this.endCoord = function() {
      return endCoord;
    };
  
    function genMap() {
      mazeMap = new Array(height);
      for (y = 0; y < height; y++) {
        mazeMap[y] = new Array(width);
        for (x = 0; x < width; ++x) {
          mazeMap[y][x] = {
            n: false,
            s: false,
            e: false,
            w: false,
            visited: false,
            priorPos: null
          };
        }
      }
    }
  
    function defineMaze() {
      var isComp = false;
      var move = false;
      var cellsVisited = 1;
      var numLoops = 0;
      var maxLoops = 0;
      var pos = {
        x: 0,
        y: 0
      };
      var numCells = width * height;
      while (!isComp) {
        move = false;
        mazeMap[pos.x][pos.y].visited = true;
  
        if (numLoops >= maxLoops) {
          shuffle(dirs);
          maxLoops = Math.round(rand(height / 8));
          numLoops = 0;
        }
        numLoops++;
        for (index = 0; index < dirs.length; index++) {
          var direction = dirs[index];
          var nx = pos.x + modDir[direction].x;
          var ny = pos.y + modDir[direction].y;
  
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            //Check if the tile is already visited
            if (!mazeMap[nx][ny].visited) {
              //Carve through walls from this tile to next
              mazeMap[pos.x][pos.y][direction] = true;
              mazeMap[nx][ny][modDir[direction].o] = true;
  
              //Set Currentcell as next cells Prior visited
              mazeMap[nx][ny].priorPos = pos;
              //Update Cell position to newly visited location
              pos = {
                x: nx,
                y: ny
              };
              cellsVisited++;
              //Recursively call this method on the next tile
              move = true;
              break;
            }
          }
        }
  
        if (!move) {
          //  If it failed to find a direction,
          //  move the current position back to the prior cell and Recall the method.
          pos = mazeMap[pos.x][pos.y].priorPos;
        }
        if (numCells == cellsVisited) {
          isComp = true;
        }
      }
    }
  
    function defineStartEnd() {
      switch (rand(4)) {
        case 0:
          startCoord = {
            x: 0,
            y: 0
          };
          endCoord = {
            x: height - 1,
            y: width - 1
          };
          break;
        case 1:
          startCoord = {
            x: 0,
            y: width - 1
          };
          endCoord = {
            x: height - 1,
            y: 0
          };
          break;
        case 2:
          startCoord = {
            x: height - 1,
            y: 0
          };
          endCoord = {
            x: 0,
            y: width - 1
          };
          break;
        case 3:
          startCoord = {
            x: height - 1,
            y: width - 1
          };
          endCoord = {
            x: 0,
            y: 0
          };
          break;
      }
    }
  
    genMap();
    defineStartEnd();
    defineMaze();
  }
  
  function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
    var map = Maze.map();
    var cellSize = cellsize;
    var drawEndMethod;
    ctx.lineWidth = cellSize / 10;
    ctx.lineJoin = "round";
  
    this.redrawMaze = function(size) {
      cellSize = size;
      ctx.lineWidth = cellSize / 10;
      ctx.lineJoin = "round";
      drawMap();
      drawEndMethod();
    };
  
    function drawCell(xCord, yCord, cell) {
      ctx.strokeStyle = "rgb(0, 0, 141)"; 
      var x = xCord * cellSize;
      var y = yCord * cellSize;
      var linewidth = ctx.lineWidth / 2;
      
      ctx.lineJoin = "round"; // Ensure lineJoin is set for each cell
      ctx.beginPath(); // Start a new path for the whole cell
      
      // Draw the north border if cell.n is false
      if (cell.n === false) {
          ctx.moveTo(x - linewidth, y);  // Start slightly outside the top-left corner
          ctx.lineTo(x + cellSize + linewidth, y);  // Draw slightly outside the top-right corner
      }
      
      // Draw the east border if cell.e is false
      if (cell.e === false) {
          ctx.moveTo(x + cellSize, y - linewidth);  // Start slightly above the top-right corner
          ctx.lineTo(x + cellSize, y + cellSize + linewidth);  // Draw slightly below the bottom-right corner
      }
      
      // Draw the south border if cell.s is false
      if (cell.s === false) {
          ctx.moveTo(x + cellSize + linewidth, y + cellSize);  // Start slightly outside the bottom-right corner
          ctx.lineTo(x - linewidth, y + cellSize);  // Draw slightly outside the bottom-left corner
      }
      
      // Draw the west border if cell.w is false
      if (cell.w === false) {
          ctx.moveTo(x, y + cellSize + linewidth);  // Start slightly below the bottom-left corner
          ctx.lineTo(x, y - linewidth);  // Draw slightly above the top-left corner
      }
      
      ctx.stroke();  // Stroke the whole path
      ctx.closePath();  // Close the path (optional)
  }
  
    function drawMap() {
      for (x = 0; x < map.length; x++) {
        for (y = 0; y < map[x].length; y++) {
          drawCell(x, y, map[x][y]);
        }
      }
    }
  
    function drawEndFlag() {
      var coord = Maze.endCoord();
      var gridSize = 4;
      var fraction = cellSize / gridSize - 2;
      var colorSwap = true;
      for (let y = 0; y < gridSize; y++) {
        if (gridSize % 2 == 0) {
          colorSwap = !colorSwap;
        }
        for (let x = 0; x < gridSize; x++) {
          ctx.beginPath();
          ctx.rect(
            coord.x * cellSize + x * fraction + 4.5,
            coord.y * cellSize + y * fraction + 4.5,
            fraction,
            fraction
          );
          if (colorSwap) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          } else {
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          }
          ctx.fill();
          colorSwap = !colorSwap;
        }
      }
    }
  
    function drawEndSprite() {
      if (!endSprite) return; // Ensure sprite exists

      var coord = Maze.endCoord();
      var playerSize = cellSize * 0.6; // Scale Pac-Man to 60% of the cell size
  
      // Calculate the offset to center the sprite
      var centerX = coord.x * cellSize + (cellSize - playerSize) / 2;
      var centerY = coord.y * cellSize + (cellSize - playerSize) / 2;
  
      ctx.drawImage(
          endSprite,
          0,
          0,
          endSprite.width,
          endSprite.height,
          centerX,
          centerY,
          playerSize,
          playerSize
      );
  }
  
  
    function clear() {
      var canvasSize = cellSize * map.length;
      ctx.clearRect(0, 0, canvasSize, canvasSize);
    }
  
    drawEndMethod = endSprite ? drawEndSprite : drawEndFlag;
    clear();
    drawMap();
    drawEndMethod();
  }
  
  function Player(maze, c, _cellsize, onComplete, sprite = null) {
    this.handleKeyPress = check; // Expose the check function globally
    var ctx = c.getContext("2d");
    var moves = 0;
    var map = maze.map();
    var cellCoords = {
        x: maze.startCoord().x,
        y: maze.startCoord().y
    };
    var cellSize = _cellsize;

    // New: Track the player's direction
    var direction = "left"; // Default direction is left

    // Redraw the player when the maze or cell size changes
    this.redrawPlayer = function (_cellsize) {
        cellSize = _cellsize;
        drawSprite(cellCoords);
    };

    // Draw Pac-Man's sprite, rotated based on direction
    function drawSprite(coord) {
        // Clear the previous sprite
        clearSprite(coord);

        // Save the canvas state
        ctx.save();

        // Calculate the center of the cell
        var centerX = coord.x * cellSize + cellSize / 2;
        var centerY = coord.y * cellSize + cellSize / 2;

        // Translate to the center of the cell
        ctx.translate(centerX, centerY);

        // Rotate the canvas based on the current direction
        switch (direction) {
            case "down":
                ctx.rotate((Math.PI * 3) / 2); // 270 degrees
                break;
            case "up":
                ctx.rotate(Math.PI / 2); // 90 degrees
                break;
            case "left":
                ctx.rotate(0); // 0 degrees
                break;
            case "right":
                ctx.rotate(Math.PI); // 180 degrees
                break;
        }

        // Draw the sprite
        var playerSize = cellSize * 0.6; // Scale Pac-Man to 60% of the cell size
        var offset = -playerSize / 2; // Center the sprite
        ctx.drawImage(sprite, 0, 0, sprite.width, sprite.height, offset, offset, playerSize, playerSize);

        // Restore the canvas state
        ctx.restore();

        // Check for win condition
        if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
            onComplete(moves);
            this.unbindKeyDown();
        }
    }

    // Clear the area around the sprite
    function clearSprite(coord) {
        var playerSize = cellSize * 0.8;
        var offset = (cellSize - playerSize) / 2;
        ctx.clearRect(coord.x * cellSize + offset, coord.y * cellSize + offset, playerSize, playerSize);
    }

    // Handle movement and update direction
    function check(e) {
        var cell = map[cellCoords.x][cellCoords.y];
        moves++;
        switch (e.keyCode) {
            case 65: // A key
            case 37: // Left arrow
                if (cell.w) {
                    direction = "left"; // Update direction
                    movePlayer(-1, 0);
                }
                break;
            case 87: // W key
            case 38: // Up arrow
                if (cell.n) {
                    direction = "up"; // Update direction
                    movePlayer(0, -1);
                }
                break;
            case 68: // D key
            case 39: // Right arrow
                if (cell.e) {
                    direction = "right"; // Update direction
                    movePlayer(1, 0);
                }
                break;
            case 83: // S key
            case 40: // Down arrow
                if (cell.s) {
                    direction = "down"; // Update direction
                    movePlayer(0, 1);
                }
                break;
        }
    }

    // Move the player to a new cell and redraw
    function movePlayer(dx, dy) {
        clearSprite(cellCoords);
        cellCoords = { x: cellCoords.x + dx, y: cellCoords.y + dy };
        drawSprite(cellCoords);
    }

    // Bind keydown events for player control
    this.bindKeyDown = function () {
        window.addEventListener("keydown", check, false);
    };

    // Unbind keydown events
    this.unbindKeyDown = function () {
        window.removeEventListener("keydown", check, false);
    };

    // Initial draw of the player at the start position
    drawSprite(cellCoords);
    this.bindKeyDown();
}

  
  var mazeCanvas = document.getElementById("mazeCanvas");
  var ctx = mazeCanvas.getContext("2d");
  ctx.lineJoin = "round";
  var sprite;
  var finishSprite;
  var maze, draw, player;
  var cellSize;
  var difficulty;
  // sprite.src = 'media/sprite.png';
  
  window.onresize = function() {
    // We no longer need to resize the canvas itself, since it's fixed in size.
    // But we do need to redraw the maze and player with the correct cell size.

    // Fixed width and height of the canvas
    let canvasWidth = mazeCanvas.width;
    let canvasHeight = mazeCanvas.height;

    // Get the 2D rendering context
    ctx = mazeCanvas.getContext("2d");

    ctx.lineJoin = "round";

    // Calculate the cell size based on the fixed canvas width and height
    cellSize = Math.min(canvasWidth / difficulty, canvasHeight / difficulty);

    // Redraw maze and player if they exist
    if (player != null) {
        draw.redrawMaze(cellSize);
        player.redrawPlayer(cellSize);
    }
};

  window.onload = function() {
    showDifficultyPopup(); // Show difficulty selection

    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if (viewHeight < viewWidth) {
        ctx.canvas.width = viewHeight - viewHeight / 100;
        ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
        ctx.canvas.width = viewWidth - viewWidth / 100;
        ctx.canvas.height = viewWidth - viewWidth / 100;
    }

    // Load and edit sprites
    let completeOne = false;
    let completeTwo = false;

    function isComplete() {
        if (completeOne && completeTwo) {
            console.log("Sprites Loaded - Starting Maze");
            setTimeout(makeMaze, 500);
        }
    }

    // Load Pac-Man sprite
    sprite = new Image();
    sprite.src =
      "./Sprites/PacMan.png" +
      "?" +
      new Date().getTime();
    sprite.setAttribute("crossOrigin", " ");
    sprite.onload = function() {
      sprite = changeBrightness(1.2, sprite);
      completeOne = true;
      console.log(completeOne);
      isComplete();
    };

    // Select a random ghost
    const ghosts = ["Blinky", "Pinky", "Inky", "Clyde"];
    const randomGhost = ghosts[Math.floor(Math.random() * ghosts.length)];

    // Load random ghost sprite
    finishSprite = new Image();
    finishSprite.src = `./Sprites/${randomGhost}.png`;
    finishSprite.onload = function() {
        finishSprite = changeBrightness(1.1, finishSprite);
        completeTwo = true;
        console.log(`Ghost Loaded: ${randomGhost}`);
        isComplete();
    };

    // Error handling in case of missing files
    finishSprite.onerror = function() {
        console.error(`Failed to load: ${finishSprite.src}`);
    };
};

function showDifficultyPopup() {
  Swal.fire({
      title: "Welcome to Pac-Man: The Ghost Slayer!",
      text: "Use arrow keys or touch controls to move. Escape the maze and avoid the ghosts!",
      confirmButtonText: "Play",
      allowOutsideClick: false,
      customClass: {
          popup: "swal2-popup"
      }
  }).then(() => {
      setDifficulty(1); // Start at Level 1 (Tutorial)
  });
}

function setDifficulty(level) {
  difficulty = level;
  Swal.close();
  makeMaze();
}

var difficulty;

function setDifficulty(level) {
  difficulty = level + 4; // Level 1 (tutorial) starts at difficulty 5
  Swal.close();
  makeMaze();
}

function makeMaze() {
  if (player != undefined) {
      player.unbindKeyDown();
      player = null;
  }

  cellSize = mazeCanvas.width / difficulty;
  maze = new Maze(difficulty, difficulty);

  // Select a different ghost for each level
  const ghosts = ["Blinky", "Pinky", "Inky", "Clyde"];
  let selectedGhost = ghosts[(difficulty - 1) % ghosts.length]; // Cycle through ghosts

  finishSprite = new Image();
  finishSprite.src = `./Sprites/${selectedGhost}.png`;

  finishSprite.onload = function () {
      console.log(`Ghost Loaded: ${selectedGhost}`); // Debugging check
      finishSprite = changeBrightness(1.1, finishSprite); 

      // Create the maze drawing **after** the sprite has loaded
      draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
      player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);

      ctx.lineJoin = "round";

      if (document.getElementById("mazeContainer").style.opacity < "100") {
          document.getElementById("mazeContainer").style.opacity = "100";
      }

      // Force a redraw to display the end sprite
      setTimeout(() => draw.redrawMaze(cellSize), 100); // Small delay ensures rendering
  };

  finishSprite.onerror = function () {
      console.error(`Failed to load: ${finishSprite.src}`);
  };
}
