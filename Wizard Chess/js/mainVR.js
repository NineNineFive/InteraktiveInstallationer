document.onreadystatechange = () => {

        if (document.readyState === "complete") {
            setTimeout(function () {
            /* global mat4, vec3, VRCubeIsland, WGLUDebugGeometry, WGLUStats, WGLUTextureLoader, VRSamplesUtil */
            (function () {
                "use strict";

                var PLAYER_HEIGHT = 1.65;

                var vrDisplay = null;
                var projectionMat = mat4.create();
                var viewMat = mat4.create();
                var poseMat = mat4.create();
                var tmpMat = mat4.create();
                var vrPresentButton = null;
                var orientation = [5, 0, 0, 1];
                var position = [20, 70, 0];

                // ===================================================
                // WebGL scene setup. This code is not WebVR specific.
                // ===================================================

                // WebGL setup.
                var gl = null;
                var cubeIsland = null;
                var stats = null;
                var debugGeom = null;

                function onContextLost( event ) {
                    event.preventDefault();
                    console.log( 'WebGL Context Lost.' );
                    gl = null;
                    cubeIsland = null;
                    stats = null;
                    debugGeom = null;
                }

                function onContextRestored( event ) {
                    console.log( 'WebGL Context Restored.' );
                    initWebGL(vrDisplay ? vrDisplay.capabilities.hasExternalDisplay : false);
                }

                var webglCanvas = document.getElementById("webgl-canvas");
                //var webglCanvas = document.getElementById("defaultCanvas0");
                console.log(webglCanvas);
                webglCanvas.addEventListener( 'webglcontextlost', onContextLost, false );
                webglCanvas.addEventListener( 'webglcontextrestored', onContextRestored, false );

                function initWebGL (preserveDrawingBuffer) {
                    var glAttribs = {
                        alpha: false,
                        // enable preserveDrawingBuffer to get updates on the external display too
                        preserveDrawingBuffer: preserveDrawingBuffer
                    };
                    var useWebgl2 = WGLUUrl.getBool('webgl2', false);
                    var contextTypes = useWebgl2 ? ["webgl2"] : ["webgl", "experimental-webgl"];
                    for (var i in contextTypes) {
                        gl = webglCanvas.getContext(contextTypes[i], glAttribs);
                        if (gl)
                            break;
                    }
                    if (!gl) {
                        var webglType = (useWebgl2 ? "WebGL 2" : "WebGL")
                        VRSamplesUtil.addError("Your browser does not support " + webglType + ".");
                        return;
                    }
                    // Make blue background
                    //gl.clearColor(0.1, 0.2, 0.3, 1.0);
                    gl.enable(gl.DEPTH_TEST);
                    gl.enable(gl.CULL_FACE);

                    var textureLoader = new WGLUTextureLoader(gl);
                    var texture = textureLoader.loadTexture("media/textures/cube-sea.png");

                    // Using cubeIsland for this sample because it's easier to see from a
                    // third person view.
                    cubeIsland = new VRCubeIsland(gl, texture, 2, 2);

                    var enablePerformanceMonitoring = WGLUUrl.getBool(
                        'enablePerformanceMonitoring', false);
                    stats = new WGLUStats(gl, enablePerformanceMonitoring);
                    debugGeom = new WGLUDebugGeometry(gl);

                    // Wait until we have a WebGL context to resize and start rendering.
                    window.addEventListener("resize", onResize, false);
                    onResize();
                    window.requestAnimationFrame(onAnimationFrame);
                }

                // ================================
                // WebVR-specific code begins here.
                // ================================

                function onVRRequestPresent () {
                    vrDisplay.requestPresent([{ source: webglCanvas }]).then(function () {
                    }, function (err) {
                        var errMsg = "requestPresent failed.";
                        if (err && err.message) {
                            errMsg += "<br/>" + err.message
                        }
                        VRSamplesUtil.addError(errMsg, 2000);
                    });
                }

                function onVRExitPresent () {
                    if (!vrDisplay.isPresenting)
                        return;

                    vrDisplay.exitPresent().then(function () {
                    }, function () {
                        VRSamplesUtil.addError("exitPresent failed.", 2000);
                    });
                }

                function onVRPresentChange () {
                    onResize();

                    if (vrDisplay.isPresenting) {
                        if (vrDisplay.capabilities.hasExternalDisplay) {
                            VRSamplesUtil.removeButton(vrPresentButton);
                            vrPresentButton = VRSamplesUtil.addButton("Exit VR", "E", "media/icons/cardboard64.png", onVRExitPresent);
                        }
                    } else {
                        if (vrDisplay.capabilities.hasExternalDisplay) {
                            VRSamplesUtil.removeButton(vrPresentButton);
                            vrPresentButton = VRSamplesUtil.addButton("Enter VR", "E", "media/icons/cardboard64.png", onVRRequestPresent);
                        }
                    }
                }

                var frameData;

                if (navigator.getVRDisplays) {
                    frameData = new VRFrameData();

                    navigator.getVRDisplays().then(function (displays) {
                        if (displays.length > 0) {
                            vrDisplay = displays[displays.length - 1];
                            vrDisplay.depthNear = 0.1;
                            vrDisplay.depthFar = 1024.0;

                            initWebGL(vrDisplay.capabilities.hasExternalDisplay);

                            if (vrDisplay.stageParameters &&
                                vrDisplay.stageParameters.sizeX > 0 &&
                                vrDisplay.stageParameters.sizeZ > 0) {
                                cubeIsland.resize(vrDisplay.stageParameters.sizeX, vrDisplay.stageParameters.sizeZ);
                            }

                            if (vrDisplay.capabilities.canPresent)
                                vrPresentButton = VRSamplesUtil.addButton("Enter VR", "E", "media/icons/cardboard64.png", onVRRequestPresent);

                            // For the benefit of automated testing. Safe to ignore.
                            if (vrDisplay.capabilities.canPresent && WGLUUrl.getBool('canvasClickPresents', false))
                                webglCanvas.addEventListener("click", onVRRequestPresent, false);

                            window.addEventListener('vrdisplaypresentchange', onVRPresentChange, false);
                            window.addEventListener('vrdisplayactivate', onVRRequestPresent, false);
                            window.addEventListener('vrdisplaydeactivate', onVRExitPresent, false);
                        } else {
                            initWebGL(false);
                            VRSamplesUtil.addInfo("WebVR supported, but no VRDisplays found.", 3000);
                        }
                    }, function () {
                        VRSamplesUtil.addError("Your browser does not support WebVR. See <a href='http://webvr.info'>webvr.info</a> for assistance.");
                    });
                } else if (navigator.getVRDevices) {
                    initWebGL(false);
                    VRSamplesUtil.addError("Your browser supports WebVR but not the latest version. See <a href='http://webvr.info'>webvr.info</a> for more info.");
                } else {
                    initWebGL(false);
                    VRSamplesUtil.addError("Your browser does not support WebVR. See <a href='http://webvr.info'>webvr.info</a> for assistance.");
                }

                function onResize () {
                    if (vrDisplay && vrDisplay.isPresenting) {
                        var leftEye = vrDisplay.getEyeParameters("left");
                        var rightEye = vrDisplay.getEyeParameters("right");

                        webglCanvas.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
                        webglCanvas.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);
                    } else {
                        webglCanvas.width = webglCanvas.offsetWidth * window.devicePixelRatio;
                        webglCanvas.height = webglCanvas.offsetHeight * window.devicePixelRatio;
                    }
                }

                function onClick () {
                    // Reset the background color to a random value
                    if (gl) {
                        gl.clearColor(
                            Math.random() * 0.5,
                            Math.random() * 0.5,
                            Math.random() * 0.5, 1.0);
                    }
                }

                // Register for mouse restricted events while in VR
                // (e.g. mouse no longer available on desktop 2D view)
                function onDisplayPointerRestricted() {
                    if (webglCanvas && webglCanvas.requestPointerLock) {
                        webglCanvas.requestPointerLock();
                    }
                }

                // Register for mouse unrestricted events while in VR
                // (e.g. mouse once again available on desktop 2D view)
                function onDisplayPointerUnrestricted() {
                    var lock = document.pointerLockElement;
                    if (lock && lock === webglCanvas && document.exitPointerLock) {
                        document.exitPointerLock();
                    }
                }

                VRSamplesUtil.addVRClickListener(onClick);
                webglCanvas.addEventListener("click", onClick, false);
                window.addEventListener('vrdisplaypointerrestricted', onDisplayPointerRestricted);
                window.addEventListener('vrdisplaypointerunrestricted', onDisplayPointerUnrestricted);

                function getStandingViewMatrix (out, view) {
                    if (vrDisplay.stageParameters) {
                        mat4.invert(out, vrDisplay.stageParameters.sittingToStandingTransform);
                        mat4.multiply(out, view, out);
                    } else {
                        mat4.identity(out);
                        mat4.translate(out, out, [0, PLAYER_HEIGHT, 0]);
                        mat4.invert(out, out);
                        mat4.multiply(out, view, out);
                    }
                }

                function getPoseMatrix (out, pose) {
                    orientation = pose.orientation;
                    position = pose.position;
                    if (!orientation) { orientation = [0, 0, 0, 1]; }
                    if (!position) { position = [0, 0, 0]; }

                    mat4.fromRotationTranslation(tmpMat, orientation, position);
                    mat4.invert(tmpMat, tmpMat);
                    getStandingViewMatrix(out, tmpMat);
                    mat4.invert(out, out);
                }

                function renderSceneThirdPersonView (pose) {
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
                    mat4.perspective(projectionMat, Math.PI*0.4, webglCanvas.width / webglCanvas.height, 0.1, 1024.0);

                    // Set up the camera in the back left corner of the island
                    mat4.identity(viewMat);
                    mat4.translate(viewMat, viewMat, [-2, 2.5, 2]);
                    mat4.rotateY(viewMat, viewMat, Math.PI * -0.25);
                    mat4.rotateX(viewMat, viewMat, Math.PI * -0.15);
                    mat4.invert(viewMat, viewMat);
                    cubeIsland.render(projectionMat, viewMat, stats);

                    // Render a debug view of the headset's position
                    if (pose) {
                        getPoseMatrix(poseMat, pose);
                        mat4.getTranslation(position, poseMat);
                        mat4.getRotation(orientation, poseMat);

                        debugGeom.bind(projectionMat, viewMat);
                        debugGeom.drawCube(orientation, position, 0.2, [0, 1, 0, 1]);
                    }

                    stats.renderOrtho();
                }

                function onAnimationFrame (t) {
                    // do not attempt to render if there is no available WebGL context
                    if (!gl || !stats || !cubeIsland || !debugGeom) {
                        return;
                    }

                    stats.begin();

                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                    if (vrDisplay) {
                        vrDisplay.requestAnimationFrame(onAnimationFrame);

                        vrDisplay.getFrameData(frameData);

                        if (vrDisplay.isPresenting) {
                            gl.viewport(0, 0, webglCanvas.width * 0.5, webglCanvas.height);
                            getStandingViewMatrix(viewMat, frameData.leftViewMatrix);
                            cubeIsland.render(frameData.leftProjectionMatrix, viewMat, stats);

                            gl.viewport(webglCanvas.width * 0.5, 0, webglCanvas.width * 0.5, webglCanvas.height);
                            getStandingViewMatrix(viewMat, frameData.rightViewMatrix);
                            cubeIsland.render(frameData.rightProjectionMatrix, viewMat, stats);

                            // VRDisplay.submitFrame
                            vrDisplay.submitFrame();

                            // If we have an external display we can render a different version
                            // of the scene entirely after calling submitFrame and it will be
                            // shown on the page. Depending on the content this can be expensive
                            // so this technique should only be used when it will not interfere
                            // with the performance of the VR rendering.
                            if (vrDisplay.capabilities.hasExternalDisplay) {
                                renderSceneThirdPersonView(frameData.pose);
                            }
                        } else {
                            gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
                            mat4.perspective(projectionMat, Math.PI*0.4, webglCanvas.width / webglCanvas.height, 0.1, 1024.0);
                            getStandingViewMatrix(viewMat, frameData.leftViewMatrix);
                            cubeIsland.render(projectionMat, viewMat, stats);
                        }
                    } else {
                        window.requestAnimationFrame(onAnimationFrame);

                        // No VRDisplay found.
                        renderSceneThirdPersonView(null);
                    }

                    stats.end();
                }
                //setup();
                //draw();
            })();
        }, 0);





                //var canvas = document.getElementById("webgl-canvas");
                //var ctx = canvas.getContext("webgl");
                //console.log(ctx);

    }
}