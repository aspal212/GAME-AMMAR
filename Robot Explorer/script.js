const board = document.getElementById('game-board');
const runBtn = document.getElementById('run');
const commandsInput = document.getElementById('commands');
const scoreDisplay = document.getElementById('score');

let robotPos = {x: 0, y: 0};
let stars = [{x: 2, y: 2}, {x: 4, y: 4}];
let score = 0;

// buat papan
function createBoard() {
  board.innerHTML = '';
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      if (x === robotPos.x && y === robotPos.y) cell.classList.add('robot');
      if (stars.some(s => s.x === x && s.y === y)) cell.classList.add('star');

      board.appendChild(cell);
    }
  }
}

// jalankan perintah
function runCommands() {
  const commands = commandsInput.value.split(',').map(c => c.trim().toLowerCase());

  for (let cmd of commands) {
    if (cmd === 'atas' && robotPos.y > 0) robotPos.y--;
    if (cmd === 'bawah' && robotPos.y < 4) robotPos.y++;
    if (cmd === 'kiri' && robotPos.x > 0) robotPos.x--;
    if (cmd === 'kanan' && robotPos.x < 4) robotPos.x++;

    // cek bintang
    stars = stars.filter(s => {
      if (s.x === robotPos.x && s.y === robotPos.y) {
        score += 10;
        return false;
      }
      return true;
    });
  }

  createBoard();
  scoreDisplay.textContent = 'Skor: ' + score;
}

runBtn.addEventListener('click', runCommands);
createBoard();
