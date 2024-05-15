const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth * 0.75; // Ajustar el ancho al 75% del ancho de la ventana
canvas.height = window_height;
canvas.width = window_width;
let originalBackgroundColor = "#011572"; // Color de fondo original
let alternateBackgroundColor = "#8b0201"; // Color de fondo alternativo

let currentBackgroundColor = originalBackgroundColor; // Iniciar con el color de fondo original

let mouseX = 0;
let mouseY = 0;

let score = 0;
let level = 1;
let numCircles = 3;
let juegoTerminado = false;

function xyMouse(event) {
    let rect = canvas.getBoundingClientRect(); 
    mouseX = event.clientX - rect.left; 
    mouseY = event.clientY - rect.top; 
}

function drawMousePosition(context) {
    context.font = "40px Arial";
    context.fillStyle = "#fcfcfc"; 
    context.fillText("Nivel: " + level + " Puntuación: " + score, window_width - 200, 40);
    context.fillText("X: " + mouseX.toFixed(2) + " Y: " + mouseY.toFixed(2), 200, 40);
}

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.fillColor = getRandomColor(); // Color de relleno aleatorio
        this.text = text;
        this.speed = speed;
        this.dx = 0;
        this.dy = -this.speed;
        this.visible = true; // Indicador de visibilidad del círculo
    }

    draw(context) {
        if (!this.visible) return; // No dibujar si el círculo no es visible
        context.beginPath();
        context.strokeStyle = this.color;
        context.fillStyle = this.fillColor; // Establecer el color de relleno
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill(); // Rellenar el círculo
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);
        this.posX += this.dx;
        this.posY += this.dy;

        if (this.posY + this.radius < 0) { 
            this.reset();
        }
    }

    reset() {
        this.posX = Math.random() * window_width; 
        this.posY = window_height + this.radius;
    }
}

function getDistance(x1, x2, y1, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let circles = [];

function createCircles() {
    circles = [];
    for (let i = 0; i < numCircles; i++) {
        let randomX = Math.random() * window_width;
        let randomRadius = 25 + Math.random() * 25;
        let randomSpeed = 2 + Math.random() * 2;
        circles.push(new Circle(randomX, window_height + randomRadius, randomRadius, getRandomColor(), (i + 1).toString(), randomSpeed));
    }
}

function increaseLevel() {
    if (level < 3) {
        level++;
        if (level === 2) {
            numCircles = 5;
        } else if (level === 3) {
            numCircles = 10;
        }
    } else {
        juegoTerminado = true;
    }
}

function handleClick(event) {
    let rect = canvas.getBoundingClientRect(); 
    let clickX = event.clientX - rect.left;
    let clickY = event.clientY - rect.top;

    for (let i = 0; i < circles.length; i++) {
        let distanceFromCenter = getDistance(clickX, circles[i].posX, clickY, circles[i].posY);
        if (distanceFromCenter <= circles[i].radius && circles[i].visible) { // Solo hacer clic en círculos visibles
            circles[i].visible = false; // Hacer el círculo no visible en lugar de eliminarlo
            score++; 
            // Cambiar el color de fondo al color alternativo
            currentBackgroundColor = alternateBackgroundColor;
            setTimeout(() => {
                // Cambiar el color de fondo de vuelta al color original después de 200ms
                currentBackgroundColor = originalBackgroundColor;
            }, 200);
            break; 
        }
    }

    if (circles.every(circle => !circle.visible)) { // Si todos los círculos son invisibles
        increaseLevel();
        createCircles();
    }
}

function updateCircles() {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, window_width, window_height);

    // Actualizar el color de fondo
    ctx.fillStyle = currentBackgroundColor;
    ctx.fillRect(0, 0, window_width, window_height);

    if (!juegoTerminado) {
        circles.forEach(circle => circle.update(ctx));
        drawMousePosition(ctx); 
    } else {
        ctx.font = "30px Arial";
        ctx.fillStyle = "#fcfcfc";
        ctx.fillText("Juego terminado, Puntuación: " + score + "No te desanimes", window_width / 2, window_height / 2); 
    }
}

canvas.addEventListener("mousemove", xyMouse); 
canvas.addEventListener("click", handleClick); 

createCircles();
updateCircles();
