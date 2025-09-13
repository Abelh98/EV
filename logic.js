let backgroundColor;
let secondaryColor;
let particles = [];
const NUM_PARTICLES = 30;
let video;

function preload() {
    // Cargar el mismo video una sola vez
    video = createVideo("img/font.mp4");
    video.hide();
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-container');

    // Leer variables CSS
    let style = getComputedStyle(document.body);
    backgroundColor = color(style.getPropertyValue('--color-principal') || "#e6ede7");
    secondaryColor = color(style.getPropertyValue('--color-secundario') || "#151b1f");

    // Partículas
    for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(new Particle());
    }

    // Reproducir video en loop
    video.loop();
    video.volume(0);
}

function draw() {
    background(red(backgroundColor), green(backgroundColor), blue(backgroundColor), 10);

    // Video en costado izquierdo
    image(video, 0, 0, width / 4, height);

    // Video en costado derecho
    image(video, width - width / 4, 0, width / 4, height);

    // Dibujar partículas
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.update();
        p.show();

        if (p.isDead()) {
            particles[i] = new Particle();
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

/* --- Clase Particle (igual a tu código) --- */
class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D().mult(random(0.5, 2));
        this.acc = createVector();
        this.r = random(8, 20);
        this.lifespan = 255;
        this.baseColor = secondaryColor;
    }

    applyForce(force) { this.acc.add(force); }

    update() {
        let mouse = createVector(mouseX, mouseY);
        let dir = p5.Vector.sub(this.pos, mouse);
        let distance = dir.mag();

        if (distance < 150) {
            let force = dir.setMag(map(distance, 0, 150, 5, 0));
            this.applyForce(force);
        }

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);

        this.lifespan -= 0.5;

        if (this.pos.x < -this.r) this.pos.x = width + this.r;
        if (this.pos.x > width + this.r) this.pos.x = -this.r;
        if (this.pos.y < -this.r) this.pos.y = height + this.r;
        if (this.pos.y > height + this.r) this.pos.y = -this.r;
    }

    show() {
        noStroke();
        let displayColor = color(
            red(this.baseColor), 
            green(this.baseColor), 
            blue(this.baseColor), 
            this.lifespan
        );
        fill(displayColor);
        ellipse(this.pos.x, this.pos.y, this.r * 2);
    }

    isDead() { return this.lifespan < 0; }
}
