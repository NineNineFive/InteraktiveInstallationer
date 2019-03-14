let ball;

function setup() {
	createCanvas(400, 400);
	ball = new Ball("red", 50);
}

function draw() {
	background(220);
	ball.draw();
}

function mousePressed() {
	console.log(ball.checkCollider(mouseX, mouseY));
}


class Ball {
	constructor(color, size) {
		this.color = color;
		this.size = 50;
		this.x = 200;
		this.y = 200;

	}

	draw() {
		this.vertices = [{
				name: "leftCol",
				"x": this.x - this.size / 2,
				"y": this.y
			},
			{
				name: "rightCol",
				"x": this.x + this.size / 2,
				"y": this.y
			},
			{
				name: "topCol",
				"x": this.x,
				"y": this.y - this.size / 2
			},
			{
				name: "botCol",
				"x": this.x,
				"y": this.y + this.size / 2
			}
		];

		ellipse(this.x, this.y, this.size);
	}

	checkCollider(x, y) {
		if (x > this.vertices[0].x && x < this.vertices[1].x &&
			y > this.vertices[2].y && y < this.vertices[3].y) {
			return true;
		} else {
			return false;
		}
	}
}