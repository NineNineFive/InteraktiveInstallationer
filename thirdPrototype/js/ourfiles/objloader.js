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


/*
    class OBJLoading {
        constructor(modelName) {
            this.modelName = modelName;
            this.obj = null;
            var objload = new THREE.OBJLoader2();
            var obj = null;


            var callbackOnLoad = function ( event ) {
                obj = event.detail.loaderRootNode;
                //game.scene.add(objref);




                game.addObj(obj);
                //objref.children[0].material.color = {r:1,g:0,b:0};


                //objref.rotateX(300);
                //objref.scale = new THREE.Vector3(0.1,0.1,0.1);
            };

            var onLoadMtl = function ( materials ) {
                objload.setModelName(modelName);
                objload.setMaterials( materials );
                objload.load('models/'+modelName+'.obj', callbackOnLoad, null, null, null, false );
            };
            objload.loadMtl('models/'+modelName+'.mtl', null, onLoadMtl );


        }
    };
*/

    //var canvas = document.getElementById( 'webgl-canvas' );




