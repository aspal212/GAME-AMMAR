const canvas = document.getElementById("kanvas");
const ctx = canvas.getContext("2d");

// ----------------------
// Posisi dan state robot
// ----------------------
let x = 0;
let y = 0;
let arah = 0; // 0=kanan
let sudahPilihTitikAwal = false;

// level awal
let level = 1;

// jalur robot
ctx.lineWidth = 3;
ctx.strokeStyle = "blue";
ctx.beginPath();
let jalur = ctx.getImageData(0, 0, canvas.width, canvas.height);

// ----------------------
// Definisi misi per level
// ----------------------
const misiPerLevel = [
  {level: 1, nama: "Persegi", koordinat: [[100,100],[300,100],[300,300],[100,300],[100,100]]},
  {level: 2, nama: "Segitiga", koordinat: [[150,350],[350,350],[250,150],[150,350]]},
  {level: 3, nama: "Lingkaran", koordinat: [], radius: 100, centerX: 250, centerY: 250}
];

// ----------------------
// Fungsi menggambar panduan bentuk
// ----------------------
function gambarBentukPanduan() {
  const m = misiPerLevel[level-1];
  if (!m) return;

  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();

  if (m.nama === "Lingkaran") {
    ctx.arc(m.centerX, m.centerY, m.radius, 0, 2*Math.PI);
  } else {
    const coords = m.koordinat;
    ctx.moveTo(coords[0][0], coords[0][1]);
    for (let i=1; i<coords.length; i++) {
      ctx.lineTo(coords[i][0], coords[i][1]);
    }
  }

  ctx.stroke();
}

// ----------------------
// Fungsi menggambar robot
// ----------------------
function gambarRobot() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // tampilkan bentuk panduan
  gambarBentukPanduan();

  // tampilkan jalur robot
  ctx.putImageData(jalur, 0, 0);

  // gambar robot segitiga
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(
    x + 10 * Math.cos((arah *
