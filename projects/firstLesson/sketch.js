/* === ff
ml5 Example
PoseNet example using p5.js to draw with your nose on the canvas
=== */

let video;
let poseNet;
let poses = [];
let skeletons = [];



function setup() {
    createCanvas(windowWidth, windowHeight);
    video = createCapture(VIDEO);
    video.size(640, 480);
    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video, modelReady);

    poseNet.on('pose', function(results) {
        poses = results;
    });

    // Hide the video element, and just show the canvas
    video.hide();

    pixelDensity(1);

    noStroke();
    noScrolling();
    console.log("Setup complete");


}

function draw() {
    background(0);
    image(video, 0, 0,640, 480);
    drawKeypoints();
    drawSkeleton();
    if(poses.length > 0)
    {

        var positionNose = poses[0].pose.keypoints[0].position;
        fill("red");
        ellipse(positionNose.x,positionNose.y,40,40);
    }

}



// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
        // For each pose detected, loop through all the keypoints
        for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = poses[i].pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.2) {

                fill(255, 0, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
                fill(0,255,0);
                textSize(30);
                text(j, keypoint.position.x, keypoint.position.y);


            }
        }
    }

}

// A function to draw the skeletons
function drawSkeleton() {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {
        // For every skeleton, loop through all body connections
        for (let j = 0; j < poses[i].skeleton.length; j++) {
            let partA = poses[i].skeleton[j][0];
            let partB = poses[i].skeleton[j][1];
            stroke(255, 0, 0);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}

// The callback that gets called every time there's an update from the model
function gotPoses(results) {
    poses = results;
}

function keyPressed() {
    pg.clear();
}

function modelReady() {}











function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyReleased() {

    if (key == 'f') {
        var fs = fullscreen();
        fullscreen(!fs);
    }
}

function noScrolling()
{
    document.addEventListener('touchstart', function(event) {
        event.preventDefault();
    }, {
        passive: false
    });
}



