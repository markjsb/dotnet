let scene, camera, renderer, rotor, blade, turbineL, turbineR, clouds, material, chopper;
let mouseX = 0,
    mouseY = 0;
let windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2;

let init = () => {
    //add detector to see if WebGL is supported
    if (!Detector.webgl) Detector.addGetWebGLMessage();
    //set up a scene
    scene = new THREE.Scene();
    //add a camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    //render the scene - start renderer and set it's size
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xcaf8f1, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //add to webpage
    document.body.appendChild(renderer.domElement);
    //load cloud texture
    let textureLoader = new THREE.TextureLoader();
    let cl = textureLoader.load("img/cloud.png");
    //create group for clouds
    clouds = new THREE.Group();
    //make cloud material
    material = new THREE.SpriteMaterial({
        map: cl,
        opacity: 0.7
    });
    //make 20 random clouds
    for (i = 0; i < 20; i++) {
        let x = 600 * Math.random() - 300;
        let y = 200 * Math.random() - 100;
        let z = 1200 * Math.random() - 600;
        sprite = new THREE.Sprite(material);
        sprite.position.set(x, y, z);
        sprite.scale.x = sprite.scale.y = sprite.scale.z = 100;
        //add to group
        clouds.add(sprite);
    }
    //add to scene
    scene.add(clouds);
    //load 3d model
    let loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('chopper.dae', function (collada) {
        let dae = collada.scene;
        dae.traverse(function (child) {
            //add shadows to all models
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        //scale by half
        dae.scale.x = dae.scale.y = dae.scale.z = 0.5;
        //rotate and position
        dae.rotation.y = Math.PI / 3;
        dae.position.x = 40;
        dae.updateMatrix();
        //add to scene
        scene.add(dae);
        chopper = dae;
        //grab models we need to animate
        rotor = scene.getObjectByName("Rotor", true);
        blade = scene.getObjectByName("blade", true);
        turbineL = scene.getObjectByName("TurbineL", true);
        turbineR = scene.getObjectByName("TurbineR", true);
        //set the spotlight to generate shadows on all models
        let light = scene.getObjectByName("spLight", true);
        light = light.children[0];
        light.castShadow = true;
        light.distance = 1000;
        light.penumbra = 1;
        //all loaded, start displaying
        render();

    });
    //position camera
    camera.position.set(-80, 70, 200);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
}

let onDocumentMouseMove = (event) => {
    mouseX = (event.clientX - (windowHalfX - windowHalfX / 1.5));
    mouseY = (event.clientY - windowHalfY);
}


let render = () => {
    //call to render scene 60fps
    requestAnimationFrame(render);
    camera.lookAt(-100, 20, -80);
    //make camera mouse reactive
    camera.position.x += ((mouseX / 8) - camera.position.x) * 0.05;
    camera.position.y += (-(mouseY / 8) - camera.position.y) * 0.05;
    //rotate chopper elements
    rotor.rotation.y += 0.15;
    blade.rotation.y += 0.3;
    turbineL.rotation.z += 0.3;
    turbineR.rotation.z += 0.3;
    //update all the clouds
    for (i = 0; i < clouds.children.length; i++) {
        var obj = clouds.children[i];
        if (obj.position.z > -600) {
            obj.position.z -= 0.8;
            obj.position.x += 0.3;
        } else {
            obj.position.z = 300;
            obj.position.x = 600 * Math.random() - 300;
        }
    }
    //make the chopper bob up and down using a sine wave
    let speed = Date.now() * 0.0015;
    chopper.position.y = (10 * Math.sin(speed));

    //keep displaying scene
    renderer.render(scene, camera);
}

//call the init function to run the code
init();
