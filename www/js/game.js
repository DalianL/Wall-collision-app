// to handle the game's main components
var canvas, ctx, w, h;
var player;
var level;

// to handle game states
var gameStates = {
  mainMenu: 0,
  gameRunning: 1,
  gameOver: 2,
};

// to block multiple inputs when there should be only one
var inputDetected = false;
var inputDetected2 = false;
var inputDelay = 200;
var inputStates = {};
var input;

// to define the starting game screen
var currentGameState = gameStates.mainMenu;

// to determine button coordinates
var button1, button2, button3, button4, button5, button6;

function init() {
	canvas = document.querySelector("#myCanvas");
	ctx = canvas.getContext("2d");
	w = canvas.width;
	h = canvas.height;

	button1 = new Array(93,130,203,165);
	button2 = new Array(93,210,203,245);
	button3 = new Array(93,290,203,325);
	button4 = new Array(93,370,203,405);

	level = new LevelHandler(5, 400);

	// Attachs different listeners according to the device type
	// since mouseup interfers on mobile
	if (isMobile()) {
		canvas.addEventListener('touchstart', function(e) {
			input = getTouchPos(canvas, e);
			inputStates.press = true;
		}, false);

		canvas.addEventListener('touchmove', function(e) {
			input = getTouchPos(canvas, e);
		}, false);

		canvas.addEventListener('touchend', function(e) {
			inputStates.press = false;
		}, false);
	} else {
		// For debugging on computer
		canvas.addEventListener('mousedown', function(e) {
			input = getMousePos(canvas, e);
			inputStates.press = true;
		}, false);

		canvas.addEventListener('mouseup', function(e) {
			inputStates.press = false;
		}, false);	
	}

	run();

}

function run(time) {

	// number of ms since last frame draw
	delta = timer(time);

	// on efface le canvas
	ctx.clearRect(0, 0, w, h);

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
		  //gameOverState(time);
		  break;
	}
}

function mainMenuState() {
	ctx.save();

	ctx.font = "20px Verdana";
	ctx.fillStyle = "red";
	ctx.fillText("--- Wall Survival ---", 50, 60);
	
	ctx.restore()
	
	ctx.font = "10px Verdana";
	ctx.fillText("Mode 1 Easy", 115, 150);
	ctx.fillText("Mode 1 Hard", 115, 230);
	ctx.fillText("Mode 2 Easy", 115, 310);
	ctx.fillText("Mode 2 Hard", 115, 390);

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
		} else if (input.x < button4[2] && input.x > button4[0] && input.y < button4[3] && input.y > button4[1]) {
			initMode(4);
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
	setInterval(function() {
		level.addWall();
	}, 2000 / num);

}

function checkPlayerCollision() {
	// checks if the corner of the square hits a line
	let playerCorners = [
		[player.x, player.y], 
		[player.x + player.w, player.y], 
		[player.x + player.w, player.y + player.h], 
		[player.x, player.y + player.h]
	];
	let lastWall = level.walls[0];
	// TDOO : Get points from lastWall
	// to compute distance from player
	playerCorners.forEach((j) => {
		
	});
}

function distancePoint(x1, y1, x2, y2) {
	return Math.sqrt( ((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)) );
}