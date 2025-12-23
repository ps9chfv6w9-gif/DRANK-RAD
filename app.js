/*************************************************
 * VOLLEDIGE DATA – DE HELE KAART (HERSTELD)
 *************************************************/
const DATA = {
  label: "Drank",
  children: [

    // 🍺 BIER
    {
      label: "Bier",
      children: [
        {
          label: "Tapbier",
          children: [
            { label: "Heineken" },
            { label: "Brand" },
            { label: "Eeuwige Jeugd Lellebel" },
            { label: "Texels Skuumkoppe" },
            { label: "Oedipus Gaia" },
            { label: "Wisseltap" },
            { label: "Heineken 0.0" }
          ]
        },
        {
          label: "Flesbier",
          children: [
            { label: "IJwit" },
            { label: "Zatte" },
            { label: "Mannenliefde" },
            { label: "Polyamorie" },
            { label: "Westmalle Dubbel" },
            { label: "Westmalle Tripel" },
            { label: "Duvel" },
            { label: "La Chouffe" },
            { label: "Erdinger" },
            { label: "Mort Subite Kriek" },
            { label: "Corona" }
          ]
        },
        {
          label: "Alcoholvrij",
          children: [
            { label: "Vrijwit 0,5%" },
            { label: "Lowlander Wit 0,0%" },
            { label: "Affligem Blond 0,0%" },
            { label: "Brand IPA 0,0%" },
            { label: "Amstel Radler" },
            { label: "Apple Bandit Cider" }
          ]
        }
      ]
    },

    // 🍷 WIJN
    {
      label: "Wijn",
      children: [
        {
          label: "Wit",
          children: [
            { label: "Pinot Grigio" },
            { label: "Chardonnay" },
            { label: "Sauvignon Blanc" },
            { label: "Grüner Veltliner" }
          ]
        },
        {
          label: "Rood",
          children: [
            { label: "Merlot" },
            { label: "Rioja" },
            { label: "Pinot Noir (gekoeld)" }
          ]
        },
        {
          label: "Rosé",
          children: [{ label: "Rosé" }]
        },
        {
          label: "Speciaal",
          children: [
            { label: "Prosecco 0,20L" },
            { label: "Ruby Port" }
          ]
        }
      ]
    },

    // 🍹 MIX = SHOT + FRIS
    {
      label: "Mix",
      children: [
        {
          label: "Shot",
          children: [
            { label: "Jack Daniel’s" },
            { label: "Jameson" },
            { label: "Bushmills" },
            { label: "Glenfiddich 12" },
            { label: "Oban 14" },
            { label: "Bacardi" },
            { label: "Havana Club 3" },
            { label: "Kraken Rum" },
            { label: "Beefeater Gin" },
            { label: "Bobby’s Gin" },
            { label: "Tanqueray" },
            { label: "Bombay Sapphire" },
            { label: "Absolut Vodka" },
            { label: "Disaronno" },
            { label: "Baileys" },
            { label: "Drambuie" },
            { label: "Sambuca" },
            { label: "Pikketanussie" },
            { label: "Olmeca Silver" },
            { label: "Nuestra Soledad Mezcal" },
            { label: "Martell VS" },
            { label: "Joseph Guyot" }
          ]
        },
        {
          label: "Fris",
          children: [
            { label: "Tonic" },
            { label: "Spa Rood" },
            { label: "Spa Blauw" },
            { label: "Sisi" },
            { label: "7UP" },
            { label: "Cola" },
            { label: "Cola Zero" },
            { label: "Ginger Beer" },
            { label: "Appelsap" },
            { label: "Cranberry-Appelsap" },
            { label: "Perensap" },
            { label: "Sinaasappelsap" }
          ]
        }
      ]
    },

    // 🥃 SHOT (PUUR)
    {
      label: "Shot",
      children: [
        { label: "Jack Daniel’s" },
        { label: "Jameson" },
        { label: "Bushmills" },
        { label: "Glenfiddich 12" },
        { label: "Oban 14" },
        { label: "Bacardi" },
        { label: "Havana Club 3" },
        { label: "Kraken Rum" },
        { label: "Beefeater Gin" },
        { label: "Bobby’s Gin" },
        { label: "Tanqueray" },
        { label: "Bombay Sapphire" },
        { label: "Absolut Vodka" },
        { label: "Disaronno" },
        { label: "Baileys" },
        { label: "Drambuie" },
        { label: "Sambuca" },
        { label: "Pikketanussie" },
        { label: "Olmeca Silver" },
        { label: "Nuestra Soledad Mezcal" },
        { label: "Martell VS" },
        { label: "Joseph Guyot" }
      ]
    }
  ]
};

/*************************************************
 * STATE
 *************************************************/
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const crumbEl = document.getElementById("crumb");
const homeBtn = document.getElementById("homeBtn");
const resultBig = document.getElementById("resultBig");

let currentNode = DATA;
let path = [];
let angle = 0;
let spinning = false;

/*************************************************
 * 🎠 KERMIS TICK GELUID (MONO, ZACHT)
 *************************************************/
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioCtx();

function carnivalTick(volume = 0.15, pitch = 700) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "triangle"; // ronder dan square
  osc.frequency.value = pitch;

  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(audioCtx.destination); // MONO

  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}

/*************************************************
 * DRAW WHEEL
 *************************************************/
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
    ctx.font="900 30px system-ui";
    ctx.textAlign="right";
    ctx.shadowBlur=20;
    ctx.shadowColor=i%2?"#ff2fb9":"#00f6ff";
    ctx.fillText(opts[i].label, r*0.9, 10);
    ctx.restore();
  }
  ctx.restore();
}

/*************************************************
 * EFFECTS
 *************************************************/
function showResult(text){
  resultBig.textContent = text;
  resultBig.classList.add("show");
  setTimeout(()=>resultBig.classList.remove("show"), 900);
}

/*************************************************
 * SPIN — LANGER, SPANNENDER
 *************************************************/
function spin(){
  if(spinning) return;
  const opts = currentNode.children;
  if(!opts || opts.length < 2) return;

  spinning = true;
  document.body.classList.add("spinning");

  const choice = Math.floor(Math.random()*opts.length);
  const step = Math.PI*2/opts.length;
  const targetAngle = (-Math.PI/2)-(choice*step+step/2);

  // 🔥 VEEL LANGER DOORDRAAIEN
  const extraSpins = Math.PI*2 * (10 + Math.random()*6); // 10–16 rondes
  const finalAngle = targetAngle - extraSpins;

  const start = angle;
  const startTime = performance.now();
  const duration = 4200; // veel langer
  let lastTick = 0;

  function anim(now){
    const t = Math.min(1,(now-startTime)/duration);
    const eased = 1 - Math.pow(1-t,4);
    angle = start + (finalAngle-start)*eased;
    drawWheel();

    // 🎠 tick timing (vertraagt richting einde)
    if(now - lastTick > 40 + t*140){
      carnivalTick(0.12, 900 - t*400);
      lastTick = now;
    }

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

/*************************************************
 * EVENTS
 *************************************************/
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

/*************************************************
 * INIT
 *************************************************/
drawWheel();
