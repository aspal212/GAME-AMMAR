const boardSize = 5;
let robot = { x: 0, y: 0 };
let goals = [{ x: 2, y: 2 }, { x: 4, y: 1 }];
let obstacles = [{ x: 1, y: 3 }, { x: 3, y: 4 }];
let score = 0;

const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const commandsInput = document.getElementById("commands");

// 🎵 Suara
const soundStar = new Audio("assets/star.mp3");
const soundCrash = new Audio("assets/crash.mp3");

// Membuat papan permainan
function createBoard() {
  board.innerHTML = "";
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Rintangan
      if (obstacles.some(obs => obs.x === x && obs.y === y)) {
        cell.classList.add("obstacle");
        cell.textContent = "🟥";
      }

      // Bintang
      if (goals.some(goal => goal.x === x && goal.y === y)) {
        cell.classList.add("goal");
        cell.textContent = "⭐";
      }

      // Robot
      if (robot.x === x && robot.y === y) {
        cell.classList.add("robot");
        cell.textContent = "🤖";
      }

      board.appendChild(cell);
    }
  }
}

// Jalankan perintah robot
function runCommands(commands) {
  let steps = commands.split(",").map(cmd => cmd.trim().toLowerCase());
  let i = 0;

  function moveStep() {
    if (i >= steps.length) return;

    let command = steps[i];
    let newX = robot.x;
    let newY = robot.y;

    if (command === "atas") newY--;
    if (command === "bawah") newY++;
    if (command === "kiri") newX--;
    if (command === "kanan") newX++;

    // Cek tabrakan tembok
    if (newX < 0 || newY < 0 || newX >= boardSize || newY >= boardSize) {
      soundCrash.play();
      alert("Robot menabrak tembok!");
      return;
    }

    // Cek tabrakan rintangan
    if (obstacles.some(obs => obs.x === newX && obs.y === newY)) {
      soundCrash.play();
      alert("Robot menabrak rintangan!");
      return;
    }

    // Update posisi robot
    robot.x = newX;
    robot.y = newY;

    // Cek ambil bintang
    for (let j = 0; j < goals.length; j++) {
      if (goals[j].x === robot.x && goals[j].y === robot.y) {
        goals.splice(j, 1);
        score++;
        soundStar.play();
        break;
      }
    }

    createBoard();
    scoreDisplay.textContent = "Skor: " + score;

    // Jika semua bintang terkumpul
    if (goals.length === 0) {
      alert("Selamat! Semua bintang sudah dikumpulkan 🎉");
      commandsInput.value = ""; // kosongkan instruksi
      return;
    }

    i++;
    setTimeout(moveStep, 600); // jeda animasi antar langkah
  }

  moveStep();
}

document.getElementById("run").addEventListener("click", () => {
  runCommands(commandsInput.value);
});

createBoard();
