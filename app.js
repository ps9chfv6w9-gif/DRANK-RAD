/********************
 * DATA – jouw menu
 * (je kunt dit uitbreiden)
 ********************/
const DATA = {
  label: "Drank",
  children: [
    {
      label: "Bier",
      children: [
        { label: "Tapbier", children: [
          { label: "Heineken" },
          { label: "Brand" },
          { label: "Wisseltap" },
          { label: "Heineken 0.0" }
        ]},
        { label: "Flesbier", children: [
          { label: "IJwit" },
          { label: "Zatte" },
          { label: "Duvel" },
          { label: "La Chouffe" }
        ]}
      ]
    },
    {
      label: "Wijn",
      children: [
        { label: "Wit", children: [
          { label: "Pinot Grigio" },
          { label: "Chardonnay" },
          { label: "Sauvignon Blanc" }
        ]},
        { label: "Rood", children: [
          { label: "Merlot" },
          { label: "Rioja" }
        ]},
        { label: "Rosé", children: [{ label: "Rosé" }] }
      ]
    },
    {
      label: "Mix",
      children: [
        { label: "Aperol Spritz" },
        { label: "Moscow Mule" },
        { label: "Dark ’n Stormy" },
        { label: "Gin & Tonic" }
      ]
    },
    {
      label: "Shot",
      children: [
        { label: "Whisky", children: [
          { label: "Jack Daniel’s" },
          { label: "Jameson" },
          { label: "Glenfiddich 12" },
          { label: "Oban 14" }
        ]},
        { label: "Rum", children: [
          { label: "Bacardi" },
          { label: "Havana Club 3" },
          { label: "Kraken" }
        ]},
        { label: "Gin", children: [
          { label: "Beefeater" },
          { label: "Bobby’s" },
          { label: "Bombay Sapphire" },
          { label: "Tanqueray" }
        ]},
        { label: "Vodka", children: [{ label: "Absolut" }] },
        { label: "Likeur", children: [
          { label: "Disaronno" },
          { label: "Baileys" },
          { label: "Sambuca" }
        ]},
        { label: "Tequila/Mezcal", children: [
          { label: "Olmeca Silver" },
          { label: "Nuestra Soledad" }
        ]}
      ]
    }
  ]
};

/********************
 * Helpers
 ********************/
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const crumbEl = document.getElementById("crumb");
const resultEl = document.getElementById("result");
const noteEl = document.getElementById("note");
const itemsEl = document.getElementById("items");
const resetBtn = document.getElementById("resetBtn");

let currentNode = DATA;  // node we are spinning (its children = segments)
let angle = 0;           // wheel rotation (radians)
let spinning = false;

function haptic(ms = 20) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function options(node = currentNode) {
  return Array.isArray(node.children) ? node.children : [];
}

function randInt(n) {
  return Math.floor(Math.random() * n);
}

// Recursively pick a random leaf from a chosen node (auto-dive)
function pickLeaf(node) {
  if (!node.children || node.children.length === 0) return node;
  const child = node.children[randInt(node.children.length)];
  return pickLeaf(child);
}

function setResultText(finalNode, pathLabels) {
  resultEl.classList.remove("shake");
  // force reflow for animation restart
  void resultEl.offsetWidth;
  resultEl.classList.add("shake");

  resultEl.textContent = finalNode.label;
  crumbEl.textContent = `Pad: ${pathLabels.join(" → ")}`;
}

function updateList() {
  const opts = options();
  itemsEl.innerHTML = "";
  opts.forEach((o, i) => {
    const li = document.createElement("li");
    li.className = "chip";
    li.innerHTML = `<span>${o.label}</span><span>#${i+1}</span>`;
    itemsEl.appendChild(li);
  });
}

/********************
 * Drawing (neon wheel)
 ********************/
