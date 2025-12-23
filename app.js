/********************
 * DATA
 ********************/
const DATA = {
  label: "Drank",
  children: [
    {
      label: "Bier",
      children: [
        { label: "Heineken" },
        { label: "Brand" },
        { label: "IJwit" },
        { label: "Zatte" }
      ]
    },
    {
      label: "Wijn",
      children: [
        { label: "Wit" },
        { label: "Rood" },
        { label: "Rosé" }
      ]
    },
    {
      label: "Mix",
      children: [
        { label: "Aperol Spritz" },
        { label: "Moscow Mule" },
        { label: "Dark ’n Stormy" }
      ]
    },
    {
      label: "Shot",
      children: [
        { label: "Jack Daniel’s" },
        { label: "Jameson" },
        { label: "Absolut Vodka" },
        { label: "Kraken Rum" }
      ]
    }
  ]
};

/********************
 * Audio tick
 ********************/
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = AudioCtx ? new AudioCtx() : null;

function tickSound(speed = 1){
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "square";
  osc.frequency.value = 1400 * speed;
  gain.gain.value = 0.04;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.03);
}

/********************
 * Canvas setup
 ********************/
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const resultEl = document.getElementById("result");
const crumbEl = document.getElementById("crumb");
const noteEl = document.getElementById("note");
const resetBtn = document.getElementById("resetBtn");

let angle = 0;
let spinning = false;

/********************
 * Helpers
 ********************/
function haptic(ms=20){
  if (navigator.vibrate) navigator.vibrate(ms);
}

function rand(n){
  return Math.floor(Math.random() * n);
}

function pickLeaf(node){
  if (!node.children) return node;
  return pickLeaf(node.children[rand(node.children.length)]);
}

/********************
 * Draw wheel
 ********************/
function drawWheel(){
  const opts = DATA.children;
  const N = opts.length;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const cx = canvas.width/2;
  const cy = canvas.height/2;
  const r = cx * 0.88;

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(angle);

  const step = Math.PI*2/N;

  for(let i=0;i<N;i++){
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0,0,r,i*step,(i+1)*step);
    ctx.closePath();

    ctx.fillStyle = i%2
      ? "rgba(255,47,185,.25)"
      : "rgba(0,246,255,.22)";
    ctx.fill();

    ctx.save();
    ctx.rotate(i*step + step/2);
    ctx.fillStyle="white";
    ctx.font="900 34px system-ui";
    ctx.textAlign="right";
    ctx.shadowBlur=20;
    ctx.shadowColor = i%2 ? "#ff2fb9" : "#00f6ff";
    ctx.fillText(opts[i].label, r*0.9, 10);
    ctx.restore();
  }

  ctx.restore();
}

/********************
 * Spin logic
 ********************/
function spin(){
  if (spinning) return;
  spinning = true;
  document.body.classList.add("spinning");
  haptic(20);

  const N = DATA.children.length;
  const choice = rand(N);
  const step = Math.PI*2/N;

  const targetAngle = (-Math.PI/2) - (choice*step + step/2);
  const extra = Math.PI*2 * (6 + rand(3));
  const finalAngle = targetAngle - extra;

  const start = angle;
  const duration = 1700;
  const startTime = performance.now();

  function animate(now){
    const t = Math.min(1,(now-startTime)/duration);
    angle = start + (finalAngle-start)*(1-Math.pow(1-t,3));

    if(Math.random() < 0.15 + t*0.3){
      tickSound(1-t*0.6);
      haptic(5);
    }

    drawWheel();

    if(t<1){
      requestAnimationFrame(animate);
    }else{
      const first = DATA.children[choice];
      const final = pickLeaf(first);

      resultEl.textContent = final.label;
      crumbEl.textContent = `Pad: ${first.label} → ${final.label}`;
      noteEl.textContent = "Tap opnieuw voor een nieuwe ronde";

      document.body.classList.remove("spinning");
      document.body.classList.add("pulsing");
      spinning = false;
    }
  }
  requestAnimationFrame(animate);
}

/********************
 * Events
 ********************/
canvas.addEventListener("click", spin);
canvas.addEventListener("touchend", e=>{
  e.preventDefault();
  spin();
},{passive:false});

resetBtn.addEventListener("click", ()=>{
  angle = 0;
  resultEl.textContent = "—";
  crumbEl.textContent = "Pad: (start)";
  noteEl.textContent = "1 tap = 1 einddrank";
  drawWheel();
});

/********************
 * Init
 ********************/
document.body.classList.add("pulsing");
drawWheel();
