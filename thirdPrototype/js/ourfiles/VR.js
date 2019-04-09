
class VR{
    constructor(){
        this.renderer = this.scene = this.camera = this.canvas = this.loader = this.material = this.reticle = this.polyfill =
        this.boxWidth = this.geometry = this.container = this.raycaster = this.light = this.room = this.INTERSECTED =
        this.crosshair = this.obj = this.lastRender = this.cube = this.controls = this.effect = null;


        //var clock = new THREE.Clock();
        //var cube;
        //var vrDisplay, controls;
        //var effect;
        //var canvas;
        //var scene;
        //var renderer;
        //var camera;
        //var reticle;
        //var polyfill;
        //var boxWidth;
        //var geometry;
        //var material;
        //var loader;
        //var container;
        //var raycaster;
        //var room;
        //var isMouseDown = false;

        this.INTERSECTED= null;

        //var crosshair;


        this.clock = new THREE.Clock();

        this.isMouseDown = false;
        this.config = true;



    }


    webgl(){

        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setPixelRatio(Math.floor(window.devicePixelRatio));

        // Append the canvas element created by the renderer to document body element.
        this.canvas = this.renderer.domElement;
        document.body.appendChild(this.canvas);

        // Create a three.js scene.
        this.scene = new THREE.Scene();
        //this.scene.background = new THREE.Color(0x00ffa1);
        this.scene.background = new THREE.Color( 0x505050 );
        // Create a three.js camera.
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);


        // Chess obj
        this.obj = new OBJLoading('King');

        // Create a reticle
        //this.reticle = new THREE.Mesh(
        //    new THREE.RingBufferGeometry(0.005, 0.01, 15),
        //    new THREE.MeshBasicMaterial({ color: 0xffffff })
        //);
        //this.reticle.position.z = -0.5;
        this.scene.add(this.camera);
        //this.camera.add(this.reticle);

        this.light = new THREE.DirectionalLight( 0xffffff );
        this.light.position.set( 1, 1, 1 ).normalize();
        this.scene.add( this.light );

        //scene = new THREE.Scene();
        //scene.background = new THREE.Color( 0x505050 );

        //camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 200 );
        //scene.add(camera);

        this.crosshair = new THREE.Mesh(
            new THREE.RingBufferGeometry( 0.02, 0.04, 32 ),
            new THREE.MeshBasicMaterial( {
                color: 0xffffff,
                opacity: 0.5,
                transparent: true
            } )
        );

        this.crosshair.position.z = - 2;
        this.camera.add(this.crosshair);

        this.room = new THREE.LineSegments(
            //new THREE.BoxLineGeometry(60, 60, 60, 100, 100, 100 ),
            //new THREE.BoxLineGeometry(),
            //new THREE.LineBasicMaterial( { color: 0x808080 } )
        );
        this.room.position.y = 3;
        this.scene.add(this.room);

        this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
        this.scene.add( light );

        var geometry = new THREE.BoxBufferGeometry( 0.15, 0.15, 0.15 );
        //var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );

        for ( var i = 0; i < 200; i ++ ) {

            var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

            object.position.x = Math.random() * 4 - 2;
            object.position.y = Math.random() * 4 - 2;
            object.position.z = Math.random() * 4 - 2;

            object.rotation.x = Math.random() * 2 * Math.PI;
            object.rotation.y = Math.random() * 2 * Math.PI;
            object.rotation.z = Math.random() * 2 * Math.PI;

            object.scale.x = Math.random() + 0.5;
            object.scale.y = Math.random() + 0.5;
            object.scale.z = Math.random() + 0.5;

            object.userData.velocity = new THREE.Vector3();
            object.userData.velocity.x = Math.random() * 0.01 - 0.005;
            object.userData.velocity.y = Math.random() * 0.01 - 0.005;
            object.userData.velocity.z = Math.random() * 0.01 - 0.005;

            this.room.add( object );

        }

        // Add a repeating grid as a skybox.
        this.boxWidth = 5;

        // Create 3D objects.
        this.geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        this.material = new THREE.MeshNormalMaterial();
        this.cube = new THREE.Mesh(this.geometry, this.material);

