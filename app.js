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
            { label: "Bacardi" },
            { label: "Havana Club 3" },
            { label: "Donkere Rum" },
            { label: "Beefeater Gin" },
            { label: "Bobby’s Gin" },
            { label: "Vodka" },
            { label: "Disaronno" },
            { label: "Baileys" },
            { label: "Drambuie" },
            { label: "Sambuca" },
            { label: "Olmeca Silver" },
            { label: "Mezcal" },
            { label: "Martell VS" },
            { label: "Joseph Guy" }
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

let rootCategoryLabel = null; // bepaalt glowkleur (Bier/Wijn/Mix/Shot)
let mixDraft = null;          // { shot: "...", fris: "..." }

/***********************
 * PER CATEGORIE GLOW (bruine kroeg tinten)
 ***********************/
const CATEGORY_GLOWS = {
  "Bier": { glow: "#f2b705", glow2: "#c47a2c" }, // bier/amber
  "Wijn": { glow: "#7a1f1f", glow2: "#c47a2c" }, // wijn/amber
  "Mix":  { glow: "#c47a2c", glow2: "#2f3e46" }, // amber/oud blauw
  "Shot": { glow: "#c47a2c", glow2: "#4a2e1f" }  // whiskey/wood
};

function setGlowByRootCategory(label) {
  const g = CATEGORY_GLOWS[label] || { glow: "#c47a2c", glow2: "#f2b705" };
  document.documentElement.style.setProperty("--glow", g.glow);
  document.documentElement.style.setProperty("--glow2", g.glow2);
}

/***********************
 * AUDIO (Safari safe) — “kermis ratel”
 ***********************/
let audioCtx, osc, gain;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  osc = audioCtx.createOscillator();
  gain = audioCtx.createGain();

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
 * HELPERS (Mix flow)
 ***********************/
function findChildByLabel(node, label) {
  const kids = node?.children || [];
  return kids.find(k => k.label === label) || null;
}

function goToMixStep(stepLabel) {
  const mixNode = findChildByLabel(DATA, "Mix");
  if (!mixNode) return;

  const stepNode = findChildByLabel(mixNode, stepLabel);
  if (!stepNode) return;

  currentNode = stepNode;
  angle = 0;
  drawWheel();
}

/***********************
 * DRAW (text visible: outline + fill)
 ***********************/
function segmentColors() {
  // veel verschillende kleuren, duidelijk anders (bruine kroeg vibe)
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

    // segment
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();

    // black separators
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

    // outline
    ctx.lineWidth = 7;
    ctx.strokeStyle = "rgba(0,0,0,.85)";
    ctx.strokeText(label, 0, 0);

    // fill
    ctx.fillStyle = "#f4efe9";
    ctx.shadowBlur = 0;
    ctx.fillText(label, 0, 0);

    ctx.restore();
  }

  ctx.restore();
}

/***********************
 * UI
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
  const normalized = ((-angle - Math.PI / 2) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
  return Math.floor(normalized / step);
}

/***********************
 * SPIN
 ***********************/
function spin() {
  if (spinning) return;

  initAudio();
  const opts = currentNode.children;
  if (!opts || opts.length < 2) return;

  spinning = true;
  document.body.classList.add("spinning");

  const N = opts.length;
  const extraSpins = (Math.PI * 2) * (14 + Math.random() * 6);
  const finalAngle = angle - extraSpins;

  const start = angle;
  const startTime = performance.now();
  const duration = 7200;
  let lastTick = 0;

  function anim(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - t, 4);

    angle = start + (finalAngle - start) * eased;
    drawWheel();

    if (now - lastTick > 55 + t * 190) {
      tick(1 - t * 0.25);
      lastTick = now;
    }

    if (t < 1) {
      requestAnimationFrame(anim);
      return;
    }

    // ensure final is consistent with pointer math
    angle = finalAngle;
    drawWheel();

    const idx = getIndexUnderPointer(N);
    const chosen = opts[idx];

    // set root category label when spinning at root
    if (currentNode === DATA) rootCategoryLabel = chosen.label;
    setGlowByRootCategory(rootCategoryLabel);

    const isLeaf = !chosen.children || chosen.children.length === 0;
    const inMixFlow = (rootCategoryLabel === "Mix");

    // --- MIX FLOW ---
    // A) Root chooses "Mix" -> go to Mix > Shot
    if (currentNode === DATA && chosen.label === "Mix") {
      mixDraft = { shot: null, fris: null };
      showMid("Mix → Shot");
      goToMixStep("Shot");
      cleanupSpin();
      return;
    }

    // B) In Mix > Shot: choose a leaf shot -> go to Mix > Fris
    if (inMixFlow && currentNode.label === "Shot" && isLeaf) {
      mixDraft = mixDraft || { shot: null, fris: null };
      mixDraft.shot = chosen.label;

      showMid(`${chosen.label} → Fris`);
      goToMixStep("Fris");
      cleanupSpin();
      return;
    }

    // C) In Mix > Fris: choose a leaf fris -> show final "shot + fris"
    if (inMixFlow && currentNode.label === "Fris" && isLeaf) {
      mixDraft = mixDraft || { shot: "Shot", fris: null };
      mixDraft.fris = chosen.label;

      showFinal(`${mixDraft.shot} + ${mixDraft.fris}`);
      mixDraft = null;

      cleanupSpin();
      return;
    }

    // If for some reason we end up in Mix nodes ("Shot"/"Fris") but chosen has children,
    // continue deeper normally.
    // --- NORMAL FLOW ---
    if (!isLeaf) {
      showMid(chosen.label);
      currentNode = chosen;
      angle = 0;
      drawWheel();
    } else {
      showFinal(chosen.label);
    }

    cleanupSpin();
  }

  function cleanupSpin() {
    document.body.classList.remove("spinning");
    spinning = false;
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
}, { passive: false });

finalBtn.addEventListener("click", () => {
  finalScreen.style.display = "none";
  currentNode = DATA;
  rootCategoryLabel = null;
  mixDraft = null;
  setGlowByRootCategory(null);
  angle = 0;
  drawWheel();
});

/***********************
 * INIT
 ***********************/
setGlowByRootCategory(null);
drawWheel();
