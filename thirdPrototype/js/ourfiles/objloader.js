/*
class OBJLoading {
    constructor(modelName) {
        var callbackOnLoad = function ( event ) {
            let objref = event.detail.loaderRootNode;
            //objref.rotateX(60);
            //objref.scale = new THREE.Vector3(0.1,0.1,0.1);
            scene.add(objref);
        };
        var obj = new THREE.OBJLoader2();
        obj.load("models/"+modelName+'.obj',callbackOnLoad,null,null,null,false);
    }
};

*/




    class OBJLoading {
        constructor(modelName) {
            var modelName = modelName;
            var obj = new THREE.OBJLoader2();
            var objref;

            var callbackOnLoad = function ( event ) {
                objref = event.detail.loaderRootNode;
                scene.add(objref);
                //objref.rotateX(60);
                //objref.scale = new THREE.Vector3(0.1,0.1,0.1);
            };

            var onLoadMtl = function ( materials ) {
                obj.setModelName( 'chess-pieces' );
                obj.setMaterials( materials );
                obj.load(modelName+'.obj', callbackOnLoad, null, null, null, false );
            };
            obj.loadMtl(modelName+'.mtl', null, onLoadMtl );
        }
    };

    var canvas = document.getElementById( 'webgl-canvas' );




