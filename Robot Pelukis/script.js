const canvas = document.getElementById("kanvas");
const ctx = canvas.getContext("2d");

// posisi robot
let x = 0;
let y = 0;
let arah = 0; // 0=kanan
let sudahPilihTitikAwal = false;

// jalur robot
ctx.lineWidth = 3;
ctx.strokeStyle = "blue";
ctx.beginPath();

let jalur = ctx.getImageData(0, 0, canvas.width, canvas.height);

// gambar robot segitiga
function gambarRobot() {
  // hapus robot lama
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // tampilkan jalur
  ctx.putImageData(jalur, 0, 0);

  // gambar robot
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(
    x + 10 * Math.cos((arah * Math.PI) / 180),
    y + 10 * Math.sin((arah * Math.PI) / 180)
  );
  ctx.lineTo(
    x + 5 * Math.cos(((arah + 120) * Math.PI) / 180),
    y + 5 * Math.sin(((arah + 120) * Math.PI) / 180)
  );
  ctx.lineTo(
    x + 5 * Math.cos(((arah + 240) * Math.PI) / 180),
    y + 5 * Math.sin(((arah + 240) * Math.PI) / 180)
  );
  ctx.closePath();
  ctx.fill();
}

// klik canvas untuk titik awal
canvas.addEventListener("click", function (e) {
  if (!sudahPilihTitikAwal) {
    x = e.offsetX;
    y = e.offsetY;

    // animasi robot muncul
    let radius = 0;
    let anim = setInterval(() => {
      radius += 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(jalur, 0, 0);
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
      if (radius >= 10) {
        clearInterval(anim);
        sudahPilihTitikAwal = true;
        gambarRobot();
      }
    }, 15);

    ctx.beginPath();
    ctx.moveTo(x, y);
  }
});

// perintah robot
function maju() {
  if (!sudahPilihTitikAwal) return;

  let panjang = 50;
  let rad = (arah * Math.PI) / 180;
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
  if (!sudahPilihTitikAwal) return;
  arah += 90;
  if (arah >= 360) arah -= 360;
  gambarRobot();
}

function belokKiri() {
  if (!sudahPilihTitikAwal) return;
  arah -= 90;
  if (arah < 0) arah += 360;
  gambarRobot();
}

function hapus() {
  // hapus semua
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  x = 0;
  y = 0;
  arah = 0;
  sudahPilihTitikAwal = false;

  // reset jalur
  jalur = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  // tampilkan instruksi
  ctx.font = "18px Arial";
  ctx.fillStyle = "#333";
  ctx.textAlign = "center";
  ctx.fillText(
    "Klik di canvas untuk memilih titik awal robot",
    canvas.width / 2,
    canvas.height / 2
  );
}

// gambar robot pertama kali (instruksi muncul)
hapus();
