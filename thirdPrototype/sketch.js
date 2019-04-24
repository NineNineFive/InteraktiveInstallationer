
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




/*
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
function setup(){

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
    for(var i = 0; i < objloadertest.length; i++){
        objloadertest2[i] = loadObj(objloadertest[i]);
    }


    //spawnObjs();

}

function draw(){

}

document.getElementById('MobileVR').onclick = () => { // (Lambda expression) when Mobile VR button is pressed then
    document.getElementById('defaultButtons').style.display = "none";
    document.getElementById('mobileButtons').style.display = "block";
    setupScene();
    animateScene();
    vr.mobileVR(); // Launch Mobile VR


}


document.getElementById('ComputerVR').onclick = () => { // When Mobile VR button is pressed then
    document.getElementById('defaultButtons').style.display = "none";
    setupScene();
    animateScene();
    vr.computerVR(); // Launch Computer VR


}

window.onload = setup(); // When site is loaded then run setup (because we don't use p5)



