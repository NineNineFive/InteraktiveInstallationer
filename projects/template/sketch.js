class Ball{
    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw(){
        fill(this.color);
        ellipse(this.x,this.y,20,20);
    }

    move(inputX, inputY){
        this.x += inputX;
        this.y = this.y + inputY;
    }
}

var ball;

function setup() {
    createCanvas(400, 400);

    ball = [new Ball(50,50,"pink"),new Ball(100,100,"blue")];
    ball.kage = true;
}

function draw() {
    background("red");
    for(var i = 0; i<ball.length;i++){
        ball[i].draw();
    }
}