/*************************************************
 * DATA – VOLLEDIGE KAART (ongewijzigd)
 *************************************************/
const DATA = {
  label: "Drank",
  children: [
    {
      label: "Bier",
      children: [
        { label: "Tapbier", children: [
          { label: "Heineken" },
          { label: "Brand" },
          { label: "Eeuwige Jeugd Lellebel" },
          { label: "Texels Skuumkoppe" },
          { label: "Oedipus Gaia" },
          { label: "Wisseltap" },
          { label: "Heineken 0.0" }
        ]},
        { label: "Flesbier", children: [
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
        ]}
      ]
    },
    {
      label: "Wijn",
      children: [
        { label: "Wit", children: [
          { label: "Pinot Grigio" },
          { label: "Chardonnay" },
          { label: "Sauvignon Blanc" },
          { label: "Grüner Veltliner" }
        ]},
        { label: "Rood", children: [
          { label: "Merlot" },
          { label: "Rioja" },
          { label: "Pinot Noir (gekoeld)" }
        ]},
        { label: "Rosé", children: [{ label: "Rosé" }] }
      ]
    },
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
            { label: "Kraken Rum" }
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
    {
      label: "Shot",
      children: [
        { label: "Jack Daniel’s" },
        { label: "Jameson" },
        { label: "Bushmills" },
        { label: "Glenfiddich 12" },
        { label: "Oban 14" },
        { label: "Bacardi" },
        { label: "Kraken Rum" }
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
const resultBig = document.getElementById("resultBig");

let currentNode = DATA;
let path = [];
let angle = 0;
let spinning = false;

/*************************************************
 * DRAW
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
      ? "rgba(255,47,185,.28)"
      : "rgba(0,246,255,.25)";
    ctx.fill();

    ctx.save();
    ctx.rotate(i*step + step/2);
    ctx.fillStyle="white";
    ctx.font="900 30px system-ui";
    ctx.textAlign="right";
    ctx.shadowBlur=22;
    ctx.shadowColor=i%2?"#ff2fb9":"#00f6ff";
    ctx.fillText(opts[i].label, r*0.9, 10);
    ctx.restore();
  }
  ctx.restore();
}

/*************************************************
 * RESULT DISPLAY
 *************************************************/
function showCategory(text){
  resultBig.textContent = text;
  resultBig.classList.add("show");
}

/*************************************************
 * SPIN – LANGER & LANGZAMER
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

  const extraSpins = Math.PI*2 * (14 + Math.random()*6); // VEEL
  const finalAngle = targetAngle - extraSpins;

  const start = angle;
  const startTime = performance.now();
  const duration = 6500; // LANGZAAM & SPANNEND

  function anim(now){
    const t = Math.min(1,(now-startTime)/duration);
    const eased = 1 - Math.pow(1-t,4);
    angle = start + (finalAngle-start)*eased;
    drawWheel();

    if(t<1){
      requestAnimationFrame(anim);
    }else{
      const chosen = opts[choice];
      path.push(chosen);

      // 👉 reset rad naar hoofdrad
      currentNode = DATA;
      angle = 0;
      crumbEl.textContent = path.map(p=>p.label).join(" → ");
      showCategory(chosen.label);

      spinning = false;
      document.body.classList.remove("spinning");
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

/*************************************************
 * INIT
 *************************************************/
drawWheel();
