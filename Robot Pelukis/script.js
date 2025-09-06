const canvas = document.getElementById("kanvas");
const ctx = canvas.getContext("2d");

// posisi awal robot
let x = 0;
let y = 0;
let arah = 0; // arah awal 0 derajat
let sudahPilihTitikAwal = false; // flag untuk menunggu pemain


ctx.lineWidth = 3;
ctx.strokeStyle = "blue";

// gambar jalur awal
ctx.beginPath();
ctx.moveTo(x, y);

// fungsi gambar robot (segitiga kecil)
function gambarRobot() {
  // hapus segitiga lama
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // gambar jalur (disimpan)
  ctx.putImageData(jalur, 0, 0);

  // gambar robot sebagai segitiga
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(x + 10 * Math.cos(arah * Math.PI / 180),
             y + 10 * Math.sin(arah * Math.PI / 180));
  ctx.lineTo(x + 5 * Math.cos((arah + 120) * Math.PI / 180),
             y + 5 * Math.sin((arah + 120) * Math.PI / 180));
  ctx.lineTo(x + 5 * Math.cos((arah + 240) * Math.PI / 180),
             y + 5 * Math.sin((arah + 240) * Math.PI / 180));
  ctx.closePath();
  ctx.fill();
}

// simpan jalur di memory
let jalur = ctx.getImageData(0, 0, canvas.width, canvas.height);

// fungsi perintah
function maju() {
  let panjang = 50;
  let rad = arah * Math.PI / 180;
  let newX = x + panjang * Math.cos(rad);
  let newY = y + panjang * Math.sin(rad);

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(newX, newY);
  ctx.stroke();

  x = newX;
  y = newY;

  // simpan jalur baru
  jalur = ctx.getImageData(0, 0, canvas.width, canvas.height);

  gambarRobot();
}

function belokKanan() {
  arah += 90;
  if (arah >= 360) arah -= 360;
  gambarRobot();
}

function belokKiri() {
  arah -= 90;
  if (arah < 0) arah += 360;
  gambarRobot();
}

function hapus() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  x = 250; y = 250; arah = 0;
  ctx.beginPath();
  ctx.moveTo(x, y);

  jalur = ctx.getImageData(0, 0, canvas.width, canvas.height);
  gambarRobot();
}

// pertama kali gambar robot
gambarRobot();

canvas.addEventListener("click", function(e){
  if (!sudahPilihTitikAwal) {
    x = e.offsetX;
    y = e.offsetY;
    ctx.beginPath();
    ctx.moveTo(x, y);
    sudahPilihTitikAwal = true;
    gambarRobot();
  }
});
