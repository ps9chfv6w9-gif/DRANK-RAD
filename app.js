/********************
 * DATA – volledige kaart
 ********************/
const DATA = {
  label: "Drank",
  children: [
    { label: "Bier", children: [
      { label: "Tapbier", children: [
        { label: "Heineken" },
        { label: "Brand" },
        { label: "Wisseltap" }
      ]},
      { label: "Flesbier", children: [
        { label: "IJwit" },
        { label: "Zatte" },
        { label: "Duvel" }
      ]}
    ]},
    { label: "Wijn", children: [
      { label: "Wit", children: [
        { label: "Pinot Grigio" },
        { label: "Chardonnay" }
      ]},
      { label: "Rood", children: [
        { label: "Merlot" },
        { label: "Rioja" }
      ]}
    ]},
    { label: "Mix", children: [
      { label: "Aperol Spritz" },
      { label: "Moscow Mule" },
      { label: "Dark ’n Stormy" }
    ]},
    { label: "Shot", children: [
      { label: "Whisky", children: [
        { label: "Jack Daniel’s" },
        { label: "Jameson" }
      ]},
      { label: "Rum", children: [
        { label: "Kraken" }
      ]}
    ]}
  ]
};

/********************
 * STATE
 ********************/
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const crumbEl = document.getElementById("crumb");
const homeBtn = document.getElementById("homeBtn");
const resultBig = document.getElementById("resultBig");

let currentNode = DATA;
let path = [];
let angle = 0;
let spinning = false;

/********************
 * DRAW
 ********************/
function drawWheel(){
  const opts = currentNode.children || [];
  const N = opts.length;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(!N) return;

  const cx = canvas.width/2;
  const cy = canvas.height/2;
  const r = cx*0.88;
  const step = Math.PI*2/N;

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(angle);

  for(let i=0;i<N;i++){
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0,0,r,i*step,(i+1)*step);
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
    ctx.shadowColor=i%2?"#ff2fb9":"#00f6ff";
    ctx.fillText(opts[i].label, r*0.9, 10);
    ctx.restore();
  }

  ctx.restore();
}

/********************
 * EFFECTS
 ********************/
function showResult(text){
  resultBig.textContent = text;
  resultBig.classList.add("show");

  const b = document.createElement("div");
  b.className = "burst";
  b.style.left = "50%";
  b.style.top = "50%";
  document.body.appendChild(b);
  setTimeout(()=>b.remove(),600);

  setTimeout(()=>{
    resultBig.classList.remove("show");
  },700);
}

/********************
 * SPIN
 ********************/
function spin(){
  if(spinning) return;
  const opts = currentNode.children;
  if(!opts || opts.length < 2) return;

  spinning = true;
  document.body.classList.add("spinning");

  const choice = Math.floor(Math.random()*opts.length);
  const step = Math.PI*2/opts.length;
  const targetAngle = (-Math.PI/2)-(choice*step+step/2);
  const finalAngle = targetAngle - Math.PI*2*(6+Math.random()*2);

  const start = angle;
  const startTime = performance.now();
  const duration = 1600;

  function anim(now){
    const t = Math.min(1,(now-startTime)/duration);
    angle = start + (finalAngle-start)*(1-Math.pow(1-t,3));
    drawWheel();

    if(t<1){
      requestAnimationFrame(anim);
    }else{
      const chosen = opts[choice];
      path.push(chosen);
      currentNode = chosen;

      crumbEl.textContent = path.map(p=>p.label).join(" → ");
      showResult(chosen.label);

      document.body.classList.remove("spinning");
      spinning = false;
      drawWheel();
    }
  }
  requestAnimationFrame(anim);
}

/********************
 * EVENTS
 ********************/
canvas.addEventListener("click", spin);
canvas.addEventListener("touchend", e=>{
  e.preventDefault();
  spin();
},{passive:false});

homeBtn.addEventListener("click", ()=>{
  currentNode = DATA;
  path = [];
  angle = 0;
  crumbEl.textContent = "Hoofdmenu";
  drawWheel();
});

/********************
 * INIT
 ********************/
drawWheel();
