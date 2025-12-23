/***********************
 * VOLLEDIGE DATA – DE HELE KAART
 ***********************/
const DATA = {
  label: "Drank",
  children: [

    /* 🍺 BIER */
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

    /* 🍷 WIJN */
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
        { label: "Rosé", children: [{ label: "Rosé" }] },
        {
          label: "Speciaal",
          children: [
            { label: "Prosecco 0,20L" },
            { label: "Ruby Port" }
          ]
        }
      ]
    },

    /* 🍹 MIX = Shot → Fris */
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
            { label: "Cranberry Appelsap" },
            { label: "Perensap" },
            { label: "Sinaasappelsap" }
          ]
        }
      ]
    },

    /* 🥃 SHOT (PUUR) */
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

/***********************
 * ELEMENTS / STATE
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
let rootCategoryLabel = null; // bepaalt glowkleur

/***********************
 * PER CATEGORIE GLOW (bruine kroeg tinten)
 ***********************/
const CATEGORY_GLOWS = {
  "Bier": { glow: "#f2b705", glow2: "#c47a2c" },       // bier/amber
  "Wijn": { glow: "#7a1f1f", glow2: "#c47a2c" },       // wijn/amber
  "Mix":  { glow: "#c47a2c", glow2: "#2f3e46" },       // amber/oud blauw
  "Shot": { glow: "#c47a2c", glow2: "#4a2e1f" }        // whiskey/wood
};

function setGlowByRootCategory(label) {
  const g = CATEGORY_GLOWS[label] || { glow:"#c47a2c", glow2:"#f2b705" };
  document.documentElement.style.setProperty("--glow", g.glow);
  document.documentElement.style.setProperty("--glow2", g.glow2);
}

/***********************
 * AUDIO (Safari safe) — “kermis ratel” feeling
 ***********************/
let audioCtx, osc, gain;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  osc = audioCtx.createOscillator();
  gain = audioCtx.createGain();

  // triangle = minder scherp dan square, “mechanischer”
  osc.type = "triangle";
  osc.frequency.value = 900;

  gain.gain.value = 0.0001;

  osc.connect(gain);
  gain.connect(audioCtx.destination); // mono
  osc.start();
}

function tick(intensity = 1) {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const vol = 0.18 * intensity;

  gain.gain.cancelScheduledValues(t);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
}

/***********************
 * DRAW (text visible fix: stroke + fill)
 ***********************/
function segmentColors() {
  // veel verschillende kleuren, duidelijk anders
  return ["#c47a2c", "#f2b705", "#7a1f1f", "#3f5f3a", "#2f3e46", "#4a2e1f"];
}

function drawWheel() {
  const opts = currentNode.children || [];
  const N = opts.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!N) return;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = Math.min(cx, cy) * 0.85;
  const step = (Math.PI * 2) / N;
  const colors = segmentColors();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  for (let i = 0; i < N; i++) {
    const start = i * step;
    const end = start + step;

    // segment fill
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();

    // black separator
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.stroke();

    // label
    const label = opts[i].label;

    ctx.save();
    ctx.rotate(start + step / 2);
    ctx.translate(r * 0.90, 10);

    ctx.font = "900 30px system-ui";
    ctx.textAlign = "right";

    // OUTLINE for visibility
    ctx.lineWidth = 7;
    ctx.strokeStyle = "rgba(0,0,0,.85)";
    ctx.strokeText(label, 0, 0);

    // Fill text
    ctx.fillStyle = "#f4efe9";
    ctx.shadowBlur = 0;
    ctx.fillText(label, 0, 0);

    ctx.restore();
  }

  ctx.restore();
}

/***********************
 * UI helpers
 ***********************/
function showMid(text) {
  midText.textContent = text;
  midResult.classList.add("show");
  setTimeout(() => midResult.classList.remove("show"), 700);
}

function showFinal(text) {
  finalBtn.textContent = text;
  finalScreen.style.display = "flex";
}

/***********************
 * Pointer-correct index from final angle
 ***********************/
function getIndexUnderPointer(N) {
  const step = (Math.PI * 2) / N;
  // pointer is at -PI/2
  const normalized = ((-angle - Math.PI / 2) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
  return Math.floor(normalized / step);
}

/***********************
 * SPIN — big pulse only during spin
 ***********************/
function spin() {
  if (spinning) return;

  initAudio(); // must happen after user gesture; click triggers it
  const opts = currentNode.children;
  if (!opts || opts.length < 2) return;

  spinning = true;
  document.body.classList.add("spinning");

  const N = opts.length;
  const step = (Math.PI * 2) / N;

  // LONG suspense
  const extraSpins = (Math.PI * 2) * (14 + Math.random() * 6); // 14–20
  const finalAngle = angle - extraSpins;

  const start = angle;
  const startTime = performance.now();
  const duration = 7200; // long & slow
  let lastTick = 0;

  function anim(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - t, 4);

    angle = start + (finalAngle - start) * eased;
    drawWheel();

    // carnival tick cadence slows down near end
    if (now - lastTick > 55 + t * 190) {
      // slightly softer near end
      tick(1 - t * 0.25);
      lastTick = now;
    }

    if (t < 1) {
      requestAnimationFrame(anim);
    } else {
      // snap to final to avoid tiny drift
      angle = finalAngle;
      drawWheel();

      const idx = getIndexUnderPointer(N);
      const chosen = opts[idx];

      // root category for glow:
      // if we're at root level, chosen becomes the root category.
      // otherwise keep the first root category selected.
      if (currentNode === DATA) {
        rootCategoryLabel = chosen.label;
      }
      setGlowByRootCategory(rootCategoryLabel);

      if (chosen.children && chosen.children.length) {
        // intermediate step: show briefly, go deeper
        showMid(chosen.label);
        currentNode = chosen;
        angle = 0;
        drawWheel();
      } else {
        // final step: show fullscreen, button resets to start
        showFinal(chosen.label);
      }

      document.body.classList.remove("spinning");
      spinning = false;
    }
  }

  requestAnimationFrame(anim);
}

/***********************
 * EVENTS
 ***********************/
canvas.addEventListener("click", spin);
canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  spin();
}, { passive:false });

finalBtn.addEventListener("click", () => {
  finalScreen.style.display = "none";
  currentNode = DATA;
  rootCategoryLabel = null;
  setGlowByRootCategory(null);
  angle = 0;
  drawWheel();
});

/***********************
 * INIT
 ***********************/
setGlowByRootCategory(null);
drawWheel();
