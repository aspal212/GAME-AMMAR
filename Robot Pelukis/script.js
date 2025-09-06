const canvas = document.getElementById("kanvas");
const ctx = canvas.getContext("2d");

// ----------------------
// Posisi dan state robot
// ----------------------
let x = 0;
let y = 0;
let arah = 0; // 0=kanan
let sudahPilihTitikAwal = false;
let level = 1;
let skor = 0;

// Jalur robot
ctx.lineWidth = 3;
ctx.strokeStyle = "blue";
ctx.beginPath();
let jalur = ctx.getImageData(0, 0, canvas.width, canvas.height);

// ----------------------
// Definisi misi per level
// ----------------------
const misiPerLevel = [
  {
    level: 1,
    nama: "Persegi",
    koordinat: [[100,100],[300,100],[300,300],[100,300],[100,100]]
  },
  {
    level: 2,
    nama: "Segitiga",
    koordinat: [[150,350],[350,350],[250,150],[150,350]]
  },
  {
    level: 3,
    nama: "Lingkaran",
    koordinat: [],
    radius: 100,
    centerX: 250,
    centerY: 250
  }
];

// ----------------------
// Fungsi menggambar sample misi
// ----------------------
function gambarBentukPanduan() {
  const m = misiPerLevel[level-1];
  if(!m) return;

  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();

  if(m.nama === "Lingkaran") {
    ctx.arc(m.centerX, m.centerY, m.radius, 0, 2*Math.PI);
  } else {
    const coords = m.koordinat;
    ctx.moveTo(coords[0][0], coords[0][1]);
    for(let i=1;i<coords.length;i++){
      ctx.lineTo(coords[i][0], coords[i][1]);
    }
  }
  ctx.stroke();

  // Titik awal sample
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  if(m.nama === "Lingkaran"){
    ctx.arc(m.centerX, m.centerY - m.radius, 5, 0, 2*Math.PI);
  } else {
    ctx.arc(m.koordinat[0][0], m.koordinat[0][1], 5, 0, 2*Math.PI);
  }
  ctx.fill();
}

// ----------------------
// Fungsi menggambar robot
// ----------------------
function gambarRobot() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  gambarBentukPanduan();
  ctx.putImageData(jalur,0,0);

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(
    x + 10 * Math.cos((arah * Math.PI)/180),
    y + 10 * Math.sin((arah * Math.PI)/180)
  );
  ctx.lineTo(
    x + 5 * Math.cos(((arah+120)*Math.PI)/180),
    y + 5 * Math.sin(((arah+120)*Math.PI)/180)
  );
  ctx.lineTo(
    x + 5 * Math.cos(((arah+240)*Math.PI)/180),
    y + 5 * Math.sin(((arah+240)*Math.PI)/180)
  );
  ctx.closePath();
  ctx.fill();

  tampilkanLevel();
  tampilkanSkor();
}

// ----------------------
// Tampilkan level dan skor
// ----------------------
function tampilkanLevel() {
  ctx.font = "18px Arial";
  ctx.fillStyle = "#333";
  ctx.textAlign = "left";
  ctx.fillText("Level: "+level+" - Misi: "+misiPerLevel[level-1].nama,10,20);
}

function tampilkanSkor(){
  ctx.font = "18px Arial";
  ctx.fillStyle = "#333";
  ctx.textAlign = "right";
  ctx.fillText("Skor: "+skor, canvas.width-10, 20);
}

// ----------------------
// Klik canvas untuk titik awal
// ----------------------
canvas.addEventListener("click", function(e){
  if(!sudahPilihTitikAwal){
    x = e.offsetX;
    y = e.offsetY;

    let radius = 0;
    let anim = setInterval(()=>{
      radius += 2;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.putImag