function drawWheel() {
  const opts = options();
  const N = opts.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!N) return;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = Math.min(cx, cy) * 0.88;

  // outer glow ring
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.arc(0, 0, r + 18, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(34,211,238,.20)";
  ctx.lineWidth = 10;
  ctx.shadowBlur = 30;
  ctx.shadowColor = "rgba(124,58,237,.35)";
  ctx.stroke();
  ctx.restore();

  // wheel
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  const step = (Math.PI * 2) / N;

  for (let i = 0; i < N; i++) {
    const start = i * step;
    const end = start + step;

    // alternating neon-ish segments
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, start, end);
    ctx.closePath();

    ctx.fillStyle = i % 2
      ? "rgba(124,58,237,.18)"
      : "rgba(34,211,238,.14)";
    ctx.fill();

    // segment border
    ctx.strokeStyle = "rgba(255,255,255,.10)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // text
    const label = opts[i].label;
    ctx.save();
    ctx.rotate(start + step / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(247,247,255,.95)";
    ctx.shadowBlur = 16;
    ctx.shadowColor = i % 2 ? "rgba(124,58,237,.35)" : "rgba(34,211,238,.30)";
    ctx.font = "800 30px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.translate(r * 0.90, 10);
    ctx.fillText(label, 0, 0);
    ctx.restore();
  }

  ctx.restore();

  // center cap
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,.06)";
  ctx.fill();
  ctx.shadowBlur = 22;
  ctx.shadowColor = "rgba(34,211,238,.25)";
  ctx.strokeStyle = "rgba(255,255,255,.10)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(247,247,255,.35)";
  ctx.fill();
  ctx.restore();
}

/********************
 * Pointer math
 * Pointer is at top (−90°). We want target segment center to land under it.
 ********************/
function angleForIndexCenter(idx, N) {
  const step = (Math.PI * 2) / N;
  const center = idx * step + step / 2;
  // pointer direction = -PI/2
  return (-Math.PI / 2) - center;
}

/********************
 * Spin animation
 ********************/
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

async function spinOnce() {
  const opts = options();
  const N = opts.length;
  if (spinning || N < 2) return;

  spinning = true;
  noteEl.textContent = "Spinning…";
  haptic(15);

  // choose first level result (category/subcategory level)
  const chosenIndex = randInt(N);
  const base = angleForIndexCenter(chosenIndex, N);

  // add extra spins for fun
  const extra = (Math.PI * 2) * (6 + randInt(3)); // 6..8 full spins
  const finalAngle = base - extra;

  const startAngle = angle;
  const duration = 1700;
  const startTime = performance.now();

  await new Promise(resolve => {
    function frame(now) {
      const t = Math.min(1, (now - startTime) / duration);
      angle = startAngle + (finalAngle - startAngle) * easeOutCubic(t);
      drawWheel();
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });

  // lock in first choice and auto-dive to leaf
  const first = opts[chosenIndex];
  const final = pickLeaf(first);

  // build breadcrumb path
  const pathLabels = [first.label];
  // reconstruct path downwards (best effort)
  (function walk(node) {
    if (!node.children || node.children.length === 0) return;
    const child = node.children[randInt(node.children.length)];
    pathLabels.push(child.label);
    walk(child);
  })(first);

  setResultText(final, pathLabels);
  noteEl.textContent = "Tap opnieuw voor een nieuwe uitkomst";
  haptic(25);

  // After spin, keep wheel at top level (so you always spin categories)
  currentNode = DATA;
  angle = finalAngle; // keep last orientation
  updateList();

  spinning = false;
}

/********************
 * Events
 ********************/
canvas.addEventListener("click", spinOnce);
canvas.addEventListener("touchend", (e) => {
  // prevent “double tap” zoom / extra clicks
  e.preventDefault();
  spinOnce();
}, { passive:false });

resetBtn.addEventListener("click", () => {
  if (spinning) return;
  currentNode = DATA;
  angle = 0;
  crumbEl.textContent = "Pad: (start)";
  resultEl.textContent = "—";
  noteEl.textContent = "1 tap = 1 einddrank";
  updateList();
  drawWheel();
});

/********************
 * Init
 ********************/
updateList();
drawWheel();