        // Position cube
        this.cube.position.z = -1;

        // Add cube mesh to your three.js scene
        this.scene.add(this.cube);

        // Load the skybox texture and cube
        this.loader = new THREE.TextureLoader();
        this.loader.load('img/box.png', this.onTextureLoaded);

        this.raycaster = new THREE.Raycaster();
    }

    mobileVR(){
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        });

        this.polyfill = new WebVRPolyfill(this.config);




        // Apply VR stereo rendering to renderer.
        this.effect = new THREE.VREffect(this.renderer);
        this.effect.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);



        // The polyfill provides this in the event this browser
        // does not support WebVR 1.1
        var instance = this;
        navigator.getVRDisplays().then(function (vrDisplays) {
            if(vrDisplays.length){
                // If we have a native display, or we have a CardboardVRDisplay
                // from the polyfill, use it
                instance.vrDisplay = vrDisplays[0];

                // Apply VR headset positional data to camera.
                instance.controls = new THREE.VRControls(instance.camera);


                // Kick off the render loop.
                instance.vrDisplay.requestAnimationFrame(mobileAnimate);
            }
            // Otherwise, we're on a desktop environment with no native
            // displays, so provide controls for a monoscopic desktop view
            //else {

            //}
        });
        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.target.set(0, 0, -1);

        // Disable the "Enter VR" button
        var enterVRButton = document.querySelector('#vr');
        enterVRButton.disabled = true;

        // Kick off the render loop.
        requestAnimationFrame(mobileAnimate);



        document.querySelector('button#fullscreen').addEventListener('click', function() {
            instance.enterFullscreen(this.renderer.domElement);
        });
        document.querySelector('button#vr').addEventListener('click', function() {
            instance.vrDisplay.requestPresent([{source: this.renderer.domElement}]);
        });


        // Resize the WebGL canvas when we resize and also when we change modes.
        window.addEventListener('resize', () => { instance.onResize(); } );
        window.addEventListener('vrdisplaypresentchange', () => { instance.mobileOnVRDisplayPresentChange(); } );

    }

    computerVR (){

        var instance = this;


        this.canvas = this.renderer.domElement;
        document.body.appendChild(this.canvas);
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.vr.enabled = true;

        this.canvas.addEventListener( 'mousedown', ()=> instance.onMouseDown , false );
        this.canvas.addEventListener( 'mouseup', ()=> instance.onMouseUp , false );
        this.canvas.addEventListener( 'touchstart', ()=> instance.onMouseDown , false );
        this.canvas.addEventListener( 'touchend', ()=> instance.onMouseUp , false );

        window.addEventListener( 'resize', ()=> instance.onWindowResize, false );

        window.addEventListener( 'vrdisplaypointerrestricted', ()=> instance.onPointerRestricted, false );
        window.addEventListener( 'vrdisplaypointerunrestricted', ()=> instance.onPointerUnrestricted, false );

        document.body.appendChild( WEBVR.createButton( this.renderer ) );
        console.log("testt");
    }

    onMouseDown() {
console.log("testt");
        this.isMouseDown = true;

    }

    onMouseUp() {

        this.isMouseDown = false;

    }

    onPointerRestricted() {

        var pointerLockElement = renderer.domElement;
        if ( pointerLockElement && typeof ( pointerLockElement.requestPointerLock ) === 'function' ) {

            pointerLockElement.requestPointerLock();

        }

    }

    onPointerUnrestricted() {

        var currentPointerLockElement = document.pointerLockElement;
        var expectedPointerLockElement = renderer.domElement;
        if ( currentPointerLockElement && currentPointerLockElement === expectedPointerLockElement && typeof ( document.exitPointerLock ) === 'function' ) {

            document.exitPointerLock();

        }

    }

    onWindowResize() {
        console.log("testt");
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );

    }

