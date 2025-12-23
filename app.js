/***********************
 * DATA – gebruik jouw volledige kaart
 ***********************/
const DATA = {
  label:"Drank",
  children:[
    {
      label:"Bier",
      children:[
        {label:"Tapbier", children:[{label:"Heineken"},{label:"Brand"}]},
        {label:"Flesbier", children:[{label:"Zatte"},{label:"Duvel"}]}
      ]
    },
    {
      label:"Mix",
      children:[
        {
          label:"Shot",
          children:[{label:"Jameson"},{label:"Vodka"}]
        },
        {
          label:"Fris",
          children:[{label:"Cola"},{label:"Tonic"}]
        }
      ]
    }
  ]
};

/***********************
 * STATE
 ***********************/
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const midResult = document.getElementById("midResult");
const midText = midResult.querySelector("span");
const finalScreen = document.getElementById("finalScreen");
const finalBtn = document.getElementById("finalBtn");

let currentNode = DATA;
let angle = 0;
let spinning = false;

/***********************
 * AUDIO (SAFE FOR SAFARI)
 ***********************/
let audioCtx, osc, gain;

function initAudio(){
  if(audioCtx) return;
  audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  osc = audioCtx.createOscillator();
  gain = audioCtx.createGain();
  osc.type = "triangle";
  osc.frequency.value = 850;
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
}

function tick(){
  if(!audioCtx) return;
  const t = audioCtx.currentTime;
  gain.gain.cancelScheduledValues(t);
  gain.gain.setValueAtTime(0.18, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t+0.05);
}

/***********************
 * DRAW
 ***********************/
function drawWheel(){
  const opts = currentNode.children;
  const N = opts.length;
  const cx = canvas.width/2;
  const cy = canvas.height/2;
  const r = cx*0.85;
  const step = Math.PI*2/N;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(angle);

  const colors = ["#ff2fb9","#00f6ff","#7c3aed"];

  for(let i=0;i<N;i++){
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0,0,r,i*step,(i+1)*step);
    ctx.fillStyle = colors[i%3];
    ctx.fill();
    ctx.strokeStyle="#000";
    ctx.lineWidth=4;
    ctx.stroke();

    ctx.save();
    ctx.rotate(i*step+step/2);
    ctx.fillStyle="white";
    ctx.font="900 30px system-ui";
    ctx.textAlign="right";
    ctx.shadowBlur=15;
    ctx.shadowColor=colors[i%3];
    ctx.fillText(opts[i].label, r*0.9, 10);
    ctx.restore();
  }
  ctx.restore();
}

/***********************
 * UI HELPERS
 ***********************/
function showMid(text){
  midText.textContent = text;
  midResult.classList.add("show");
  setTimeout(()=>midResult.classList.remove("show"), 700);
}

function showFinal(text){
  finalBtn.textContent = text;
  finalScreen.style.display="flex";
}

/***********************
 * SPIN LOGIC
 ***********************/
function spin(){
  if(spinning) return;
  initAudio();

  const opts = currentNode.children;
  if(!opts || opts.length<2) return;

  spinning = true;

  const N = opts.length;
  const step = Math.PI*2/N;
  const extra = Math.PI*2*(14+Math.random()*6);
  const finalAngle = angle - extra;

  const start = angle;
  const startTime = performance.now();
  const duration = 6500;
  let lastTick = 0;

  function anim(now){
    const t = Math.min(1,(now-startTime)/duration);
    angle = start + (finalAngle-start)*(1-Math.pow(1-t,4));
    drawWheel();

    if(now-lastTick > 60 + t*160){
      tick();
      lastTick = now;
    }

    if(t<1){
      requestAnimationFrame(anim);
    }else{
      const normalized = ((-angle-Math.PI/2)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
      const index = Math.floor(normalized/step);
      const chosen = opts[index];

      if(chosen.children){
        showMid(chosen.label);
        currentNode = chosen;
        angle = 0;
        drawWheel();
      }else{
        showFinal(chosen.label);
      }

      spinning = false;
    }
  }
  requestAnimationFrame(anim);
}

/***********************
 * EVENTS
 ***********************/
canvas.addEventListener("click", spin);

finalBtn.addEventListener("click", ()=>{
  finalScreen.style.display="none";
  currentNode = DATA;
  angle = 0;
  drawWheel();
});

/***********************
 * INIT
 ***********************/
drawWheel();
