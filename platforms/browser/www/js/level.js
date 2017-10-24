class Wall {
	constructor(y, firstLength, holeLength, totalLength) {
		this.y = y;
		this.firstLength = firstLength;
		this.holeLength = holeLength;
		this.totalLength = totalLength;
	}

	drawWall(ctx) {
		ctx.save();
		if (this.holeLength == 0) {
			// Draw the final wall
			ctx.beginPath();
			ctx.strokeStyle = 'red';
			ctx.moveTo(0, this.y);
			ctx.lineTo(this.totalLength, this.y);
			ctx.stroke();
		} else {
			// Draw normal walls
			// First part of the wall
			ctx.beginPath();
			ctx.strokeStyle = 'white';
			ctx.moveTo(0, this.y);
			ctx.lineTo(this.firstLength, this.y);
			ctx.stroke();

			// Second part of the wall
			ctx.beginPath();
			ctx.strokeStyle = 'white';
			ctx.moveTo(this.firstLength + this.holeLength, this.y);
			ctx.lineTo(this.totalLength, this.y);
			ctx.stroke();
		}
		ctx.restore();
	}
}

class LevelHandler {
	constructor(horizontalParts, verticalSteps, maxWalls) {
		this.obstacleWidth = w;
		this.horizontalParts = horizontalParts;
		this.horizontalSpacing = w/horizontalParts;
		this.verticalSpacing = h/verticalSteps;
		this.walls = [];
		this.previousWallPos = undefined;
		this.maxWalls = maxWalls;
	}

	initLevel(mode) {
		if (mode == 1 || mode == 3) {
			// Easy Mode
			this.speed = 1;
		} else if (mode == 2 || mode == 4) {
			// Hard Mode
			this.speed = 2;
		} else {
			// Debug Mode
			this.speed = 0;
		}
	}

	addWall() {
		if (this.maxWalls == 0) {
			this.walls.push(new Wall(0, 0, 0, w));
			this.maxWalls = this.maxWalls - 1;
		} else if (this.maxWalls > 0) {
			// To locate where the wall should have a hole
			let holePos = Math.floor(Math.random() * this.horizontalParts);
			if (this.previousWallPos != undefined) {
				if (holePos == this.previousWallPos) {
					while (holePos == this.previousWallPos) {
						holePos = Math.floor(Math.random() * this.horizontalParts);
					}
				} else if ((holePos + 4) == this.previousWallPos) {
					while ((holePos + 4) == this.previousWallPos) {
						holePos = Math.floor(Math.random() * this.horizontalParts);
					}
				} else if ((holePos - 4) == this.previousWallPos) {
					while ((holePos - 4) == this.previousWallPos) {
						holePos = Math.floor(Math.random() * this.horizontalParts);
					}
				}
			}
			this.previousWallPos = holePos;
			let firstWallLength = holePos * this.horizontalSpacing;
			this.walls.push(new Wall(0, firstWallLength, this.horizontalSpacing, w));
			this.maxWalls = this.maxWalls - 1;
		}
	}

	drawWalls(ctx) {
		this.walls.forEach(function(j) {
			j.drawWall(ctx);
		});
	}

	moveWalls() {
		this.walls.forEach((j) => {
			j.y = j.y + (this.verticalSpacing * this.speed);
			if (j.y > h) {
				let index = this.walls.indexOf(j);
				this.walls.splice(index, 1);
			}
		});
	}

}