//

    animate() {
        var instance = this;
        this.renderer.setAnimationLoop( () => { instance.PCRender(); } );

    }

    PCRender() {
        var delta = this.clock.getDelta() * 60;

        if ( this.isMouseDown === true ) {

            var cube = room.children[ 0 ];
            this.room.remove( cube );

            cube.position.set( 0, 0, - 0.75 );
            cube.position.applyQuaternion( this.camera.quaternion );
            cube.userData.velocity.x = ( Math.random() - 0.5 ) * 0.02 * delta;
            cube.userData.velocity.y = ( Math.random() - 0.5 ) * 0.02 * delta;
            cube.userData.velocity.z = ( Math.random() * 0.01 - 0.05 ) * delta;
            cube.userData.velocity.applyQuaternion( camera.quaternion );
            this.room.add( cube );

        }

        // find intersections

        this.raycaster.setFromCamera( { x: 0, y: 0 }, this.camera );

        var intersects = this.raycaster.intersectObjects( this.room.children );

        if ( intersects.length > 0 ) {

            if ( this.INTERSECTED != intersects[ 0 ].object ) {

                if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );

                this.INTERSECTED = intersects[ 0 ].object;
                this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
                this.INTERSECTED.material.emissive.setHex( 0xff0000 );

            }

        } else {

            if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );

            this.INTERSECTED = undefined;

        }

        // Keep cubes inside room

        for ( var i = 0; i < this.room.children.length; i ++ ) {

            var cube = this.room.children[ i ];

            cube.userData.velocity.multiplyScalar( 1 - ( 0.001 * delta ) );

            cube.position.add( cube.userData.velocity );

            if ( cube.position.x < - 3 || cube.position.x > 3 ) {

                cube.position.x = THREE.Math.clamp( cube.position.x, - 3, 3 );
                cube.userData.velocity.x = - cube.userData.velocity.x;

            }

            if ( cube.position.y < - 3 || cube.position.y > 3 ) {

                cube.position.y = THREE.Math.clamp( cube.position.y, - 3, 3 );
                cube.userData.velocity.y = - cube.userData.velocity.y;

            }

            if ( cube.position.z < - 3 || cube.position.z > 3 ) {

                cube.position.z = THREE.Math.clamp( cube.position.z, - 3, 3 );
                cube.userData.velocity.z = - cube.userData.velocity.z;

            }

            cube.rotation.x += cube.userData.velocity.x * 2 * delta;
            cube.rotation.y += cube.userData.velocity.y * 2 * delta;
            cube.rotation.z += cube.userData.velocity.z * 2 * delta;

        }




        this.renderer.render( this.scene, this.camera );

    }


    onTextureLoaded(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(this.boxWidth, this.boxWidth);
        this.geometry = new THREE.BoxGeometry(this.boxWidth, this.boxWidth, this.boxWidth);

        this.material = new THREE.MeshBasicMaterial({
            map: texture,
            color: 0x01BE00,
            side: THREE.BackSide
        });
        this.skybox = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.skybox);
    }

    // The delay ensures the browser has a chance to layout
    // the page and update the clientWidth/clientHeight.
    // This problem particularly crops up under iOS.


    onResize() {
        this.effect.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
    }

    mobileOnVRDisplayPresentChange() {
        this.onResize();
        document.getElementById('mobileButtons').hidden = this.vrDisplay.isPresenting;
    }



    enterFullscreen (el) {
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

}




function mobileAnimate(timestamp){
    var delta = Math.min(timestamp - game.lastRender, 500);
    game.lastRender = timestamp;

    // Apply rotation to cube mesh
    game.cube.rotation.y += delta * 0.0002;

    // Update VR headset position and apply to camera.
    game.controls.update();

    // Render the scene.
    game.effect.render(game.scene, game.camera);

    // Keep looping; if using a VRDisplay, call its requestAnimationFrame,
    // otherwise call window.requestAnimationFrame.
    if (game.vrDisplay) {
        game.vrDisplay.requestAnimationFrame(mobileAnimate);
    } else {
        requestAnimationFrame(mobileAnimate);
    }
}



var game = new VR();


/*
var clock = new THREE.Clock();
var cube;
var vrDisplay, controls;
var effect;
var canvas;
var scene;
var renderer;
var camera;
var reticle;
var polyfill;
var boxWidth;
var geometry;
var material;
var loader;
var container;
var raycaster;
var room;
var isMouseDown = false;
var INTERSECTED;
var crosshair;

var config = true;
*/

