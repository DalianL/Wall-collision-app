class Player {
	constructor(x, y) {
		// Placed along the normal axis
		this.x = x;
		// Reversed axis means we have to deduct from the max height
		// in order to have a "classic" reference
		this.y = y;
		this.alive = true;
		this.speed = 300;
		this.w = 30;
		this.h = 30;
		this.win = false;
	}

	draw(ctx) {
		if (this.alive) {
			ctx.save();
			if (!isMobile()) {
				ctx.fillStyle = "black";
				ctx.fillRect(this.x, this.y, this.w, this.h);
			} else {
				var car = new Image(); // HTML5 Constructor
				car.src = 'images/car.png';
				ctx.drawImage(car, this.x, this.y, this.w, this.h);
			}
			ctx.restore();
		}
	}

	move(inputStates, delta) {
		this.vx = this.vy = 0;
		// Checks inputStates
		if (inputStates.press && input.x < this.x + 10) {
		  this.vx = -this.speed;
		} else if (inputStates.press && input.x > this.x + 20) {
		  this.vx = this.speed;
		}
		// if (inputStates.press && input.y < this.y + 10) {
		//   this.vy = -this.speed;
		// } else if (inputStates.press && input.y > this.y + 20) {
		//   this.vy = this.speed;
		// }

		this.x += calcDistanceToMove(delta, this.vx);
		//this.y += calcDistanceToMove(delta, this.vy);
	}

	// Moving with buttons for level 2 only
	btnMove(direction) {
		var newX = direction + this.x;
		if(newX > 0 && newX < 270) {
			this.x = newX;
		}
	}

	reset() {
		this.win = false;
		this.alive = true;
		this.x = w/2 - 15;
		this.y = 460;
	}

	playerAndWallCollisionCheck() {
	  if(this.x <= 0) {
	    this.x = 5;
	  }
	  if(this.x + this.w >= w) {
	    this.x = w - this.w - 5;
	  }
	  if(this.y <= 0) {
	    this.y = 5;
	  }
	  if(this.y + this.h >= h) {
	    this.y = h - this.h - 5;
	  }
	}

}