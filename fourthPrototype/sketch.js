/*
async function waitLoaded () {
    for (let i = 0; i < objs.length; i++) {
        await objs[i].load().then(() =>{ console.log("heyyyy"); });
        console.log("lars");
    }
}

function loadObj(modelName) {
    var loader = new THREE.OBJLoader2();
    var callbackOnLoad = function (event) {
        //objs.push(event.detail.loaderRootNode);
        //vr.addObj(objs);

        vr.scene.add(event.detail.loaderRootNode);
    };
    var onLoadMtl = function (materials) {
        loader.setModelName(modelName);
        loader.setMaterials(materials);
        loader.load('models/' + modelName + '.obj', callbackOnLoad, null, null, null, false);
    };
    loader.loadMtl('models/' + modelName + '.mtl', null, onLoadMtl);
}




var objloadertest = [
    "chessboard",
    "Pawn","Pawn","Pawn","Pawn","Pawn","Pawn","Pawn","Pawn",
    "Pawn","Pawn","Pawn","Pawn","Pawn","Pawn","Pawn","Pawn",
    "Rook","Rook",
    "Knight","Knight",
    "Bishop","Bishop",
    "King","King",
    "Queen","Queen",
];
var objloadertest2 = [];
var objs = [];
var vr;
var speech;


async function spawnObjs(){

    for (let i = 0; i < objs.length; i++) {
        if(objs[i].obj != null) {
            console.log(objs[i].obj);
            vr.addObj(objs[i].obj);
        }
    }

    await this;
}
*/
let chessboard;
let j = 0;
let img;
let camera;
let loadObjs3D = [
    "Rook","Knight","Bishop","Queen","King","Bishop","Knight","Rook",
    "Pawn","Pawn","Pawn","Pawn","Pawn","Pawn","Pawn","Pawn",
    "Rook","Knight","Bishop","Queen","King","Bishop","Knight","Rook",
    "Pawn","Pawn","Pawn","Pawn","Pawn","Pawn","Pawn","Pawn"
];

let objs3D = [];

function preload() {
    for(let i = 0; i < loadObjs3D.length; i++){
        objs3D[i] = loadModel('models/'+loadObjs3D[i]+'.obj');
    }

    img = loadImage('models/woodie.png');
    chessboard = loadModel('models/Chessboard.obj');
}


function setup(){
    createCanvas(windowWidth, windowHeight, WEBGL);
    camera = createCamera();
    camera.perspective();

}





function draw(){
    let v = createVector(0,1,-2);
    //v.rotate(-PI*1.8,0,0);
    directionalLight(color('#fff'),v);

    background(120);
    rotateX(-PI*1.3);

if(vr!=null){
    vr.camera = camera;
}


    scale(10);
    texture(img);
    model(chessboard);

    translate(-17.3,0,-17.8);

    specularMaterial(200);

    for(let i = 0; i < 8; i++){
        rotateY(PI);
        model(objs3D[i]);
        rotateY(PI);
        translate(5, 0, 0);
    }

    translate(-40, 0, 5);
    for(let i = 8; i < 16; i++){
        model(objs3D[i]);
        translate(5, 0, 0);
    }
    translate(-40,0,30);
    for(let i = 16; i < 24; i++){
        model(objs3D[i]);
        translate(5, 0, 0);
    }
    translate(-40,0,-5);
    for(let i = 24; i < 32; i++){
        model(objs3D[i]);
        translate(5, 0, 0);
    }



}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}



document.getElementById('MobileVR').onclick = () => { // (Lambda expression) when Mobile VR button is pressed then
    document.getElementById('defaultButtons').style.display = "none";
    document.getElementById('mobileButtons').style.display = "block";
    setupScene();
    animateScene();
    //vr.mobileVR(); // Launch Mobile VR


}


document.getElementById('ComputerVR').onclick = () => { // When Mobile VR button is pressed then
    document.getElementById('defaultButtons').style.display = "none";
    setupScene();
    animateScene();
    //vr.computerVR(); // Launch Computer VR


}



function setupScene(){
    if(typeof SpeechReg!=="undefined") speech = new SpeechReg(); // Launch SpeechReg

    vr = new VR(); // Launch VR Library
    vr.webgl(); // Launch webgl (3d graphics renderer)

}


function animateScene(){

    vr.animate();
    /*
    waitLoaded().then(function(){
        for (let i = 0; i < objs.length; i++) {
            console.log(objs[i].obj);
            vr.addObj(objs[i].obj);
        }

    });
    */

    //spawnObjs();

}

//window.onload = setup(); // When site is loaded then run setup (because we don't use p5)



