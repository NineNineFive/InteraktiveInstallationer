/***
 * Copyright Lars Morten Bek 2019
 ***/
class VR{
    constructor(){
        this.renderer = this.scene = this.camera = this.canvas = this.loader = this.material = this.reticle = this.polyfill =
        this.boxWidth = this.geometry = this.container = this.raycaster = this.light = this.room = this.INTERSECTED =
        this.crosshair = this.obj = this.lastRender = this.cube = this.controls = this.effect = null;
        this.INTERSECTED= null;
        this.intersectionID = null;
        this.clock = new THREE.Clock();
        this.config = true;
        this.objects = [];
        this.selectedObj = null;
    }

    commandIntersectedObj(command){
        if(this.selectedObj===null){
            // if Selecting object
            var delta = this.clock.getDelta() * 60;
            // find intersections
            this.raycaster.setFromCamera( { x: 0, y: 0 }, this.camera );
            if(this.group.children!=null) {
                var intersects = this.raycaster.intersectObjects(this.group.children, true);
            }
            if ( intersects!=null && intersects.length > 0 ) {
                if ( this.INTERSECTED != intersects[ 0 ] ) {
                    this.INTERSECTED = intersects[ 0 ].object;
                    for(let i = 0; i < objs.length; i++){
                        if (objs[i].uuid == this.INTERSECTED.uuid){
                            if(command==="select"){
                                this.selectedObj = objs[i];


                                if(objs[i].material.length>1){
                                    for(let j=0; j<objs[i].material.length; j++){
                                        objs[i].material[j].selectColor = {r:0.4,g:1,b:0.4};
                                        objs[i].material[j].color = objs[i].material[j].selectColor;
                                        if(objs[i].material[j].realColor!==undefined){
                                            objs[i].material[j].unselectColor = objs[i].material[j].realColor;
                                        } else {
                                            objs[i].material[j].unselectColor = objs[i].material[j].color;
                                        }
                                    }
                                } else {
                                    objs[i].material.selectColor = {r:0.4,g:1,b:0.4};
                                    objs[i].material.color = objs[i].material.selectColor;
                                    if(objs[i].material.realColor!==undefined){
                                        objs[i].material.unselectColor = objs[i].material.realColor;
                                    } else {
                                        objs[i].material.unselectColor = objs[i].material.color;
                                    }
                                }
                                console.log("select");
                            }
                        }
                    }
                }
            } else {
                this.INTERSECTED = undefined;
            }
        }
        // If already selected
        if(this.selectedObj!==null) {
            switch (command) {
                case "remove":
                    this.group.remove(this.selectedObj);
                    this.selectedObj = null;
                    console.log("remove");
                    break;
                case "move":
                    // find intersections
                    var intersect2 = null;
                    this.raycaster.setFromCamera( { x: 0, y: 0 }, this.camera );
                    if(this.scene.children!=null) {
                        var intersects = this.raycaster.intersectObjects(this.scene.children, true);
                    }
                    if ( intersects!=null && intersects.length > 0 ) {
                        if ( intersect2 != intersects[ 0 ] ) {
                            var intersect2 = intersects[ 0 ];
                                console.log(intersect2);
                            this.selectedObj.position.x = intersect2.point.x;
                            this.selectedObj.position.z = intersect2.point.z;

                        }
                    } else {
                        intersect2 = undefined;
                    }
                    console.log("move");
                    break;
                case "cancel":
                    this.selectedObj.material.selectColor = undefined;
                    if(this.selectedObj.material.length>1) {
                        for (let i = 0; i < this.selectedObj.material.length; i++) {
                            this.selectedObj.material[i].color = this.selectedObj.material[i].unselectColor;
                        }
                    } else {
                        this.selectedObj.material.color = this.selectedObj.material.unselectColor;
                    }


                    this.selectedObj = null;
                    console.log("cancel");
                    break;
                case "take":


                    // find intersections
                    var intersect2 = null;
                    this.raycaster.setFromCamera( { x: 0, y: 0 }, this.camera );
                    if(this.group.children!=null) {
                        var intersects = this.raycaster.intersectObjects(this.group.children, true);
                    }
                    if ( intersects!=null && intersects.length > 0 ) {
                        if ( intersect2 != intersects[ 0 ] ) {
                            var intersect2 = intersects[ 0 ].object;
                            console.log(intersect2);
                            if(intersect2!==null) {
                                this.selectedObj.position.x = intersect2.position.x;
                                this.selectedObj.position.z = intersect2.position.z;
                                for (let i = 0; i < objs.length; i++) {
                                    if (objs[i].uuid === intersect2.uuid) {
                                        if(intersect2.uuid !== this.selectedObj.uuid)
                                        {
                                            this.group.remove(intersect2);
                                        }

                                    }
                                }
                            }
                        }
                    } else {
                        intersect2 = undefined;
                    }



                    console.log("take");
                    break;
            }
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

        this.scene.background = new THREE.Color( 0x202020 );
        // Create a three.js camera.
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 0;

        // Chess obj

        this.scene.add(this.camera);

        this.light = new THREE.DirectionalLight( 0xEEEEEE, 0.2); // color of light and intensity
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

        this.crosshair.position.z = this.camera.position.z - 2;
        this.camera.add(this.crosshair);

        this.scene.add( new THREE.HemisphereLight( 0xFAFAFA, 0xDDDDDD ) );

        this.group = new THREE.Group();
        this.scene.add(this.group);


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
        //var enterVRButton = document.querySelector('#vr');
        //enterVRButton.disabled = true;

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
        // Should be fixed with changing "vr" to "this" in future
        vr.camera.aspect = window.innerWidth / window.innerHeight;
        vr.camera.updateProjectionMatrix();
        vr.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    animate() {
        var instance = this;
        this.renderer.setAnimationLoop( () => { instance.render(); } );
    }

    render() {
        var delta = this.clock.getDelta() * 60;
        // find intersections
        this.raycaster.setFromCamera( { x: 0, y: 0 }, this.camera );
        if(this.group.children!=null) {
            var intersects = this.raycaster.intersectObjects(this.group.children, true);
        }



            if (intersects != null && intersects.length > 0) {

                if (this.INTERSECTED != intersects[0]) {

                        if (this.INTERSECTED) {
                            if(this.selectedObj===null||this.INTERSECTED.uuid!==this.selectedObj.uuid) {
                                if (this.INTERSECTED.material.length > 1) {
                                    for (let i = 0; i < this.INTERSECTED.material.length; i++) {
                                        if (this.INTERSECTED.material[i].realColor !== undefined) {
                                            this.INTERSECTED.material[i].color = this.INTERSECTED.material[i].realColor;
                                            this.INTERSECTED.material[i].realColor = undefined;
                                        }
                                    }
                                } else {
                                    if (this.INTERSECTED.material.realColor !== undefined) {
                                        this.INTERSECTED.material.color = this.INTERSECTED.material.realColor;

                                        this.INTERSECTED.material.realColor = undefined;
                                    }
                                }
                            }
                        }
                        this.INTERSECTED = intersects[0].object;
                        this.intersectionID = this.INTERSECTED.uuid;
                    if(this.selectedObj===null||this.INTERSECTED.uuid!==this.selectedObj.uuid) {
                        if (this.INTERSECTED.material.length > 1) {
                            for (let i = 0; i < this.INTERSECTED.material.length; i++) {
                                if (this.INTERSECTED.material[i].realColor === undefined) {
                                    this.INTERSECTED.material[i].realColor = this.INTERSECTED.material[i].color;
                                    this.INTERSECTED.material[i].color = {r: 1, g: 0, b: 0}; // VERY REED!!!
                                }
                            }
                        } else {

                            if (this.INTERSECTED.material.realColor === undefined) {
                                    this.INTERSECTED.material.realColor = this.INTERSECTED.material.color;
                                    this.INTERSECTED.material.color = {r: 1, g: 0, b: 0}; // VERY REED!!!

                            }
                        }
                    }
                }


            } else {

                if (this.INTERSECTED) {
                    if(this.selectedObj===null||this.INTERSECTED.uuid!==this.selectedObj.uuid) {
                        if (this.INTERSECTED.material.length > 1) {
                            for (let i = 0; i < this.INTERSECTED.material.length; i++) {
                                if (this.INTERSECTED.material[i].realColor !== undefined) {
                                    this.INTERSECTED.material[i].color = this.INTERSECTED.material[i].realColor;
                                    this.INTERSECTED.material[i].realColor = undefined;
                                }
                            }
                        } else {
                            if (this.INTERSECTED.material.realColor !== undefined) {
                                this.INTERSECTED.material.color = this.INTERSECTED.material.realColor;
                                this.INTERSECTED.material.realColor = undefined;
                            }
                        }
                    }
                }
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
    // Try to fiddle with this script and see what it truly does

    var delta = Math.min(timestamp - vr.lastRender, 500);
    vr.lastRender = timestamp;

    // Apply rotation to cube mesh
    //vr.cube.rotation.y += delta * 0.0002;

    // Update VR headset position and apply to camera.
    vr.controls.update();

    // Render the scene.
    vr.effect.render(vr.scene, vr.camera);

    // Keep looping; if using a VRDisplay, call its requestAnimationFrame,
    // otherwise call window.requestAnimationFrame.
    if (vr.vrDisplay) {
        vr.vrDisplay.requestAnimationFrame(mobileAnimate);
    } else {
        requestAnimationFrame(mobileAnimate);
    }

}

