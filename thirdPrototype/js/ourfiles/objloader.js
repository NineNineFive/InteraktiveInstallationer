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


var objref;
console.log("testtt");
    class OBJLoading {
        constructor(modelName) {
            var modelName = modelName;
            var obj = new THREE.OBJLoader2();

            var callbackOnLoad = function ( event ) {
                objref = event.detail.loaderRootNode;
                game.scene.add(objref);

                objref.position.x = 0;
                objref.position.y = 0;
                objref.position.z = -5;
                //objref.rotation.z = 80;
                objref.scale.x = 0.5;
                objref.scale.y = 0.5;
                objref.scale.z = 0.5;


                //objref.rotateX(300);
                //objref.scale = new THREE.Vector3(0.1,0.1,0.1);

            };

            var onLoadMtl = function ( materials ) {
                obj.setModelName(modelName);
                obj.setMaterials( materials );
                obj.load('models/'+modelName+'.obj', callbackOnLoad, null, null, null, false );
            };
            obj.loadMtl('models/'+modelName+'.mtl', null, onLoadMtl );
        }
    };

    //var canvas = document.getElementById( 'webgl-canvas' );




