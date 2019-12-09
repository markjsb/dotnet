precision mediump float;

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our textures coming from p5
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform sampler2D tex2;

void main() {

    vec2 uv = vTexCoord;
    // the texture is loaded upside down and backwards by default so lets flip it
    uv.y = 1.0 - uv.y;
  
    // get the three webcam feeds
    vec4 cam = texture2D(tex0, uv);
    vec4 cam2 = texture2D(tex1, uv);
    vec4 cam3 = texture2D(tex2, uv);
  
    // lets use one channel from each of the textures
    vec4 colOut = vec4(cam.r, cam2.g, cam3.b, 1.0);
    
    //cam.rgb -= cam2.rgb* -0.2;
    //cam.rgb -= cam3.rgb* -0.2;
    
    
    //colorize the image
    vec4 c = vec4(0.5, 0.7, 1.0, 1.0);
    //multiply the image by the tint above;
    vec4 colorized = (colOut * c);
    
    //create a vignette: how dark it is
    float darkness = 1.0;
    //how much it's in from the edges
    float offset = 1.8;
  
    //vuv (vignette uv) take uv coords and get center of screen multiply by the amount of vignette to be applied (offset)
    vec2 vuv = ( uv - vec2( 0.5 ) ) * vec2( offset );
    //gl_FragColor is always what's output to the display. colOut is the input image, here the input is mixed with the vuv to get the vignette applied
    gl_FragColor = vec4( mix( colorized.rgb, vec3( 1.0 - darkness ), dot( vuv, vuv ) ), colorized.a );
    

    // render the output - old ouput just the coloured channel effect
    //gl_FragColor = colOut;
    // just the camera on it's own
    //gl_FragColor = cam;
}