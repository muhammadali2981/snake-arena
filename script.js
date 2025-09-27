let snakeArr = [{ x: 13, y: 15 }];
let boardEl = document.querySelector(".board");
let scoreboardEl = document.querySelector(".score-board");

// 🎵 Sounds
let startSound = new Audio("asset/gamestart.mp3");
let eatSound = new Audio("asset/eat.mp3");
let gameoverSound = new Audio("asset/gameover.mp3");
let moveSound = new Audio("asset/hiss.mp3");

// Food items with points
const foods = [
  { emoji: "🍎", points: 1 },
  { emoji: "🍇", points: 2 },
  { emoji: "🍉", points: 5 },
  { emoji: "🍒", points: 3 },
  { emoji: "🍌", points: 2 },
];
let food = { x: 7, y: 7, emoji: "🍎", points: 1 };

// Movement direction
let inputDir = { x: 0, y: 0 };

// Game vars
let speed = 5;
let lastPaintTime = 0;
let score = 0;
let highScore = localStorage.getItem("highScore")
  ? parseInt(localStorage.getItem("highScore"))
  : 0;

// Scoreboard elements
let scoreBoard = document.querySelector(".score");
let highScoreBoard = document.querySelector(".high-score");
let levelBoard = document.querySelector(".level");

// Display initial scores
scoreBoard.innerText = "Score: " + score;
highScoreBoard.innerText = "High Score: " + highScore;
levelBoard.innerText = "Level: 1";

// 🎮 Main Game Loop
function main(curTime) {
  window.requestAnimationFrame(main);

  if ((curTime - lastPaintTime) / 1000 < 1 / speed) return;
  lastPaintTime = curTime;

  gameEngine();
}

// ⚡ Core Game Engine
function gameEngine() {
  boardEl.innerHTML = "";

  // Draw snake
  snakeArr.forEach((segment, index) => {
    let snake = document.createElement("div");
    snake.style.gridRowStart = segment.y;
    snake.style.gridColumnStart = segment.x;

    if (index === 0) {
      snake.classList.add("head");
    } else {
      snake.classList.add("snake");
      snake.style.opacity = (index / snakeArr.length).toFixed(2); // Tail fade effect
    }

    boardEl.appendChild(snake);
  });

  // Draw food
  let foodEl = document.createElement("div");
  foodEl.innerText = food.emoji;
  foodEl.style.gridRowStart = food.y;
  foodEl.style.gridColumnStart = food.x;
  foodEl.classList.add("food");
  boardEl.appendChild(foodEl);

  // Move snake body
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // 🥗 Food eaten
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    eatSound.currentTime = 0;
    eatSound.play();

    score += food.points;
    updateScore();

    // Generate new random food
    let randFood = foods[Math.floor(Math.random() * foods.length)];
    food = {
      x: Math.floor(Math.random() * 20) + 1,
      y: Math.floor(Math.random() * 20) + 1,
      emoji: randFood.emoji,
      points: randFood.points,
    };

    // Grow snake
    snakeArr.push({ ...snakeArr[snakeArr.length - 1] });
  }

  // 🚫 Check game over
  gameOut();
}

// 🏆 Update Score & Level
function updateScore() {
  scoreBoard.innerText = "Score: " + score;
  scoreBoard.classList.add("glow");
  setTimeout(() => scoreBoard.classList.remove("glow"), 500);

  // Level up
  let level = Math.floor(score / 10) + 1;
  levelBoard.innerText = "Level: " + level;
  speed = 5 + level; // increase speed with levels

  // Update high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreBoard.innerText = "High Score: " + highScore;
  }
}

// 🚧 Game Over Logic
function gameOut() {
  if (
    snakeArr[0].x >= 22 || snakeArr[0].x <= -2 ||
    snakeArr[0].y >= 22 || snakeArr[0].y <= -2
  ) {
    
    return endGame();
  }

  for (let i = 1; i < snakeArr.length-2; i++) {
    if (snakeArr[0].x === snakeArr[i].x && snakeArr[0].y === snakeArr[i].y) {
      
      return endGame()
    }
  }
}

function endGame() {
  // gameoverSound.currentTime = 0;
  gameoverSound.play();
   document.querySelector(".overlay").style.display = "flex";

 

  inputDir = { x: 0, y: 0 };
}

// Restart game
document.querySelector("#restart-btn").addEventListener("click", () => {
  document.querySelector(".overlay").style.display = "none";
  snakeArr = [{ x: 13, y: 15 }];
  score = 0;
  speed = 5;
  updateScore();
  startSound.play();
});

// 🎹 Controls
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      inputDir = { x: 0, y: -1 };
      moveSound.play();
      break;
    case "ArrowDown":
      inputDir = { x: 0, y: 1 };
      moveSound.play();
      break;
    case "ArrowLeft":
      inputDir = { x: -1, y: 0 };
      moveSound.play();
      break;
    case "ArrowRight":
      inputDir = { x: 1, y: 0 };
      moveSound.play();
      break;
  }
});

// Start game
let startBtn = document.querySelector("button")
startBtn.addEventListener('click',()=>{
  startSound.play();
boardEl.style.opacity = 1;
scoreboardEl.style.opacity = 1;


window.requestAnimationFrame(main);

})