/*
function detectmob() {
    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ){
        console.log("ja ");
        return true;
    }
    else {
        console.log("nej ");
        return false;
    }
}
*/



document.getElementById('MobileVR').onclick = () => {
    document.getElementById('defaultButtons').style.display = "none";
    document.getElementById('mobileButtons').style.display = "block";

    game.webgl();
    game.mobileVR();
    game.animate();
}


document.getElementById('ComputerVR').onclick = function() {
    document.getElementById('defaultButtons').style.display = "none";
    game.webgl();
    game.computerVR();
    //game.init();
    game.animate();

}


/*
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x505050 );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 200 );
    scene.add(camera);

    crosshair = new THREE.Mesh(
        new THREE.RingBufferGeometry( 0.02, 0.04, 32 ),
        new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            opacity: 0.5,
            transparent: true
        } )
    );

    crosshair.position.z = - 2;
    camera.add(crosshair);

    room = new THREE.LineSegments(
        //new THREE.BoxLineGeometry(60, 60, 60, 100, 100, 100 ),
        //new THREE.BoxLineGeometry(),
        //new THREE.LineBasicMaterial( { color: 0x808080 } )
    );
    room.position.y = 3;
    scene.add(room);

    scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 ).normalize();
    scene.add( light );

    var geometry = new THREE.BoxBufferGeometry( 0.15, 0.15, 0.15 );
    //var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );

    for ( var i = 0; i < 200; i ++ ) {

        var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

        object.position.x = Math.random() * 4 - 2;
        object.position.y = Math.random() * 4 - 2;
        object.position.z = Math.random() * 4 - 2;

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

        object.scale.x = Math.random() + 0.5;
        object.scale.y = Math.random() + 0.5;
        object.scale.z = Math.random() + 0.5;

        object.userData.velocity = new THREE.Vector3();
        object.userData.velocity.x = Math.random() * 0.01 - 0.005;
        object.userData.velocity.y = Math.random() * 0.01 - 0.005;
        object.userData.velocity.z = Math.random() * 0.01 - 0.005;

        room.add( object );

    }
*/
/*
    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.vr.enabled = true;
    container.appendChild( renderer.domElement );

    renderer.domElement.addEventListener( 'mousedown', onMouseDown, false );
    renderer.domElement.addEventListener( 'mouseup', onMouseUp, false );
    renderer.domElement.addEventListener( 'touchstart', onMouseDown, false );
    renderer.domElement.addEventListener( 'touchend', onMouseUp, false );

    window.addEventListener( 'resize', onWindowResize, false );

    window.addEventListener( 'vrdisplaypointerrestricted', onPointerRestricted, false );
    window.addEventListener( 'vrdisplaypointerunrestricted', onPointerUnrestricted, false );

    document.body.appendChild( WEBVR.createButton( renderer ) );
    */

