
/* This entire block in only to facilitate dynamically enabling and
disabling the WebVR polyfill, and is not necessary for most WebVR apps.
    If you want to use the polyfill in your app, just include the js file and
everything will work the way you want it to by default. */
// Dynamically turn the polyfill on if requested by the query args.
if (WGLUUrl.getBool('polyfill', false)) {
    var polyfill = new WebVRPolyfill({
        // Ensures the polyfill is always active on mobile, due to providing
        // a polyfilled CardboardVRDisplay when no native API is available,
        // and also polyfilling even when the native API is available, due to
        // providing a CardboardVRDisplay when no native VRDisplays exist.
        PROVIDE_MOBILE_VRDISPLAY: true,
        // Polyfill optimizations
        DIRTY_SUBMIT_FRAME_BINDINGS: true,
        BUFFER_SCALE: 0.75,
    });
}