// Get config from URL
var config = (function() {
    var config = {};
    var q = window.location.search.substring(1);
    if (q === '') {
        return config;
    }
    var params = q.split('&');
    var param, name, value;
    for (var i = 0; i < params.length; i++) {
        param = params[i].split('=');
        name = param[0];
        value = param[1];

        // All config values are either boolean or float
        config[name] = value === 'true' ? true :
            value === 'false' ? false :
                parseFloat(value);
    }
    return config;
})();

var polyfill = new WebVRPolyfill(config);

console.log("Using webvr-polyfill version " + WebVRPolyfill.version +
    " with configuration: " + JSON.stringify(config));
var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(Math.floor(window.devicePixelRatio));

// Append the canvas element created by the renderer to document body element.
var canvas = renderer.domElement;
document.body.appendChild(canvas);

// Create a three.js scene.
var scene = new THREE.Scene();

// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

// Create a reticle
var reticle = new THREE.Mesh(
    new THREE.RingBufferGeometry(0.005, 0.01, 15),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
);
reticle.position.z = -0.5;
camera.add(reticle);
scene.add(camera);

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(canvas.clientWidth, canvas.clientHeight, false);

var vrDisplay, controls;

// Add a repeating grid as a skybox.
var boxWidth = 1;

// Create 3D objects.
var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(geometry, material);

// Position cube
cube.position.z = -1;

// Add cube mesh to your three.js scene
scene.add(cube);
console.log(scene);

// Load the skybox texture and cube

var loader = new THREE.TextureLoader();
loader.load('img/box.png', onTextureLoaded);
function onTextureLoaded(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(boxWidth, boxWidth);
    var geometry = new THREE.BoxGeometry(boxWidth, boxWidth, boxWidth);
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0x01BE00,
        side: THREE.BackSide
    });
    var skybox = new THREE.Mesh(geometry, material);
    scene.add(skybox);


}

// The polyfill provides this in the event this browser
// does not support WebVR 1.1
navigator.getVRDisplays().then(function (vrDisplays) {
    // If we have a native display, or we have a CardboardVRDisplay
    // from the polyfill, use it
    if (vrDisplays.length) {
        vrDisplay = vrDisplays[0];

        // Apply VR headset positional data to camera.
        controls = new THREE.VRControls(camera);

        // Kick off the render loop.
        vrDisplay.requestAnimationFrame(animate);
    }
    // Otherwise, we're on a desktop environment with no native
    // displays, so provide controls for a monoscopic desktop view
    else {
        controls = new THREE.OrbitControls(camera);
        controls.target.set(0, 0, -1);

        // Disable the "Enter VR" button
        var enterVRButton = document.querySelector('#vr');
        enterVRButton.disabled = true;

        // Kick off the render loop.
        requestAnimationFrame(animate);
    }
});

// Request animation frame loop function
var lastRender = 0;
function animate(timestamp) {
    var delta = Math.min(timestamp - lastRender, 500);
    lastRender = timestamp;

    // Apply rotation to cube mesh
    cube.rotation.y += delta * 0.0002;

    // Update VR headset position and apply to camera.
    controls.update();

    // Render the scene.
    effect.render(scene, camera);

    // Keep looping; if using a VRDisplay, call its requestAnimationFrame,
    // otherwise call window.requestAnimationFrame.
    if (vrDisplay) {
        vrDisplay.requestAnimationFrame(animate);
    } else {
        requestAnimationFrame(animate);
    }
}

function onResize() {
    // The delay ensures the browser has a chance to layout
    // the page and update the clientWidth/clientHeight.
    // This problem particularly crops up under iOS.
    if (!onResize.resizeDelay) {
        onResize.resizeDelay = setTimeout(function () {
            onResize.resizeDelay = null;
            console.log('Resizing to %s x %s.', canvas.clientWidth, canvas.clientHeight);
            effect.setSize(canvas.clientWidth, canvas.clientHeight, false);
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }, 250);
    }
}

function onVRDisplayPresentChange() {
    console.log('onVRDisplayPresentChange');
    onResize();
    buttons.hidden = vrDisplay.isPresenting;
}

function onVRDisplayConnect(e) {
    console.log('onVRDisplayConnect', (e.display || (e.detail && e.detail.display)));
}

// Resize the WebGL canvas when we resize and also when we change modes.
window.addEventListener('resize', onResize);
window.addEventListener('vrdisplaypresentchange', onVRDisplayPresentChange);
window.addEventListener('vrdisplayconnect', onVRDisplayConnect);

// Button click handlers.
document.querySelector('button#fullscreen').addEventListener('click', function() {
    enterFullscreen(renderer.domElement);
});
document.querySelector('button#vr').addEventListener('click', function() {
    vrDisplay.requestPresent([{source: renderer.domElement}]);
});

function enterFullscreen (el) {
    if (el.requestFullscreen) {
        el.requestFullscreen();
    } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
    }
}