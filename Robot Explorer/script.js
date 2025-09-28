const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const runButton = document.getElementById("run");
const commandsInput = document.getElementById("commands");

const size = 5;
let robotPos = { x: 0, y: 0 };
let stars = [];
let obstacles = [];
let score = 0;
let level = 1;
let robotEl; // elemen robot

// Buat papan (grid kosong + bintang + rintangan)
function createBoard() {
  board.innerHTML = "";

  // buat grid dasar
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Bintang
      if (stars.some(star => star.x === x && star.y === y)) {
        cell.classList.add("goal");
        cell.textContent = "⭐";
      }

      // Rintangan
      if (obstacles.some(obs => obs.x === x && obs.y === y)) {
        cell.classList.add("obstacle");
        cell.textContent = "🟥";
      }

      board.appendChild(cell);
    }
  }

  // Tambahkan robot di atas grid (absolute position)
  if (!robotEl) {
    robotEl = document.createElement("div");
    robotEl.classList.add("robot");
    robotEl.textContent = "🤖";
    board.appendChild(robotEl);
  }
  updateRobotPosition();
}

// Update posisi robot dengan animasi
function updateRobotPosition() {
  const cellSize = 70 + 5; // ukuran cell + gap
  robotEl.style.transform = `translate(${robotPos.x * cellSize}px, ${robotPos.y * cellSize}px)`;
}

// Tambahkan bintang & rintangan sesuai level
function setupLevel() {
  stars = [];
  obstacles = [];
  robotPos = { x: 0, y: 0 };
  robotEl = null;

  const starCount = level + 1;
  const obstacleCount = Math.min(level, 4);

  // bintang
  for (let i = 0; i < starCount; i++) {
    let pos;
    do {
      pos = { x: rand(size), y: rand(size) };
    } while (
      (pos.x === 0 && pos.y === 0) ||
      stars.some(s => s.x === pos.x && s.y === pos.y)
    );
    stars.push(pos);
  }

  // rintangan
  for (let i = 0; i < obstacleCount; i++) {
    let pos;
    do {
      pos = { x: rand(size), y: rand(size) };
    } while (
      (pos.x === 0 && pos.y === 0) ||
      stars.some(s => s.x === pos.x && s.y === pos.y) ||
      obstacles.some(o => o.x === pos.x && o.y === pos.y)
    );
    obstacles.push(pos);
  }

  createBoard();
}

function rand(max) {
  return Math.floor(Math.random() * max);
}

// Gerakan robot
function moveRobot(command) {
  let next = { ...robotPos };

  if (command === "atas") next.y--;
  if (command === "bawah") next.y++;
  if (command === "kiri") next.x--;
  if (command === "kanan") next.x++;

  // cek batas
  if (next.x < 0 || next.x >= size || next.y < 0 || next.y >= size) return;

  // cek rintangan
  if (obstacles.some(obs => obs.x === next.x && obs.y === next.y)) {
    alert("Robot menabrak rintangan! 🚫");
    return;
  }

  robotPos = next;
  updateRobotPosition();

  // cek bintang
  const starIndex = stars.findIndex(star => star.x === robotPos.x && star.y === robotPos.y);
  if (starIndex !== -1) {
    stars.splice(starIndex, 1);
    score += 10;
    scoreDisplay.textContent = `Skor: ${score}`;

    if (stars.length === 0) {
      alert(`Level ${level} selesai! 🎉`);
      level++;
      setupLevel();
    }
  }
}

// Jalankan perintah
function runCommands() {
  const commands = commandsInput.value.toLowerCase().split(/[ ,\n]+/);
  let step = 0;

  function nextStep() {
    if (step < commands.length) {
      moveRobot(commands[step]);
      step++;
      setTimeout(nextStep, 600); // delay biar animasi kelihatan
    }
  }

  nextStep();
}

runButton.addEventListener("click", runCommands);

// Mulai game
setupLevel();
