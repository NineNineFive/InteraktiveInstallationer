
var game = new VR();


game.webgl();
document.getElementById('MobileVR').onclick = () => {
    document.getElementById('defaultButtons').style.display = "none";
    document.getElementById('mobileButtons').style.display = "block";


    game.mobileVR();
    game.animate();
}


document.getElementById('ComputerVR').onclick = function() {
    document.getElementById('defaultButtons').style.display = "none";
    //game.webgl();
    game.computerVR();
    //game.init();
    game.animate();

}
