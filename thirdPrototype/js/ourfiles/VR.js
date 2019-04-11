/***
 * Copyright Lars Morten Bek 2019
 ***/
class VR{
    constructor(){
        this.renderer = this.scene = this.camera = this.canvas = this.loader = this.material = this.reticle = this.polyfill =
        this.boxWidth = this.geometry = this.container = this.raycaster = this.light = this.room = this.INTERSECTED =
        this.crosshair = this.obj = this.lastRender = this.cube = this.controls = this.effect = null;
        this.INTERSECTED= null;
        this.clock = new THREE.Clock();
        this.config = false; // dont know what this does yet

        this.loadObjects = [new OBJLoading('King'), new OBJLoading('Queen')];
        this.objects = [];
        console.log(this.objects);

    }

    addObj(obj){
        obj.castShadow = true;
        this.scene.add(obj);
        this.objects.push(obj);
        this.changeObjs();
    }

    changeObjs(){
        for(var i = 0; i < this.objects.length; i++){
            this.objects[i].position.x = (i*5);
            this.objects[i].position.y = 0;
            this.objects[i].position.z = -5;
            //objref.rotation.z = 80;
            this.objects[i].scale.x = 0.5;
            this.objects[i].scale.y = 0.5;
            this.objects[i].scale.z = 0.5;
        }
    }

    removeIntersectedObj(){
        var delta = this.clock.getDelta() * 60;

        // find intersections
        this.raycaster.setFromCamera( { x: 0, y: 0 }, this.camera );
        if(this.scene.children!=null) {
            var intersects = this.raycaster.intersectObjects(this.scene.children, true);
            console.log("true");
        }
        if ( intersects!=null && intersects.length > 0 ) {

            if ( this.INTERSECTED != intersects[ 0 ] ) {
                if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
                this.INTERSECTED = intersects[ 0 ].object;
                console.log(this.INTERSECTED);
                //this.scene.remove(this.INTERSECTED);

                //this.INTERSECTED.material.emissive.setHex( 0xff0000 );
            }
        } else {
            if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
            this.INTERSECTED = undefined;
        }
        this.renderer.render( this.scene, this.camera );
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


        this.scene.add(this.camera);

        this.light = new THREE.DirectionalLight( 0xffffff );
        this.light.position.set( 1, 1, 1 ).normalize();
        this.scene.add( this.light );

        this.crosshair = new THREE.Mesh(
            new THREE.RingBufferGeometry( 0.02, 0.04, 32 ),
            new THREE.MeshBasicMaterial( {
                color: 0x77FF77,
                opacity: 1,
                transparent: true
            } )
        );

        this.crosshair.position.z = - 2;
        this.camera.add(this.crosshair);

        this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
        this.scene.add( light );

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
            instance.enterFullscreen(instance.canvas);
        });
        document.querySelector('button#vr').addEventListener('click', function() {
            instance.vrDisplay.requestPresent([{source: instance.canvas}]);
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

        this.renderer.domElement.addEventListener( 'mousedown', instance.onMouseDown, false );
        this.renderer.domElement.addEventListener( 'mouseup', instance.onMouseUp, false );
        this.renderer.domElement.addEventListener( 'touchstart', instance.onMouseDown, false );
        this.renderer.domElement.addEventListener( 'touchend', instance.onMouseUp, false );

        window.addEventListener( 'resize', instance.onWindowResize, false );

        window.addEventListener( 'vrdisplaypointerrestricted', instance.onPointerRestricted, false );
        window.addEventListener( 'vrdisplaypointerunrestricted', instance.onPointerUnrestricted, false );

        document.body.appendChild( WEBVR.createButton( this.renderer ) );
    }

    onMouseDown() {
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
        // Should be fixed with changing "game" to "this" in future
        game.camera.aspect = window.innerWidth / window.innerHeight;
        game.camera.updateProjectionMatrix();
        game.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    animate() {
        var instance = this;
        this.renderer.setAnimationLoop( () => { instance.render(); } );
    }

    render() {
        var delta = this.clock.getDelta() * 60;

        // find intersections
        this.raycaster.setFromCamera( { x: 0, y: 0 }, this.camera );
        if(this.scene.children!=null) {
            var intersects = this.raycaster.intersectObjects(this.scene.children, true);
        }
        if ( intersects!=null && intersects.length > 0 ) {

            if ( this.INTERSECTED != intersects[ 0 ] ) {
                if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
                this.INTERSECTED = intersects[ 0 ].object;
                //this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
                //this.INTERSECTED.material.color = {r:1,g:0,b:0}; // VERY REED!!!
                this.INTERSECTED.material.emissive.setHex( 0xff0000 );
            }
        } else {
            if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
            this.INTERSECTED = undefined;
        }
        this.renderer.render( this.scene, this.camera );
    }

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
    console.log("mobileAnimate");

    // Try to fiddle with this script and see what it truly does

    var delta = Math.min(timestamp - game.lastRender, 500);
    game.lastRender = timestamp;

    // Apply rotation to cube mesh
    //game.cube.rotation.y += delta * 0.0002;

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

