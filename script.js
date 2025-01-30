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
    confirmButtonText: 'Zanimivo!'
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

// Function to toggle the side navigation and show the navbar at the top
// Function to toggle the side navigation and show the navbar at the top
function toggleNav() {
  const sideNav = document.getElementById('sideNav');
  const navbar = document.getElementById('navbar');
  const burgerIcon = document.getElementById('burgerIcon');

  // Toggle the side navigation visibility and hide/show the navbar and burger icon
  sideNav.classList.toggle('open');
  burgerIcon.classList.toggle('hide');
}

// Function to close the side navigation (close button)
function closeNav() {
  const sideNav = document.getElementById('sideNav');
  const navbar = document.getElementById('navbar');
  const burgerIcon = document.getElementById('burgerIcon');

  // Remove the 'open' class to hide the side nav
  sideNav.classList.remove('open');
  burgerIcon.classList.remove('hide');
}





document.getElementById("startMazeBtn").addEventListener("click", function () {
  // Force browser zoom to 100%
  document.body.style.zoom = "100%"; // Works for most modern browsers

  // Alternatively, set the viewport dynamically for better compatibility
  const metaTag = document.querySelector("meta[name='viewport']");
  if (metaTag) {
      metaTag.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
  } else {
      const newMetaTag = document.createElement("meta");
      newMetaTag.name = "viewport";
      newMetaTag.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      document.head.appendChild(newMetaTag);
  }

  console.log("Zoom set to 100%"); // Optional: Debug message
  makeMaze(); // Call the existing makeMaze function to start the maze
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
  
  function displayVictoryMess(moves) {
    Swal.fire({
        title: 'Congratulations!',
        text: 'You completed the maze in ' + moves + ' moves.',
        icon: 'success',
        confirmButtonText: 'Play Again',
        customClass: {
            popup: 'sweet-popup'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            makeMaze();
        }
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
    ctx.lineWidth = cellSize / 40;
  
    this.redrawMaze = function(size) {
      cellSize = size;
      ctx.lineWidth = cellSize / 50;
      drawMap();
      drawEndMethod();
    };
  
    function drawCell(xCord, yCord, cell) {
      ctx.strokeStyle = "blue"; 
      var x = xCord * cellSize;
      var y = yCord * cellSize;
  
      if (cell.n == false) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
      }
      if (cell.s === false) {
        ctx.beginPath();
        ctx.moveTo(x, y + cellSize);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }
      if (cell.e === false) {
        ctx.beginPath();
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }
      if (cell.w === false) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
      }
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
      var offsetLeft = cellSize / 50;
      var offsetRight = cellSize / 25;
      var coord = Maze.endCoord();
      ctx.drawImage(
        endSprite,
        2,
        2,
        endSprite.width,
        endSprite.height,
        coord.x * cellSize + offsetLeft,
        coord.y * cellSize + offsetLeft,
        cellSize - offsetRight,
        cellSize - offsetRight
      );
    }
  
    function clear() {
      var canvasSize = cellSize * map.length;
      ctx.clearRect(0, 0, canvasSize, canvasSize);
    }
  
    if (endSprite != null) {
      drawEndMethod = drawEndSprite;
    } else {
      drawEndMethod = drawEndFlag;
    }
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
  var sprite;
  var finishSprite;
  var maze, draw, player;
  var cellSize;
  var difficulty;
  // sprite.src = 'media/sprite.png';
  
  window.onload = function() {
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if (viewHeight < viewWidth) {
      ctx.canvas.width = viewHeight - viewHeight / 100;
      ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
      ctx.canvas.width = viewWidth - viewWidth / 100;
      ctx.canvas.height = viewWidth - viewWidth / 100;
    }
  
    //Load and edit sprites
    var completeOne = false;
    var completeTwo = false;
    var isComplete = () => {
      if(completeOne === true && completeTwo === true)
         {
           console.log("Runs");
           setTimeout(function(){
             makeMaze();
           }, 500);         
         }
    };
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
  
    finishSprite = new Image();
    finishSprite.src = "./Sprites/Blinky.png"+
    "?" +
    new Date().getTime();
    finishSprite.setAttribute("crossOrigin", " ");
    finishSprite.onload = function() {
      finishSprite = changeBrightness(1.1, finishSprite);
      completeTwo = true;
      console.log(completeTwo);
      isComplete();
    };
    
  };
  
  window.onresize = function() {
    // We no longer need to resize the canvas itself, since it's fixed in size.
    // But we do need to redraw the maze and player with the correct cell size.

    // Fixed width and height of the canvas
    let canvasWidth = mazeCanvas.width;
    let canvasHeight = mazeCanvas.height;

    // Get the 2D rendering context
    ctx = mazeCanvas.getContext("2d");

    // Calculate the cell size based on the fixed canvas width and height
    cellSize = Math.min(canvasWidth / difficulty, canvasHeight / difficulty);

    // Redraw maze and player if they exist
    if (player != null) {
        draw.redrawMaze(cellSize);
        player.redrawPlayer(cellSize);
    }
};

  function makeMaze() {
    if (player != undefined) {
      player.unbindKeyDown();
      player = null;
    }
    if (document.querySelector('.side-nav').classList.contains('open')) var e = document.getElementById("diffSelectMobile");
    else var e = document.getElementById("diffSelect");
    difficulty = e.options[e.selectedIndex].value;
    cellSize = mazeCanvas.width / difficulty;
    maze = new Maze(difficulty, difficulty);
    draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
    player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
    if (document.getElementById("mazeContainer").style.opacity < "100") {
      document.getElementById("mazeContainer").style.opacity = "100";
    }
  }