//}
    /*
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> webgl - interactive cubes';
    container.appendChild( info );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x505050 );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 200 );
    //camera = new THREE.PerspectiveCamera( 200, window.innerWidth / window.innerHeight, 0.1, 100 );

    scene.add(camera);

    crosshair = new THREE.Mesh(
        new THREE.RingBufferGeometry( 0.02, 0.04, 32 ),
        new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            opacity: 0.5,
            transparent: true
        } )
    );
    crosshair.position.z = - 2;
    camera.add(crosshair);

    room = new THREE.LineSegments(
        //new THREE.BoxLineGeometry(60, 60, 60, 100, 100, 100 ),
        //new THREE.BoxLineGeometry(),
        //new THREE.LineBasicMaterial( { color: 0x808080 } )
    );
    room.position.y = 3;
    scene.add(room);

    scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 ).normalize();
    scene.add( light );

    var geometry = new THREE.BoxBufferGeometry( 0.15, 0.15, 0.15 );
    //var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );





    for ( var i = 0; i < 200; i ++ ) {

        var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

        object.position.x = Math.random() * 4 - 2;
        object.position.y = Math.random() * 4 - 2;
        object.position.z = Math.random() * 4 - 2;

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

        object.scale.x = Math.random() + 0.5;
        object.scale.y = Math.random() + 0.5;
        object.scale.z = Math.random() + 0.5;

        object.userData.velocity = new THREE.Vector3();
        object.userData.velocity.x = Math.random() * 0.01 - 0.005;
        object.userData.velocity.y = Math.random() * 0.01 - 0.005;
        object.userData.velocity.z = Math.random() * 0.01 - 0.005;

        room.add( object );

    }


    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.vr.enabled = true;
    container.appendChild( renderer.domElement );

    renderer.domElement.addEventListener( 'mousedown', onMouseDown, false );
    renderer.domElement.addEventListener( 'mouseup', onMouseUp, false );
    renderer.domElement.addEventListener( 'touchstart', onMouseDown, false );
    renderer.domElement.addEventListener( 'touchend', onMouseUp, false );

    window.addEventListener( 'resize', onWindowResize, false );

    window.addEventListener( 'vrdisplaypointerrestricted', onPointerRestricted, false );
    window.addEventListener( 'vrdisplaypointerunrestricted', onPointerUnrestricted, false );

    document.body.appendChild( WEBVR.createButton( renderer ) );

}

function onMouseDown() {

    isMouseDown = true;

}

function onMouseUp() {

    isMouseDown = false;

}

function onPointerRestricted() {

    var pointerLockElement = renderer.domElement;
    if ( pointerLockElement && typeof ( pointerLockElement.requestPointerLock ) === 'function' ) {

        pointerLockElement.requestPointerLock();

    }

}

function onPointerUnrestricted() {

    var currentPointerLockElement = document.pointerLockElement;
    var expectedPointerLockElement = renderer.domElement;
    if ( currentPointerLockElement && currentPointerLockElement === expectedPointerLockElement && typeof ( document.exitPointerLock ) === 'function' ) {

        document.exitPointerLock();

    }

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    renderer.setAnimationLoop( PCRender );

}

function PCRender() {

    var delta = clock.getDelta() * 60;

    if ( isMouseDown === true ) {

        var cube = room.children[ 0 ];
        room.remove( cube );

        cube.position.set( 0, 0, - 0.75 );
        cube.position.applyQuaternion( camera.quaternion );
        cube.userData.velocity.x = ( Math.random() - 0.5 ) * 0.02 * delta;
        cube.userData.velocity.y = ( Math.random() - 0.5 ) * 0.02 * delta;
        cube.userData.velocity.z = ( Math.random() * 0.01 - 0.05 ) * delta;
        cube.userData.velocity.applyQuaternion( camera.quaternion );
        room.add( cube );

    }

    // find intersections

    raycaster.setFromCamera( { x: 0, y: 0 }, camera );

    var intersects = raycaster.intersectObjects( room.children );

    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );

        }

    } else {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = undefined;

    }

    // Keep cubes inside room

    for ( var i = 0; i < room.children.length; i ++ ) {

        var cube = room.children[ i ];

        cube.userData.velocity.multiplyScalar( 1 - ( 0.001 * delta ) );

        cube.position.add( cube.userData.velocity );

        if ( cube.position.x < - 3 || cube.position.x > 3 ) {

            cube.position.x = THREE.Math.clamp( cube.position.x, - 3, 3 );
            cube.userData.velocity.x = - cube.userData.velocity.x;

        }

        if ( cube.position.y < - 3 || cube.position.y > 3 ) {

            cube.position.y = THREE.Math.clamp( cube.position.y, - 3, 3 );
            cube.userData.velocity.y = - cube.userData.velocity.y;

        }

        if ( cube.position.z < - 3 || cube.position.z > 3 ) {

            cube.position.z = THREE.Math.clamp( cube.position.z, - 3, 3 );
            cube.userData.velocity.z = - cube.userData.velocity.z;

        }

        cube.rotation.x += cube.userData.velocity.x * 2 * delta;
        cube.rotation.y += cube.userData.velocity.y * 2 * delta;
        cube.rotation.z += cube.userData.velocity.z * 2 * delta;

    }




    renderer.render( scene, camera );

}

*/
