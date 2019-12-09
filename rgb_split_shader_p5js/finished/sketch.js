let img, camShader, cam, shaderLayer, hRatio;
let numLayers = 90,
    layers = [];
let index1 = 0,
    index2 = numLayers / 3,
    index3 = numLayers / 3 * 2;
let displayOn = false,
    counter = 0;


function preload() {
    // load the shader
    camShader = loadShader('effect.vert', 'effect.frag');
    img = loadImage('img/disc.png');
}

function setup() {
    // shaders require WEBGL mode to work
    createCanvas(windowWidth, windowHeight);
    noStroke();
    pixelDensity(1);

    // initialize the webcam at the window size
    cam = createCapture(VIDEO);
    cam.size(640, 480);

    hRatio = (windowWidth / cam.width) * cam.height;

    cam.size(width, hRatio);

    // hide the html element that createCapture adds to the screen
    cam.hide();

    // this layer will use webgl with our shader
    shaderLayer = createGraphics(windowWidth, windowHeight, WEBGL);

    // create a ton of createGraphics layers
    for (let i = 0; i < numLayers; i++) {
        let l = createGraphics(windowWidth, windowHeight);
        layers.push(l);
    }
    background(0);

}

function draw() {

    // draw the camera on the current layer
    layers[index1].image(cam, 0, 0, width, hRatio);

    // shader() sets the active shader with our shader
    shaderLayer.shader(camShader);

    // send the camera and the two other past frames into the camera feed
    camShader.setUniform('tex0', layers[index1]);
    camShader.setUniform('tex1', layers[index2]);
    camShader.setUniform('tex2', layers[index3]);


    // rect gives us some geometry on the screen
    shaderLayer.rect(0, 0, width, height);

    if (!displayOn) {
        //load up 90 frames and display a disc
        background(0);
        translate(width / 2, height / 3);
        imageMode(CENTER);
        counter++;
        rotate(PI / 180 * (counter / 0.9));
        image(img, 0, 0);
        if (counter >= 120) displayOn = true;
    } else {
        imageMode(CORNER);
        //ok we have 90 frames stored - display the image
        // render the shaderlayer to the screen
        image(shaderLayer, 0, 0, width, height);
    }

    // increase all indices by 1, resetting if it goes over layers.length
    // the index runs in a circle 0, 1, 2, ... 29, 30, 0, 1, 2, etc.
    // index1
    // index2 will be somewhere in the past
    // index3 will be even further into the past
    index1 = (index1 + 1) % layers.length;
    index2 = (index2 + 1) % layers.length;
    index3 = (index3 + 1) % layers.length;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    hRatio = (windowWidth / cam.width) * cam.height;
}
