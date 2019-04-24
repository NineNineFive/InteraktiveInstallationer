let objs = [];

class loadObj{
    constructor(modelName,texture){
        let loader = new THREE.OBJLoader2();
        loader.setModelName(modelName);
        this.modelName = modelName;
        if (texture !== null) {
            //texture = new THREE.ImageUtils.loadTexture("models/"+texture);
            var texture = new THREE.TextureLoader().load("models/"+texture);
            var material = new THREE.MeshBasicMaterial( { map: texture } );
        } else {
            texture = null;
        }

        function callbackOnLoad(event) {
            if(texture !== null){

                event.detail.loaderRootNode.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material.map = texture;
                    }
                });
            }
            objs.push(event.detail.loaderRootNode.children[0]);
        };

        function onLoadMtl(materials) {
            loader.setMaterials(materials);
            loader.load('models/' + modelName + '.obj', callbackOnLoad, null, null, null, false);
        };
        loader.loadMtl('models/' + modelName + '.mtl', null, onLoadMtl);
    }
}