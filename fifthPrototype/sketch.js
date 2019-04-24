class Chessboard {
    constructor(){
        // Load Chessboard
        let load = new loadObj(this.getName(),"woodie.png");


        // Load Objects
        this.loadAmount = 0;
        this.load = [];
        for(var i = 0; i < loadingObjs.length; i++){
            this.load.push(loadingObjs[i]);
            this.loadAmount += loadingObjs[i].count;
        }
        // Wait for everything to load before running scene
        this.waitForObjLoad();
    }

    getName(){
        return "Chessboard";
    }

    waitForObjLoad(){

        if(objs.length-1!==this.loadAmount) {
            setTimeout(() => {
                console.log("Waiting for everything to load");
                console.log(objs.length);
                console.log(this.loadAmount);
                this.waitForObjLoad();
            }, 1000);

        } else {
            let sortBy = [{
                prop:'name',
                direction: 1
            }];

            objs.sort(function(a,b){
                let i = 0, result = 0;
                while(i < sortBy.length && result === 0) {
                    result = sortBy[i].direction*(a[ sortBy[i].prop ].toString() < b[ sortBy[i].prop ].toString() ? -1 : (a[ sortBy[i].prop ].toString() > b[ sortBy[i].prop ].toString() ? 1 : 0));
                    i++;
                }
                return result;
            })

            console.log("Everything loaded");
            runScene(); // Run Scene
        }
    }
}

class ChessPieces {
    constructor(count,color){
        this.count = count;
        this.color = color;
        for(let i = 0; i < count; i++){
            let load = new loadObj(this.getName(),null);
        }
    }
}


class King extends ChessPieces {
    getName(){
        return "King";
    }
}

class Knight extends ChessPieces {
    getName(){
        return "Knight";
    }
}

class Bishop extends ChessPieces {
    getName(){
        return "Bishop";
    }
}

class Rook extends ChessPieces {
    getName(){
        return "Rook";
    }
}

class Queen extends ChessPieces {
    getName(){
        return "Queen";
    }
}
class Pawn extends ChessPieces {
    getName(){
        return "Pawn";
    }
}


let team = { white: 1, black: 2 };

let loadingObjs = [
    new Pawn(8,team.white),new Rook(2,team.white),new Knight(2,team.white),new Bishop(2,team.white),new Queen(1,team.white), new King(1,team.white),
    new Pawn(8,team.black),new Rook(2,team.black),new Knight(2,team.black),new Bishop(2,team.black),new Queen(1,team.black), new King(1,team.black)
];


var vr;
var speech;


function setupScene(){
    vr = new VR(); // Launch VR Library
    vr.webgl(); // Launch webgl (3d graphics renderer)

    vr.chessboard = new Chessboard();



}

