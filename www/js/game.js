// to handle the game's main components
var canvas, ctx, w, h;
var player;
var level;
var mode;
var buttons;

// to disable the click listeners in certain Modes
var listenersEnabled = true;

// to set the maximum amount of walls
var levelEnd = 20;
var hasEnded = false;

// to handle game states
var gameStates = {
  mainMenu: 0,
  gameRunning: 1,
  gameOver: 2,
};

// to block multiple inputs when there should be only one
var inputDetected = false;
var inputDelay = 200;
var inputStates = {};
var input;

// to define the starting game screen
var currentGameState = gameStates.mainMenu;

// to determine button coordinates
var button1, button2, button3, button4, button5, button6;

// to delete the spawner after a reset
var spawnIntervalId;

function init() {
	let movement = 60;

	canvas = document.querySelector("#myCanvas");
	buttons = document.querySelector("#buttons");
	bt1 = document.querySelector("#bt1");
	bt2 = document.querySelector("#bt2");
	ctx = canvas.getContext("2d");
	w = canvas.width;
	h = canvas.height;

	button1 = new Array(93,130,203,165);
	button2 = new Array(93,210,203,245);
	button3 = new Array(93,290,203,325);
	button4 = new Array(93,370,203,405);

	level = new LevelHandler(5, 400, levelEnd);

	// Attachs different listeners according to the device type
	// since mouseup interfers on mobile
	if (isMobile()) {
		canvas.addEventListener('touchstart', function(e) {
			if (listenersEnabled) {
				input = getTouchPos(canvas, e);
				inputStates.press = true;
			}
		}, false);

		canvas.addEventListener('touchmove', function(e) {
			if (listenersEnabled) input = getTouchPos(canvas, e);
		}, false);

		canvas.addEventListener('touchend', function(e) {
			if (listenersEnabled) inputStates.press = false;
		}, false);

		bt1.addEventListener('touchstart', function(e) {
			player.btnMove(-movement);	
		}, false);

		bt2.addEventListener('touchstart', function(e) {
			player.btnMove(movement);
		}, false);

	} else {
		// For debugging on computer
		canvas.addEventListener('mousedown', function(e) {
			if (listenersEnabled) {
				input = getMousePos(canvas, e);
				inputStates.press = true;	
			}
		}, false);

		canvas.addEventListener('mouseup', function(e) {
			if (listenersEnabled) inputStates.press = false;
		}, false);	

		bt1.addEventListener('click', function(e) {
			player.btnMove(-movement);
		}, false);

		bt2.addEventListener('click', function(e) {
			player.btnMove(movement);
		}, false);
	}

	run();

}

function run(time) {

	// number of ms since last frame draw
	delta = timer(time);

	// on efface le canvas
	ctx.clearRect(0, 0, w, h);

	if (currentGameState == gameStates.gameRunning) {
		if (player.alive == false) {
			currentGameState = gameStates.gameOver;
		}
	}

	handleGameState(time);

	// on relance l'animation si possible
	// dans 1/60ème de seconde (16.6ms)
	requestAnimationFrame(run);
}

function handleGameState(time) {
	switch (currentGameState) {
		case gameStates.mainMenu:
		  mainMenuState();
		  break;
		case gameStates.gameRunning:
		  mainGameLoop(time);
		  break;
		case gameStates.gameOver:
		  gameOverState(time);
		  break;
	}
}

function mainMenuState() {
	ctx.save();

	ctx.font = "20px Verdana";
	ctx.fillStyle = "white";
	ctx.fillText("--- Road Survival ---", 65, 60);
	
	ctx.restore()
	
	ctx.font = "10px Verdana";
	ctx.fillStyle = "white";
	ctx.fillText("Mode 1 Easy", 114, 150);
	ctx.fillText("Mode 1 Hard", 114, 230);
	ctx.fillText("Mode 2 Easy", 114, 310);
	ctx.fillText("Mode 2 Hard", 114, 390);

	ctx.beginPath();
	ctx.lineWidth="2";
	ctx.rect(button1[0],button1[1],button1[2]-button1[0],button1[3]-button1[1]);
	ctx.rect(button2[0],button2[1],button2[2]-button2[0],button2[3]-button2[1]);
	ctx.rect(button3[0],button3[1],button1[2]-button3[0],button3[3]-button3[1]);
	ctx.rect(button4[0],button4[1],button1[2]-button4[0],button4[3]-button4[1]);
	ctx.stroke();

	ctx.restore();

	if (inputStates.press) {
		if (input.x < button1[2] && input.x > button1[0] && input.y < button1[3] && input.y > button1[1]) {
			initMode(1);
		} else if (input.x < button2[2] && input.x > button2[0] && input.y < button2[3] && input.y > button2[1]) {
			initMode(2);
		} else if (input.x < button3[2] && input.x > button3[0] && input.y < button3[3] && input.y > button3[1]) {
			initMode(3);
			buttons.style.visibility ='visible';
			listenersEnabled = false;
		} else if (input.x < button4[2] && input.x > button4[0] && input.y < button4[3] && input.y > button4[1]) {
			initMode(4);
			buttons.style.visibility ='visible';
			listenersEnabled = false;
		}
	}

}

