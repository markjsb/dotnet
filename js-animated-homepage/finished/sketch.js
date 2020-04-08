let tau, particles, period, total;

setup = () => {
    pixelDensity(1);
    createCanvas(windowWidth, (windowHeight / 2 + windowHeight / 4));
    background(255);
    colorMode(HSL);
    noFill();
    noiseDetail(0.1, 2);

    total = Math.ceil(map(4000, 0, 1920, 0, width));
    tau = 2 * Math.PI;
    period = random(0.002, 0.005);
    particles = [];
    for (let i = 1; i <= total; i++) {
        let p1 = {
            x: Math.random() * width,
            y: height / 2 + Math.random() * 50,
            a: 0,
            al: 0.2
        };
        particles.push(p1);
        particles.push({
            x: p1.x,
            y: p1.y,
            a: tau / 2,
            al: p1.al
        });
    }
}

draw = () => {
    let a, p, v;
    for (let i = 0; i < particles.length; i++) {
        p = particles[i];
        v = noise(p.x * period, p.y * period);
        p.al -= 0.00025;
        stroke("hsla(" + (Math.floor(v * 540)) + ", 95%, 30%, " + p.al + ")");
        point(p.x, p.y);
        a = v * 2 * Math.PI + p.a;
        p.x += Math.cos(a);
        p.y += Math.sin(a);
        0
    }
}
