const gameArea = document.getElementById("gameArea");
const music = document.getElementById("music");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const bpmInput = document.getElementById("bpm");
const bgVideo = document.getElementById("bgVideo");
let intervalId;
const comboDisplay = document.getElementById("combo");
let currentCombo = 0;
const perfectnumDisplay=document.getElementById("perfectnum");
let currentperfects=0;
const freezeBtn = document.getElementById("freezeBtn");

document.getElementById("audioFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    music.src = URL.createObjectURL(file);
  }
});

document.getElementById("bgImage").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      gameArea.style.backgroundImage = `url(${event.target.result})`;
    };
    reader.readAsDataURL(file);
  }
});


// 背景動画
document.getElementById("bgVideoFile").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      bgVideo.src = URL.createObjectURL(file);
      bgVideo.style.display = "block";
      gameArea.style.backgroundImage = "none"; // 背景画像はオフ
    }
  });
  

startBtn.addEventListener("click", () => {
  const bpm = parseFloat(bpmInput.value);
  if (isNaN(bpm) || bpm <= 0) {
    alert("有効なBPMを入力してください"); //たまにスタートボタンをノーツとして浮かび上がらせてサドンデスしても面白そうw
    return;
  }

  const interval = 60000 / bpm; // ミリ秒
  music.play();
  bgVideo.play();
  bgVideo.currentTime=0;

  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(spawnNote, interval);
});
//一時停止
    freezeBtn.addEventListener("click", () => {
    music.pause();
    bgVideo.pause();
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });

// 停止(最初に戻る)
stopBtn.addEventListener("click", () => {
    music.pause();
    music.currentTime = 0;
    bgVideo.pause();
    bgVideo.currentTime=0;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    currentperfects=0;
    perfectnumDisplay.textContent = `PERFECT: 0`;
  });

function spawnNote() {

  const note = document.createElement("div");
  note.className = "note";
  note.style.backgroundColor = randomColor();
  note.style.left = `${Math.random() * 90 + 5}%`;
  note.style.top = `${Math.random() * 80 + 10}%`;
  note.style.transform = "scale(0)";
  gameArea.appendChild(note);

  // アニメーション
  setTimeout(() => {
    note.style.transition = "transform 0.2s ease";
    note.style.transform = "scale(1)";
  }, 50);

  // タップ判定
  note.addEventListener("click", () => {
    note.style.backgroundColor = "#fff";
    note.innerText = "Perfect!";
    note.style.fontSize = "12px";
    note.style.color = "#000";
    note.Judge=true;
    currentCombo=currentCombo+1;
    currentperfects=currentperfects+1;
    comboDisplay.textContent = `Combo: ${currentCombo}`;
    perfectnumDisplay.textContent=`PERFECT: ${currentperfects}`;
    setTimeout(() => note.remove(), 500); //枠だけ残っていいい感じ！
  });

  // 一定時間後に消す
  setTimeout(() => {
    if (note.parentElement && note.Judge!=true) {
    currentCombo = 0;
    comboDisplay.textContent = `Combo: 0`;
    note.remove();
    }
 }, 2000);
}



function randomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;
}