function mainGameLoop(time) {
	// Draws game elements
	player.draw(ctx);
	level.drawWalls(ctx);

	checkPlayerCollision();

    player.move(inputStates, delta);
    level.moveWalls();

}

function initMode(num) {
	mode = num;
	// Position player at the center
	player = new Player((w/2) - 15, 460);
	level.initLevel(num);
	if (num == 2 || num == 4) {
		// increase player speed for hard mode
		player.speed = player.speed * 1.33;
	}
	inputStates.press = false; 
	currentGameState = gameStates.gameRunning;

	if (num > 2) num = num - 2;
	if (spawnIntervalId == undefined) {
		spawnIntervalId = setInterval(function() {
			level.addWall();
		}, 2000 / num);
	}

}

function checkPlayerCollision() {
	let playerCorners = [
		[player.x + 1, player.y + 1], 
		[player.x - 1 + player.w, player.y + 1], 
		[player.x - 1 + player.w, player.y + player.h], 
		[player.x + 1, player.y + player.h]
	];

	var lastWall = level.walls[0];
	if (lastWall != undefined) {
		// Checks collision between each player corner and wall points
		playerCorners.forEach(function (j) {
			for (var x = 0; x < lastWall.firstLength; x++) {
				if (distancePoint(j[0], j[1], x, lastWall.y) < 1) {
					player.alive = false;
				}
			}
			for (var x = lastWall.firstLength + lastWall.holeLength + 1; x <= lastWall.totalLength; x++) {
				if (distancePoint(j[0], j[1], x, lastWall.y) < 1) {
					player.alive = false;
					if (lastWall.holeLength == 0) {
						player.win = true;
					}
				}	
			}
			
		});		
	}

}

function gameOverState(time) {
	listenersEnabled = true;
	ctx.save();

	ctx.font = "20px Verdana";
	ctx.fillStyle = "red";

	if (player.win) {
		ctx.fillText("YOU WIN !!", 93, 90);
	} else {
		ctx.fillText("GAME OVER", 88, 90);
	}
	
	ctx.restore()
	
	ctx.font = "10px Verdana";
	if (!player.win) {
		ctx.fillText("Retry", 132, 230);
	}
	ctx.fillText("Main Menu", 118, 310);

	ctx.beginPath();
	ctx.lineWidth="2";
	if (!player.win) {
		ctx.rect(button2[0],button2[1],button2[2]-button2[0],button2[3]-button2[1]);
	}
	ctx.rect(button3[0],button3[1],button1[2]-button3[0],button3[3]-button3[1]);
	ctx.stroke();

	ctx.restore();

	if (inputStates.press) {
		// Retry Button
		if (input.x < button2[2] && input.x > button2[0] && input.y < button2[3] && input.y > button2[1]) {
			if (!player.win) {
				resetGame(time);
				initMode(mode);
			}
		} else if (input.x < button3[2] && input.x > button3[0] && input.y < button3[3] && input.y > button3[1]) {
			if (!inputDetected) {
				inputDetected = true;
				// Hide buttons menu
				buttons.style.visibility='hidden';
				setTimeout(function() {
					resetGame(time);
					currentGameState = gameStates.mainMenu;
					inputDetected = false;
				}, inputDelay);
			}
		}
	}

}

function resetGame(time) {
	level.walls = [];
	level.maxWalls = levelEnd;
	hasEnded = false;
	player.reset();
	clearInterval(spawnIntervalId);
	spawnIntervalId = undefined;
}