// @ts-nocheck
// Marking mode: head moves and marks visited cells until target length reached.

const BOARD_SIZE = 20;
const PREVIEW_SIZE = 7;

const boardEl = document.getElementById("game-board");
const previewBoardEl = document.getElementById("preview-board");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const targetNameEl = document.getElementById("target-name");
const startHint = document.getElementById("status");
const resetBtn = document.getElementById("reset");

let head = { x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) };
let marks = []; // array of {x,y}
let marksSet = new Set();
let score = 0;
let levelIndex = 0;
let targetLength = 0;

// Level definitions
const LEVELS = [
  { name: "Kotak 2x2", coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }] },
  { name: "Garis 3", coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }] },
  { name: "Bentuk L", coords: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }] },
  { name: "Bentuk T", coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }] },
  { name: "Kotak 3x3", coords: [
      {x:0,y:0},{x:1,y:0},{x:2,y:0},
      {x:0,y:1},{x:1,y:1},{x:2,y:1},
      {x:0,y:2},{x:1,y:2},{x:2,y:2}
    ]},
  { name: "Plus", coords: [{x:1,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:1,y:2}] }
];

// Utilities
function keyOf(p) { return `${p.x},${p.y}`; }
function clone(p) { return { x: p.x, y: p.y }; }
function normalize(coords) {
  if (!coords.length) return [];
  const minX = Math.min(...coords.map(c => c.x));
  const minY = Math.min(...coords.map(c => c.y));
  return coords.map(c => ({ x: c.x - minX, y: c.y - minY }));
}
function coordsToSet(coords) { return new Set(coords.map(c => `${c.x},${c.y}`)); }

// exact match (no rotation/reflection)
function exactMatchMarks(marksArr, targetCoords) {
  if (marksArr.length !== targetCoords.length) return false;
  const normMarks = normalize(marksArr);
  const normTarget = normalize(targetCoords);
  const setMarks = coordsToSet(normMarks);
  const setTarget = coordsToSet(normTarget);
  if (setMarks.size !== setTarget.size) return false;
  for (const k of setTarget) if (!setMarks.has(k)) return false;
  return true;
}

// Rendering
function drawBoard(highlightWin = false) {
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 22px)`;
  boardEl.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 22px)`;

  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      const k = `${x},${y}`;
      if (marksSet.has(k)) {
        cell.classList.add(highlightWin ? "mark-win" : "mark");
      }
      if (head.x === x && head.y === y) {
        cell.classList.add("head");
      }
      boardEl.appendChild(cell);
    }
  }
}

function drawPreview(coords) {
  previewBoardEl.innerHTML = "";
  previewBoardEl.style.gridTemplateColumns = `repeat(${PREVIEW_SIZE}, 18px)`;
  previewBoardEl.style.gridTemplateRows = `repeat(${PREVIEW_SIZE}, 18px)`;

  const norm = normalize(coords);
  for (let y = 0; y < PREVIEW_SIZE; y++) {
    for (let x = 0; x < PREVIEW_SIZE; x++) {
      const c = document.createElement("div");
      c.className = "preview-cell";
      if (norm.some(p => p.x === x && p.y === y)) {
        c.classList.add("preview-active");
      }
      previewBoardEl.appendChild(c);
    }
  }
}

// Start level
function startLevel(i) {
  levelIndex = i % LEVELS.length;
  const lvl = LEVELS[levelIndex];
  levelEl.textContent = `Level: ${levelIndex + 1}`;
  targetNameEl.textContent = `Target: ${lvl.name}`;
  targetLength = lvl.coords.length;

  // reset head & marks
  head = { x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) };
  marks = [];
  marksSet = new Set();

  drawBoard();
  drawPreview(lvl.coords);
  startHint.textContent = `➡️ Tandai ${targetLength} kotak untuk membentuk: ${lvl.name}`;
  scoreEl.textContent = `Skor: ${score}`;
}

// Move + mark
function moveAndMark(dx, dy) {
  const nx = head.x + dx;
  const ny = head.y + dy;

  // wall collision -> fail and reset level
  if (nx < 0 || ny < 0 || nx >= BOARD_SIZE || ny >= BOARD_SIZE) {
    startHint.textContent = "❌ Tabrak tembok — level diulang";
    return startLevel(levelIndex);
  }

  head = { x: nx, y: ny };
  const key = keyOf(head);

  // add mark only if not already marked and we still need marks
  if (!marksSet.has(key) && marks.length < targetLength) {
    marks.push(clone(head));
    marksSet.add(key);
  }

  drawBoard();

  // check success
  const lvl = LEVELS[levelIndex];
  if (marks.length === targetLength && exactMatchMarks(marks, lvl.coords)) {
    startHint.textContent = `✅ Misi selesai: ${lvl.name}!`;
    score++;
    scoreEl.textContent = `Skor: ${score}`;
    drawBoard(true); // highlight win
    setTimeout(() => startLevel(levelIndex + 1), 1100);
    return;
  } else {
    startHint.textContent = `Mark: ${marks.length}/${targetLength} — lanjutkan`;
  }
}

// Joystick button wrappers (works for click/tap)
function onBtnUp() { moveAndMark(0, -1); }
function onBtnDown() { moveAndMark(0, 1); }
function onBtnLeft() { moveAndMark(-1, 0); }
function onBtnRight() { moveAndMark(1, 0); }

// Keyboard controls (still supported)
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") { moveAndMark(0, -1); }
  if (e.key === "ArrowDown") { moveAndMark(0, 1); }
  if (e.key === "ArrowLeft") { moveAndMark(-1, 0); }
  if (e.key === "ArrowRight") { moveAndMark(1, 0); }
});

// Reset button
resetBtn.addEventListener("click", () => startLevel(levelIndex));

// init
score = 0;
startLevel(0);
