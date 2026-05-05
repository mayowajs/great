// ── Floating hearts background ────────────────────────────────
const heartsBg = document.getElementById("heartsBg");
const heartChars = ["💗","💓","💕","💖","💘","💝","🌸","✨","💞","🩷"];

for (let i = 0; i < 18; i++) {
  const h = document.createElement("div");
  h.className = "heart-float";
  h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = (0.8 + Math.random() * 1.4) + "rem";
  h.style.animationDuration = (8 + Math.random() * 14) + "s";
  h.style.animationDelay = (Math.random() * 10) + "s";
  heartsBg.appendChild(h);
}

// ── Compatibility tiers ────────────────────────────────────────
const TIERS = [
  {
    min: 80, max: 100, key: "love",
    emoji: "❤️🔥", label: "LOVE",
    messages: [
      "You two are written in the stars! This is a rare, powerful connection that's hard to find.",
      "Soulmate energy detected! Your names vibrate at the same frequency of love.",
      "This is the real deal — deep love, strong bond, and an unbreakable connection.",
    ]
  },
  {
    min: 60, max: 79, key: "affection",
    emoji: "💗", label: "AFFECTION",
    messages: [
      "There's a strong pull between you two. Deep affection and genuine care define this bond.",
      "You share a beautiful connection — warm, caring, and full of sweet moments.",
      "Strong feelings are in the air! This could easily blossom into something deeper.",
    ]
  },
  {
    min: 50, max: 59, key: "friends",
    emoji: "💛", label: "FRIENDS / SIBLINGS",
    messages: [
      "You're close like family — comfortable, familiar, and always there for each other.",
      "More like best friends or siblings. The bond is real, just not romantic.",
      "A solid, warm connection — think of it as a friendship that stands the test of time.",
    ]
  },
  {
    min: 40, max: 49, key: "bad",
    emoji: "🩶", label: "BAD FRIENDS",
    messages: [
      "There's tension here. You might clash more than you connect — tread carefully.",
      "Not the best match. Differences may cause friction and misunderstandings.",
      "This pairing has some rough edges. It takes real effort to make it work.",
    ]
  },
  {
    min: 0, max: 39, key: "enemy",
    emoji: "💔", label: "ENEMIES",
    messages: [
      "Opposites in every way — this combination sparks more conflict than connection.",
      "The stars say no on this one. Your energies clash at a fundamental level.",
      "A challenging match. Strong personalities pulling in completely different directions.",
    ]
  },
];

// ── Core algorithm ─────────────────────────────────────────────
// Uses 4 factors: letter frequency overlap, vowel harmony,
// combined name digit reduction, and length ratio
// ── Loading phases ───────────────────────────────────────────
const LOADING_PHASES = [
  "Analysing names...",
  "Checking letter chemistry...",
  "Measuring vowel harmony...",
  "Calculating name energy...",
  "Reading the stars...",
  "Almost there...",
  "Revealing your result! 💘",
];

function calculateMatch() {
  const n1 = document.getElementById("name1").value.trim();
  const n2 = document.getElementById("name2").value.trim();

  if (!n1 || !n2) {
    shake(n1 ? "name2" : "name1");
    return;
  }

  const a = n1.toLowerCase().replace(/[^a-z]/g, "");
  const b = n2.toLowerCase().replace(/[^a-z]/g, "");

  // Factor 1: shared letter ratio (0–100)
  const setA = new Set(a);
  const setB = new Set(b);
  const shared = [...setA].filter(c => setB.has(c)).length;
  const union  = new Set([...setA, ...setB]).size;
  const letterScore = Math.round((shared / union) * 100);

  // Factor 2: vowel harmony (0–100)
  const vowels = new Set("aeiou");
  const vowA = [...a].filter(c => vowels.has(c)).length / a.length;
  const vowB = [...b].filter(c => vowels.has(c)).length / b.length;
  const vowelScore = Math.round(100 - Math.abs(vowA - vowB) * 100);

  // Factor 3: name digit reduction (0–100)
  const combined = (n1 + n2).toLowerCase().replace(/[^a-z]/g, "");
  let digitSum = [...combined].reduce((s, c) => s + (c.charCodeAt(0) - 96), 0);
  while (digitSum > 9) {
    digitSum = String(digitSum).split("").reduce((s, d) => s + parseInt(d), 0);
  }
  const digitScore = Math.round((digitSum / 9) * 100);

  // Factor 4: name length compatibility (0–100)
  const longer  = Math.max(a.length, b.length);
  const shorter = Math.min(a.length, b.length);
  const lengthScore = Math.round((shorter / longer) * 100);

  // Love bonus — based on first letters and last letters pairing
  const firstBonus = (a[0].charCodeAt(0) + b[0].charCodeAt(0)) % 20;
  const lastBonus  = (a[a.length-1].charCodeAt(0) + b[b.length-1].charCodeAt(0)) % 20;
  const loveBonus  = Math.round(((firstBonus + lastBonus) / 40) * 100);

  // Weighted final score
  const raw = Math.round(
    letterScore * 0.20 +
    vowelScore  * 0.30 +
    digitScore  * 0.25 +
    lengthScore * 0.10 +
    loveBonus   * 0.15
  );
  const score = Math.min(100, Math.round(raw * 1.15 + 8));

  // ── Show loading animation first ──
  const loadingWrap = document.getElementById("loadingWrap");
  const loadingText = document.getElementById("loadingText");
  const resultWrap  = document.getElementById("resultWrap");
  const matchBtn    = document.querySelector(".match-btn");

  // Hide result, show loader
  resultWrap.classList.remove("show");
  loadingWrap.classList.add("show");
  matchBtn.disabled = true;
  matchBtn.style.opacity = ".6";
  loadingWrap.scrollIntoView({ behavior: "smooth", block: "nearest" });

  // Roll through loading phases
  let phase = 0;
  loadingText.textContent = LOADING_PHASES[0];
  const phaseInterval = setInterval(() => {
    phase++;
    if (phase < LOADING_PHASES.length) {
      loadingText.style.opacity = "0";
      setTimeout(() => {
        loadingText.textContent = LOADING_PHASES[phase];
        loadingText.style.opacity = "1";
      }, 200);
    }
  }, 520);

  // After full duration reveal result
  setTimeout(() => {
    clearInterval(phaseInterval);
    loadingWrap.classList.remove("show");
    matchBtn.disabled = false;
    matchBtn.style.opacity = "1";
    showResult(n1, n2, score, { letterScore, vowelScore, digitScore, lengthScore });
  }, LOADING_PHASES.length * 520 + 200);
}

