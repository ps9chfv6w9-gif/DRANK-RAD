/***********************
 * DATA (ingekort hier – 
 * gebruik jouw volledige kaart,
 * structuur blijft hetzelfde)
 ***********************/
const DATA = {
  label:"Drank",
  children:[
    {label:"Bier", children:[{label:"Heineken"},{label:"Brand"}]},
    {label:"Wijn", children:[{label:"Wit"},{label:"Rood"}]},
    {label:"Mix", children:[{label:"Shot"},{label:"Fris"}]},
    {label:"Shot", children:[{label:"Jameson"},{label:"Vodka"}]}
  ]
};

/***********************
 * STATE
 ***********************/
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const resultBtn = document.getElementById("resultBtn");

let angle = 0;
let spinning = false;
let currentNode = DATA;

/***********************
 * AUDIO – STABIELE RATTLE
 ***********************/
const audioCtx = new (window.AudioContext||window.webkitAudioContext)();
const osc = audioCtx.createOscillator();
const gain = audioCtx.createGain();
osc.type = "triangle";
osc.frequency.value = 900;
gain.gain.value = 0;
osc.connect(gain);
gain.connect(audioCtx.destination);
osc.start();

function tick(){
  const t = audioCtx.currentTime;
  gain.gain.cancelScheduledValues(t);
  gain.gain.setValueAtTime(0.15, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t+0.05);
}

/***********************
 * DRAW WHEEL
 ***********************/
function drawWheel(){
  const opts = currentNode.children;
  const N = opts.length;
  const cx = canvas.width/2;
  const cy = canvas.height/2;
  const r = cx*0.85;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(angle);

  const colors = ["#ff2fb9","#00f6ff","#7c3aed"];
  const step = Math.PI*2/N;

  for(let i=0;i<N;i++){
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0,0,r,i*step,(i+1)*step);
    ctx.closePath();

    ctx.fillStyle = colors[i%3];
    ctx.fill();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.save();
    ctx.rotate(i*step + step/2);
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
 * POINTER-CORRECT SPIN
 ***********************/
function spin(){
  if(spinning) return;
  spinning = true;
  document.body.classList.add("spinning");

  const N = currentNode.children.length;
  const step = Math.PI*2/N;

  const extra = Math.PI*2*(16+Math.random()*6);
  const finalAngle = angle - extra;

  const start = angle;
  const duration = 7000;
  const startTime = performance.now();
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
      // 🔥 EXACT SEGMENT ONDER PIJL
      const normalized = ((-angle - Math.PI/2)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
      const index = Math.floor(normalized/step);
      const chosen = currentNode.children[index];

      resultBtn.textContent = chosen.label;
      currentNode = DATA;
      angle = 0;

      spinning = false;
      document.body.classList.remove("spinning");
      drawWheel();
    }
  }
  requestAnimationFrame(anim);
}

/***********************
 * EVENTS
 ***********************/
canvas.addEventListener("click", spin);
resultBtn.addEventListener("click", ()=>{
  resultBtn.textContent = "";
});
drawWheel();
