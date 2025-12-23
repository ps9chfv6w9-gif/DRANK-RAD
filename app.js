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

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const crumb = document.getElementById("crumb");
const result = document.getElementById("result");
const items = document.getElementById("items");

let current = DATA;
let angle = 0;

function draw() {
  const opts = current.children || [];
  const n = opts.length;
  if (!n) return;

  const r = canvas.width / 2;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();
  ctx.translate(r, r);
  ctx.rotate(angle);

  const step = Math.PI * 2 / n;
  for (let i=0;i<n;i++) {
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0,0,r,i*step,(i+1)*step);
    ctx.fillStyle = i%2 ? "#1f1f35" : "#2a2a4a";
    ctx.fill();

    ctx.save();
    ctx.rotate(i*step + step/2);
    ctx.fillStyle="white";
    ctx.textAlign="right";
    ctx.font="18px system-ui";
    ctx.fillText(opts[i].label, r*0.85, 6);
    ctx.restore();
  }
  ctx.restore();
}

function updateUI() {
  crumb.textContent = current.label;
  items.innerHTML = "";
  (current.children||[]).forEach(c=>{
    const li=document.createElement("li");
    li.textContent=c.label;
    items.appendChild(li);
  });
}

spinBtn.onclick = () => {
  const opts = current.children;
  if (!opts) return;

  const i = Math.floor(Math.random()*opts.length);
  angle += Math.PI*6;
  draw();

  setTimeout(()=>{
    current = opts[i];
    result.textContent = current.label;
    angle = 0;
    updateUI();
    draw();
  },800);
};

updateUI();
draw();
