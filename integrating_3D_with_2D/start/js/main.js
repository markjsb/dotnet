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
    //render the scene - start renderer and set it's size and background transparent
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    //transparent background colour for the renderer
    renderer.setClearColor(0xcaf8f1, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //add to webpage
    document.body.appendChild(renderer.domElement);
    //position camera
    camera.position.set(-80, 70, 200);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    //////// ADD THE CODE HERE

}





//call the init function to run the code
init();
