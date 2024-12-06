import { createEngine } from "../../shared/engine.js";

const { renderer, run, input, finish } = createEngine();
const { ctx, canvas } = renderer;

let particles = [];
const particleCount = 1000;
let mouseDown = false;

// Ajuster la taille du canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function initializeParticles() {
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width * 2, //Position
      y: Math.random() * canvas.height * 2,
      targetX:
        canvas.width +
        2 +
        Math.sin((i / particleCount) * 2 * Math.PI) * (canvas.height * 0.45),
      targetY:
        canvas.height +
        2 +
        Math.cos((i / particleCount) * 2 * Math.PI) * (canvas.height * 0.65),
      radius: Math.random() * 2 + 1,
      velocityX: Math.random() * 2 - 1,
      velocityY: Math.random() * 2 - 1,
      attracted: false,
    });
  }
}

initializeParticles();

// // Gérer les interactions de la souris
// canvas.addEventListener("mousedown", () => {
//   mouseDown = true;
// });

// canvas.addEventListener("mouseup", () => {
//   mouseDown = false;

//   // Relâcher toutes les particules
//   particles.forEach((particle) => {
//     particle.attracted = false;
//   });
// });

// Animation
run(update);

let state = 0;

let counter = 0;
let finishCalled = false;

function update() {
  if (counter > 60000) {
    state = 2;
    finish();
    finishCalled = true;
  }
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (state === 0) {
    // start a timer and switch to the next state
    setTimeout(() => {
      state = 1;
    }, 1500);
  }
  if (state === 1) {
    drawParticles();
  }
}

function drawParticles() {
  particles.forEach((particle, index) => {
    if (input.isPressed() && index % 4 === 0) {
      // Attirer une partie des particules vers leurs cibles
      particle.attracted = true;
      counter++;
    }
    if (input.isUp()) {
      particle.attracted = false;
      counter = 0;
    }

    if (particle.attracted) {
      particle.x += (particle.targetX - particle.x) * 0.1;
      particle.y += (particle.targetY - particle.y) * 0.1;
    } else {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;

      if (particle.x < 0 || particle.x > canvas.width) particle.velocityX *= -1;
      if (particle.y < 0 || particle.y > canvas.height)
        particle.velocityY *= -1;
    }

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  });
}
