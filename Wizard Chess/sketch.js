
var chess;

function setup() {
    createCanvas(1000,1000,WEBGL);
    noLoop();
  // put setup code here

    background(0);

    push();
    rotateZ(frameCount * 0.02);
    rotateX(frameCount * 0.02);
    rotateY(frameCount * 0.02);
    fill(255, 255, 255);
    box(50);
    pop();

    chess = loadModel('chess-pieces.obj');
    // put drawing code here

    model(chess);
    box(50);
}

function draw() {

}