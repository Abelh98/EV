// Variable global para almacenar el color de fondo principal de tu CSS
let backgroundColor;

// Array para guardar nuestras "partículas" o círculos
let particles = [];
const NUM_PARTICLES = 30; // Cuántas partículas queremos

// Esta función se ejecuta una vez al inicio para configurar el lienzo
function setup() {
    // Crea un lienzo (canvas) del tamaño de toda la ventana
    let canvas = createCanvas(windowWidth, windowHeight);
    
    // Adjunta el lienzo al div que preparamos en el HTML
    // Asegúrate que el ID del div en index.html sea 'p5-container'
    canvas.parent('p5-container'); 
    
    // Configura el color de fondo usando la variable CSS
    // Necesitamos leer la propiedad CSS, ya que p5.js no entiende 'var(--color-principal)' directamente
    let style = getComputedStyle(document.body);
    backgroundColor = color(style.getPropertyValue('--color-principal'));

    // Crea las partículas iniciales
    for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(new Particle());
    }
}

// Esta función se ejecuta continuamente (aproximadamente 60 veces por segundo)
function draw() {
    // Dibujamos un fondo con una opacidad baja para crear un efecto de "rastro" o "disolución"
    // Los valores RGB corresponden a tu --color-principal, y el 10 es la opacidad (casi transparente)
    background(red(backgroundColor), green(backgroundColor), blue(backgroundColor), 10);

    // Actualiza y dibuja cada partícula
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.update(); // Mueve la partícula
        p.show();   // Dibuja la partícula

        // Si la partícula se ha "disuelto" (su opacidad es muy baja), la reemplazamos por una nueva
        if (p.isDead()) {
            particles[i] = new Particle();
        }
    }
}

// Esta función se llama cada vez que se redimensiona la ventana del navegador
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Clase para definir el comportamiento de cada partícula
class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height)); // Posición aleatoria
        this.vel = p5.Vector.random2D(); // Velocidad aleatoria en 2D
        this.vel.mult(random(0.5, 2)); // Ajusta la magnitud de la velocidad
        this.acc = createVector(); // Aceleración inicial (cero)
        this.r = random(8, 20); // Radio de la partícula
        this.lifespan = 255; // Opacidad inicial (máxima)

        // Color de la partícula (tu color secundario)
        let style = getComputedStyle(document.body);
        let secondaryColor = color(style.getPropertyValue('--color-secundario'));
        this.baseColor = secondaryColor;
    }

    // Aplica una fuerza a la partícula (ej. para la interacción con el ratón)
    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        // Interacción con el ratón: las partículas se repelen del ratón
        let mouse = createVector(mouseX, mouseY);
        let dir = p5.Vector.sub(this.pos, mouse); // Vector desde el ratón a la partícula
        let distance = dir.mag(); // Distancia al ratón

        if (distance < 150) { // Si el ratón está cerca
            let force = dir.setMag(map(distance, 0, 150, 5, 0)); // La fuerza es inversamente proporcional a la distancia
            this.applyForce(force);
        }

        this.vel.add(this.acc); // Aplica la aceleración a la velocidad
        this.pos.add(this.vel); // Aplica la velocidad a la posición
        this.acc.mult(0); // Reinicia la aceleración

        // Reduce la opacidad (simula "desvanecimiento")
        this.lifespan -= 0.5;

        // Limita las partículas para que no se salgan demasiado de la pantalla y regresen
        if (this.pos.x < -this.r) this.pos.x = width + this.r;
        if (this.pos.x > width + this.r) this.pos.x = -this.r;
        if (this.pos.y < -this.r) this.pos.y = height + this.r;
        if (this.pos.y > height + this.r) this.pos.y = -this.r;
    }

    show() {
        noStroke(); // Sin borde
        
        // Define el color de relleno usando el color base y la opacidad actual
        let displayColor = color(red(this.baseColor), green(this.baseColor), blue(this.baseColor), this.lifespan);
        fill(displayColor); // Color del círculo
        ellipse(this.pos.x, this.pos.y, this.r * 2); // Dibuja el círculo
    }

    // Comprueba si la partícula ha desaparecido
    isDead() {
        return this.lifespan < 0;
    }
}
