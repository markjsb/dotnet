let scene, camera, renderer, sphere, material, bg, fg, composer,
    rgbPass, rmnt, filmParams, filmPass, renderPass, copyPass;
let mouseX = 0,
    mouseY = 0,
    displaceSc = 50,
    shaderTime = 0,
    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2;


let params = () => {
    rmnt = 0.0024;
    rgbPass.uniforms['angle'].value = 1;
    rgbPass.uniforms['amount'].value = rmnt;
    filmPass.uniforms['sCount'].value = 1200;
    filmPass.uniforms['sIntensity'].value = 0.1;
    filmPass.uniforms['nIntensity'].value = 0.2;
}

let onDocumentMouseMove = (event) => {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

let onDocumentTouchStart = (event) => {
    if (event.touches.length > 1) {
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

let onDocumentTouchMove = (event) => {
    if (event.touches.length == 1) {
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

let onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}


let init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    renderPass = new THREE.RenderPass(scene, camera);
    rgbPass = new THREE.ShaderPass(THREE.RGBShiftShader);
    filmPass = new THREE.ShaderPass(THREE.FilmShader);
    copyPass = new THREE.ShaderPass(THREE.CopyShader);

    filmPass.uniforms.grayscale.value = 0;
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(filmPass);
    composer.addPass(rgbPass);
    composer.addPass(copyPass);
    copyPass.renderToScreen = true;

    params();

    let path = "assets/";
    let format = '.jpg';
    let urls = [
                path + 'interstellar_lf' + format, path + 'interstellar_ft' + format,
                path + 'interstellar_up' + format, path + 'interstellar_dn' + format,
                path + 'interstellar_rt' + format, path + 'interstellar_bk' + format
            ];

    let reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.encoding = THREE.sRGBEncoding;

    let textureLoader = new THREE.TextureLoader();
    let displacementMap = textureLoader.load("assets/tex2.jpg");

    let geometry = new THREE.SphereGeometry(200, 80, 80);
    material = new THREE.MeshPhongMaterial({
        color: 0x93eaff,
        displacementMap: displacementMap,
        displacementScale: displaceSc,
        envMap: reflectionCube,
        reflectivity: 0.4,
        side: THREE.DoubleSide
    });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphere.position.set(0, 0, -120);

    let light = new THREE.SpotLight(0xd8e5e5, 1.0, 0, Math.PI, 1);
    light.position.set(200, 500, 500);
    light.target.position.set(0, 0, 0);
    scene.add(light);
    light.penumbra = 1.5;

    let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    let loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('assets/model.dae', function (collada) {
        let dae = collada.scene;
        dae.scale.x = dae.scale.y = dae.scale.z = 1.3;
        dae.updateMatrix();
        scene.add(dae);

        bg = scene.getObjectByName("Plane", true);
        bg = bg.children[0];
        bg.material.side = THREE.DoubleSide;
        bg.material.transparent = true;

        fg = scene.getObjectByName("fPlane", true);
        fg = fg.children[0];
        fg.material.side = THREE.DoubleSide;
        fg.material.transparent = true;
        fg.material.opacity = 0.5;

        let wt = scene.getObjectByName("l_circ", true);
        wt = wt.children[0];
        wt.material[0].envMap = reflectionCube;
        wt.material[0].reflectivity = 0.2;
        wt.material[1].envMap = reflectionCube;
        wt.material[1].reflectivity = 0.2;

        let dk = scene.getObjectByName("d_circ", true);
        dk = dk.children[0];
        dk.material[1].envMap = reflectionCube;
        dk.material[1].reflectivity = 0.8;

        render();
    });

    window.addEventListener('resize', onResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    if (window.innerWidth <= 450) {
        camera.position.z = 1000;
    } else if (window.innerWidth <= 768) {
        console.log(window.innerWidth);
        camera.position.z = 800;
    } else {
        camera.position.z = 600;
    }
}

let render = () => {
    requestAnimationFrame(render);
    let sclr = Date.now() * 0.002;

    camera.position.x += ((mouseX / 3) - camera.position.x) * 0.05;
    camera.position.y += (-(mouseY / 3) - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    bg.rotation.z += 0.001;
    fg.rotation.z -= 0.0007;
    sphere.rotation.y += 0.004;
    displaceSc = 150 + (Math.sin(sclr) * 40);
    material.displacementScale = displaceSc;

    let r = Math.floor(Math.random() * 150);
    if (r == 0) rmnt = Math.random() * 0.006;
    shaderTime += 0.1;
    filmPass.uniforms['time'].value = shaderTime;
    rgbPass.uniforms['amount'].value = rmnt;
    composer.render(0.1);
    //renderer.render(scene, camera);
}

init();