function runScene(){
    vr.scene.background = new THREE.Color(0xc9ddfc);




    for(let i = 0; i<objs.length; i++){

        let j = 0;

        // White Pawns
        if(i>=11&&i<=18){
            j = i - 11;
            objs[i].position.x = 17.5 + 5 - ((j + 1) * 5);
            objs[i].position.y = -5;
            objs[i].position.z = -12.5;
            objs[i].material.color = {r:0.8,g:0.8,b:0.8};
        }

        // Black Pawns
        if(i>=19&&i<=26) {
            j = i - 19;
            objs[i].position.x = 17.5 + 5 - ((j +1) * 5);
            objs[i].position.y = -5;
            objs[i].position.z = 12.5;
            objs[i].material.color = {r:0.2,g:0.2,b:0.2};
        }

        // White Rook 1
        if(i==29){
            objs[i].position.x = 17.5;
            objs[i].position.y = -5;
            objs[i].position.z = -17.5;
            objs[i].material.color = {r:0.8,g:0.8,b:0.8};
        }
        // White Rook 2
        if(i==30){
            objs[i].position.x = 17.5 - (5 * 7);
            objs[i].position.y = -5;
            objs[i].position.z = -17.5;
            objs[i].material.color = {r:0.8,g:0.8,b:0.8};
        }

        // Black Rook 1
        if(i==31){
            objs[i].position.x = 17.5;
            objs[i].position.y = -5;
            objs[i].position.z = 17.5;
            objs[i].material.color = {r:0.2,g:0.2,b:0.2};
        }
        // Black Rook 2
        if(i==32){
            objs[i].position.x = 17.5 - (5 * 7);
            objs[i].position.y = -5;
            objs[i].position.z = 17.5;
            objs[i].material.color = {r:0.2,g:0.2,b:0.2};
        }

        // White Knight 1
        if(i==7){
            objs[i].position.x = 12.5;
            objs[i].position.y = -5;
            objs[i].position.z = -17.5;
            objs[i].rotation.y = Math.PI;
            objs[i].material[0].color = {r:0.8,g:0.8,b:0.8};
            objs[i].material[1].color = {r:0.8,g:0.8,b:0.8};
        }

        // White Knight 2
        if(i==8){
            objs[i].position.x = 12.5 - (5 * 5);
            objs[i].position.y = -5;
            objs[i].position.z = -17.5;
            objs[i].rotation.y = Math.PI;

            objs[i].material[0].color = {r:0.8,g:0.8,b:0.8};
            objs[i].material[1].color = {r:0.8,g:0.8,b:0.8};
        }

        // Black Knight 1
        if(i==9){
            objs[i].position.x = 12.5;
            objs[i].position.y = -5;
            objs[i].position.z = 17.5;
            objs[i].material[0].color = {r:0.2,g:0.2,b:0.2};
            objs[i].material[1].color = {r:0.2,g:0.2,b:0.2};
        }

        // Black Knight 2
        if(i==10){
            objs[i].position.x = 12.5 - (5 * 5);
            objs[i].position.y = -5;
            objs[i].position.z = 17.5;
            objs[i].material[0].color = {r:0.2,g:0.2,b:0.2};
            objs[i].material[1].color = {r:0.2,g:0.2,b:0.2};
        }

        // White Bishop 1
        if(i==0){
            objs[i].position.x = 7.5;
            objs[i].position.y = -5;
            objs[i].position.z = -17.5;
            objs[i].material.color = {r:0.8,g:0.8,b:0.8};
        }

        // White Bishop 2
        if(i==1){
            objs[i].position.x = 7.5 - (5 * 3);
            objs[i].position.y = -5;
            objs[i].position.z = -17.5;
            objs[i].material.color = {r:0.8,g:0.8,b:0.8};
        }

        // Black Bishop 1
        if(i==2){
            objs[i].position.x = 7.5;
            objs[i].position.y = -5;
            objs[i].position.z = 17.5;
            objs[i].material.color = {r:0.2,g:0.2,b:0.2};
        }

        // Black Bishop 2
        if(i==3){
            objs[i].position.x = 7.5 - (5 * 3);
            objs[i].position.y = -5;
            objs[i].position.z = 17.5;
            objs[i].material.color = {r:0.2,g:0.2,b:0.2};
        }

        // White Queen
        if(i==27){
            objs[i].position.x = 2.5;
            objs[i].position.y = -5;
            objs[i].position.z = -17.5;
            objs[i].material.color = {r:0.8,g:0.8,b:0.8};
        }

        // Black Queen
        if(i==28){
            objs[i].position.x = 2.5;
            objs[i].position.y = -5;
            objs[i].position.z = 17.5;
            objs[i].material.color = {r:0.2,g:0.2,b:0.2};
        }

        // White King
        if(i==5){
            objs[i].position.x = -2.5;
            objs[i].position.y = -5;
            objs[i].position.z = -17.5;
            objs[i].material.color = {r:0.8,g:0.8,b:0.8};
        }

        // Black King
        if(i==6){
            objs[i].position.x = -2.5;
            objs[i].position.y = -5;
            objs[i].position.z = 17.5;
            objs[i].material.color = {r:0.2,g:0.2,b:0.2};
        }
        // GameBoard
        if(i===4){
            objs[i].position.x = 0;
            objs[i].position.y = -5;
            objs[i].position.z = 0;
            vr.scene.add(objs[i]);
        } else {
            vr.group.add(objs[i]);
        }




    }
}

document.getElementById('MobileVR').onclick = () => { // (Lambda expression) when Mobile VR button is pressed then
    document.getElementById('defaultButtons').style.display = "none";
    document.getElementById('mobileButtons').style.display = "block";
    setupScene();
    vr.animate();
    vr.mobileVR(); // Launch Mobile VR
}


document.getElementById('ComputerVR').onclick = () => { // When Mobile VR button is pressed then
    document.getElementById('defaultButtons').style.display = "none";
    setupScene();
    vr.animate();
    vr.computerVR(); // Launch Computer VR
}



