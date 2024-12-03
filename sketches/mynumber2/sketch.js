import { createBricks, drawBrick } from "./bricks.js";
import { createEngine } from "../../shared/engine.js";
const { renderer, input, run } = createEngine();
const { ctx, canvas } = renderer;

const blockSize = 120;
const lightColor = "#f8f9fa"; // C.lumineuse
const shadowColor = "#6c757d"; // C.sombre

// grille
const grid = [
  [0, 1, 1, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 1, 1, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1],
];

let bricks = [];
let gameStarted = false;

function initBricks() {
  bricks = createBricks(grid, blockSize, canvas);
  console.log("Briques initialisées :", bricks);
}

function drawButton() {
  const button = document.getElementById("startButton");
  button.style.display = "block"; // Montre le bouton
}

function hideButton() {
  const button = document.getElementById("startButton");
  button.style.display = "none"; // Cache le bouton
}

function resetGame() {
  initBricks();
  gameStarted = false;
  drawButton();
}

// Gestion du clic sur une brique
canvas.addEventListener("click", (event) => {
  if (!gameStarted) return; // Si le jeu n'est pas encore démarré, on ne fait rien

  // Calculer les coordonnées du clic par rapport au canevas
  const rect = canvas.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;

  // Affichage des coordonnées du clic dans la console pour déboguer
  console.log(`Clic à : X = ${offsetX}, Y = ${offsetY}`);

  // Vérifier si la position du clic touche une brique
  bricks.forEach((brick) => {
    if (
      offsetX > brick.x &&
      offsetX < brick.x + blockSize &&
      offsetY > brick.y &&
      offsetY < brick.y + blockSize
    ) {
      // Message de débogage pour vérifier si une brique est bien cliquée
      console.log("Brique cliquée :", brick);

      // Dès qu'une brique est cliquée, toutes les briques commencent à tomber
      bricks.forEach((b) => {
        // Application d'une chute avec easing
        b.targetY = canvas.height + blockSize;
        b.speed = Math.random() * 300 + 100; // Augmentation de la vitesse de chute
        b.fallingWithEasing = true; // Marque la chute avec easing
      });
    }
  });
});

// Fonction d'update du jeu
function update(dt) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!gameStarted) {
    drawButton();

    document.getElementById("startButton").addEventListener("click", () => {
      gameStarted = true;
      initBricks();
      hideButton();
    });
  } else {
    bricks.forEach((brick) => {
      if (brick.y < brick.targetY) {
        // Si la brique est en train de tomber
        if (brick.fallingWithEasing) {
          // Chute avec easing
          const deltaY = brick.targetY - brick.y;
          const easeValue = Math.pow(deltaY / (canvas.height + blockSize), 3); // Easing "easeInExpo"
          brick.y += easeValue * brick.speed * dt;
        } else {
          // Chute rapide initiale sans easing (première chute)
          brick.y += brick.speed * dt;
        }
      } else {
        brick.y = brick.targetY;
      }

      drawBrick(brick, ctx, lightColor, shadowColor, blockSize);
    });
  }
}

// Démarre la boucle d'animation
run(update);