// ── Show result ────────────────────────────────────────────────
function showResult(n1, n2, score, breakdown) {
  const tier = TIERS.find(t => score >= t.min && score <= t.max);
  const msg  = tier.messages[Math.floor(Math.random() * tier.messages.length)];

  // Names display
  document.getElementById("resultNames").innerHTML =
    `<span>${n1}</span> &nbsp;💕&nbsp; <span>${n2}</span>`;

  // Animate meter
  setTimeout(() => {
    document.getElementById("meterFill").style.width = score + "%";
  }, 100);

  // Animate percent counter
  animateCount(score);

  // Heart icon by tier
  const hearts = { love:"❤️", affection:"💗", friends:"💛", bad:"🩶", enemy:"💔" };
  document.getElementById("heartIcon").textContent = hearts[tier.key];

  // Result card
  const card = document.getElementById("resultCard");
  card.className = "result-card " + tier.key;
  document.getElementById("resultEmoji").textContent   = tier.emoji;
  document.getElementById("resultTier").textContent    = tier.label;
  document.getElementById("resultMessage").textContent = msg;

  // Breakdown bars
  const items = [
    { label: "Letter Match",    val: breakdown.letterScore },
    { label: "Vowel Harmony",   val: breakdown.vowelScore  },
    { label: "Name Energy",     val: breakdown.digitScore  },
    { label: "Name Balance",    val: breakdown.lengthScore },
  ];
  document.getElementById("breakdown").innerHTML = `
    <h4>Score Breakdown</h4>
    <div class="breakdown-items">
      ${items.map(i => `
        <div class="b-item">
          <span class="b-label">${i.label}</span>
          <div class="b-bar-wrap"><div class="b-bar" style="width:0%" data-w="${i.val}%"></div></div>
          <span class="b-val">${i.val}%</span>
        </div>`).join("")}
    </div>`;

  // Animate breakdown bars after render
  setTimeout(() => {
    document.querySelectorAll(".b-bar").forEach(bar => {
      bar.style.width = bar.dataset.w;
    });
  }, 200);

  // Show result section
  const wrap = document.getElementById("resultWrap");
  wrap.classList.add("show");
  wrap.scrollIntoView({ behavior: "smooth", block: "nearest" });

  // Burst hearts if love
  if (tier.key === "love") burstHearts();
}

// ── Animate percent counter ────────────────────────────────────
function animateCount(target) {
  const el = document.getElementById("percentDisplay");
  let current = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + "%";
    if (current >= target) clearInterval(timer);
  }, 22);
}

// ── Burst hearts animation on love result ─────────────────────
function burstHearts() {
  for (let i = 0; i < 12; i++) {
    const h = document.createElement("div");
    h.style.cssText = `
      position:fixed; font-size:${1.2 + Math.random()}rem;
      left:${20 + Math.random() * 60}vw;
      top:${20 + Math.random() * 60}vh;
      pointer-events:none; z-index:999;
      animation: burstFly .9s ease forwards;
      animation-delay:${i * 0.06}s;
    `;
    h.textContent = ["❤️","💕","💗","✨","💖"][Math.floor(Math.random() * 5)];
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1200 + i * 60);
  }
}

// Inject burst keyframe once
const style = document.createElement("style");
style.textContent = `@keyframes burstFly {
  0%   { transform: scale(0) translateY(0);   opacity: 1; }
  60%  { transform: scale(1.4) translateY(-40px); opacity: 1; }
  100% { transform: scale(0.8) translateY(-80px); opacity: 0; }
}`;
document.head.appendChild(style);

// ── Shake invalid input ────────────────────────────────────────
function shake(id) {
  const el = document.getElementById(id);
  el.style.borderColor = "#ff4d8d";
  el.style.animation = "none";
  el.focus();
  setTimeout(() => {
    el.style.animation = "";
    el.style.borderColor = "";
  }, 600);
}

// ── Clear result when names change ────────────────────────────
function clearResult() {
  const wrap = document.getElementById("resultWrap");
  const loader = document.getElementById("loadingWrap");
  if (wrap.classList.contains("show")) {
    wrap.classList.remove("show");
    document.getElementById("meterFill").style.width = "0%";
    document.getElementById("percentDisplay").textContent = "0%";
  }
  loader.classList.remove("show");
}

// ── Try again ─────────────────────────────────────────────────
function tryAgain() {
  document.getElementById("name1").value = "";
  document.getElementById("name2").value = "";
  clearResult();
  document.getElementById("name1").focus();
}

// ── Enter key triggers calculate ──────────────────────────────
document.addEventListener("keydown", e => {
  if (e.key === "Enter") calculateMatch();
});
