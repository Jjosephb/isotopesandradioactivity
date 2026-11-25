/* ==========================================================================
   1.6 Isotopes & Radioactive Decay — Interactive Presentation Engine
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. SLIDE NAVIGATION, THEME, MODALS & REVEALS
     ------------------------------------------------------------------------ */
  const slides = Array.from(document.querySelectorAll(".slide"));
  const progressFill = document.getElementById("progressFill");
  const slideCounter = document.getElementById("slideCounter");
  const slideDotsWrap = document.getElementById("slideDots");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const btnTheme = document.getElementById("btnTheme");
  const themeIcon = document.getElementById("themeIcon");
  const btnFullscreen = document.getElementById("btnFullscreen");
  const btnOverview = document.getElementById("btnOverview");
  const btnPeriodicTable = document.getElementById("btnPeriodicTable");
  const overviewModal = document.getElementById("overviewModal");
  const overviewGrid = document.getElementById("overviewGrid");
  const periodicModal = document.getElementById("periodicModal");
  const ptableGrid = document.getElementById("ptableGrid");

  let currentSlide = 0;

  function getThemeColors() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    return {
      isLight,
      bg: isLight ? "#eef2f8" : "#1b2744",
      text: isLight ? "#0f172a" : "#f1f5f9",
      muted: isLight ? "#475569" : "#94a3b8",
      ring: isLight ? "rgba(15, 23, 42, 0.22)" : "rgba(148, 163, 184, 0.28)",
      proton: isLight ? "#dc2626" : "#f87171",
      protonDark: isLight ? "#991b1b" : "#b91c1c",
      neutron: isLight ? "#64748b" : "#cbd5e1",
      neutronDark: isLight ? "#334155" : "#64748b",
      electron: isLight ? "#0284c7" : "#38bdf8",
      alpha: isLight ? "#d97706" : "#f59e0b",
      beta: isLight ? "#0891b2" : "#06b6d4",
      gamma: isLight ? "#9333ea" : "#c084fc",
      stable: isLight ? "#059669" : "#34d399",
      unstable: isLight ? "#e11d48" : "#fb7185"
    };
  }

  // Build bottom dots & overview grid
  slides.forEach((slide, idx) => {
    const dot = document.createElement("button");
    dot.className = "dot" + (idx === 0 ? " active" : "");
    dot.title = `${idx + 1}. ${slide.dataset.title || ""}`;
    dot.addEventListener("click", () => goToSlide(idx));
    slideDotsWrap.appendChild(dot);

    const card = document.createElement("button");
    card.className = "ov-card" + (idx === 0 ? " current" : "");
    card.innerHTML = `<span class="ov-num">Slide ${idx + 1}</span><div class="ov-title">${slide.dataset.title || ""}</div>`;
    card.addEventListener("click", () => {
      goToSlide(idx);
      overviewModal.classList.add("hidden");
    });
    overviewGrid.appendChild(card);
  });

  function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    slides[currentSlide].classList.remove("active");
    currentSlide = index;
    slides[currentSlide].classList.add("active");
    slides[currentSlide].scrollTop = 0;

    const pct = ((currentSlide + 1) / slides.length) * 100;
    progressFill.style.width = pct + "%";
    slideCounter.textContent = `${currentSlide + 1} / ${slides.length}`;

    btnPrev.disabled = currentSlide === 0;
    btnNext.disabled = currentSlide === slides.length - 1;

    Array.from(slideDotsWrap.children).forEach((d, i) => d.classList.toggle("active", i === currentSlide));
    Array.from(overviewGrid.children).forEach((c, i) => c.classList.toggle("current", i === currentSlide));
  }

  btnPrev.addEventListener("click", () => goToSlide(currentSlide - 1));
  btnNext.addEventListener("click", () => goToSlide(currentSlide + 1));

  // Theme toggle
  btnTheme.addEventListener("click", () => {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") !== "light";
    html.setAttribute("data-theme", isDark ? "light" : "dark");
    themeIcon.textContent = isDark ? "🌙" : "☀";
    btnTheme.querySelector(".btn-label").textContent = isDark ? "Dark" : "Light";
  });

  // Fullscreen toggle
  btnFullscreen.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Modals
  btnOverview.addEventListener("click", () => overviewModal.classList.toggle("hidden"));
  btnPeriodicTable.addEventListener("click", () => periodicModal.classList.toggle("hidden"));

  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById(btn.dataset.close).classList.add("hidden");
    });
  });

  [overviewModal, periodicModal].forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  });

  // Keyboard shortcuts (ignore while typing in inputs)
  document.addEventListener("keydown", (e) => {
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    } else if (e.key === "g" || e.key === "G") {
      overviewModal.classList.toggle("hidden");
    } else if (e.key === "p" || e.key === "P") {
      periodicModal.classList.toggle("hidden");
    } else if (e.key === "l" || e.key === "L") {
      btnTheme.click();
    } else if (e.key === "f" || e.key === "F") {
      btnFullscreen.click();
    } else if (e.key === "Escape") {
      overviewModal.classList.add("hidden");
      periodicModal.classList.add("hidden");
    }
  });

  // Reveal-answer buttons on Worksheet slides
  document.querySelectorAll(".reveal-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.reveal);
      const isOpen = target.classList.toggle("open");
      btn.textContent = isOpen ? "Hide Steps" : "Reveal Steps";
    });
  });

  // Teacher Key Gate & Tabs (Slide 16)
  const keyGate = document.getElementById("keyGate");
  const keyDashboard = document.getElementById("keyDashboard");
  document.getElementById("btnUnlockKey").addEventListener("click", () => {
    keyGate.classList.add("hidden");
    keyDashboard.classList.remove("hidden");
  });
  document.getElementById("btnLockKey").addEventListener("click", () => {
    keyDashboard.classList.add("hidden");
    keyGate.classList.remove("hidden");
  });

  document.querySelectorAll(".tab-btn").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  /* ------------------------------------------------------------------------
     2. MINI PERIODIC TABLE REFERENCE (All Lesson & Worksheet Elements)
     ------------------------------------------------------------------------ */
  const REFERENCE_ELEMENTS = [
    { z: 2, sym: "He", name: "Helium" },
    { z: 3, sym: "Li", name: "Lithium" },
    { z: 4, sym: "Be", name: "Beryllium" },
    { z: 5, sym: "B", name: "Boron" },
    { z: 6, sym: "C", name: "Carbon" },
    { z: 7, sym: "N", name: "Nitrogen" },
    { z: 8, sym: "O", name: "Oxygen" },
    { z: 9, sym: "F", name: "Fluorine" },
    { z: 11, sym: "Na", name: "Sodium" },
    { z: 16, sym: "S", name: "Sulfur" },
    { z: 19, sym: "K", name: "Potassium" },
    { z: 20, sym: "Ca", name: "Calcium" },
    { z: 24, sym: "Cr", name: "Chromium" },
    { z: 25, sym: "Mn", name: "Manganese" },
    { z: 27, sym: "Co", name: "Cobalt" },
    { z: 38, sym: "Sr", name: "Strontium" },
    { z: 39, sym: "Y", name: "Yttrium" },
    { z: 43, sym: "Tc", name: "Technetium" },
    { z: 46, sym: "Pd", name: "Palladium" },
    { z: 53, sym: "I", name: "Iodine" },
    { z: 54, sym: "Xe", name: "Xenon" },
    { z: 55, sym: "Cs", name: "Caesium" },
    { z: 81, sym: "Tl", name: "Thallium" },
    { z: 82, sym: "Pb", name: "Lead" },
    { z: 83, sym: "Bi", name: "Bismuth" },
    { z: 84, sym: "Po", name: "Polonium" },
    { z: 86, sym: "Rn", name: "Radon" },
    { z: 88, sym: "Ra", name: "Radium" },
    { z: 90, sym: "Th", name: "Thorium" },
    { z: 92, sym: "U", name: "Uranium" },
    { z: 93, sym: "Np", name: "Neptunium" },
    { z: 94, sym: "Pu", name: "Plutonium" },
    { z: 95, sym: "Am", name: "Americium" }
  ];

  REFERENCE_ELEMENTS.forEach((el) => {
    const tile = document.createElement("button");
    tile.className = "pt-tile";
    tile.innerHTML = `<div class="pt-z">${el.z}</div><div class="pt-sym">${el.sym}</div><div class="pt-name">${el.name}</div>`;
    tile.addEventListener("click", () => tile.classList.toggle("highlighted"));
    ptableGrid.appendChild(tile);
  });

  /* ------------------------------------------------------------------------
     3. HELPER: DRAW NUCLEON SPHERE & PHYLLOTAXIS NUCLEUS
     ------------------------------------------------------------------------ */
  function drawSphere(ctx, x, y, r, colorLight, colorDark) {
    const grad = ctx.createRadialGradient(x - r * 0.32, y - r * 0.32, r * 0.12, x, y, r);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.28, colorLight);
    grad.addColorStop(1, colorDark);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  function generateNucleonLayout(pCount, nCount, spacing) {
    const total = pCount + nCount;
    const types = [];
    // Interleave protons and neutrons evenly
    let pLeft = pCount;
    let nLeft = nCount;
    for (let i = 0; i < total; i++) {
      if (pLeft > 0 && (nLeft === 0 || i % 2 === 0)) {
        types.push("p");
        pLeft--;
      } else {
        types.push("n");
        nLeft--;
      }
    }
    const goldenAngle = 2.399963229728653;
    return types.map((type, idx) => {
      const radius = idx === 0 ? 0 : spacing * Math.sqrt(idx) * 0.92;
      const angle = idx * goldenAngle;
      return {
        type,
        dx: Math.cos(angle) * radius,
        dy: Math.sin(angle) * radius
      };
    });
  }

  // Render static SVG mini-nuclei on Slide 3 (Carbon-12, 13, 14)
  document.querySelectorAll(".mini-nucleus").forEach((box) => {
    const p = parseInt(box.dataset.p, 10);
    const n = parseInt(box.dataset.n, 10);
    const layout = generateNucleonLayout(p, n, 11);
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("width", "96");
    svg.setAttribute("height", "96");

    layout.forEach((item) => {
      const c = document.createElementNS(svgNS, "circle");
      c.setAttribute("cx", (50 + item.dx).toFixed(1));
      c.setAttribute("cy", (50 + item.dy).toFixed(1));
      c.setAttribute("r", "9.2");
      c.setAttribute("fill", item.type === "p" ? "#f87171" : "#94a3b8");
      c.setAttribute("stroke", "rgba(15,23,42,0.45)");
      c.setAttribute("stroke-width", "1.4");
      svg.appendChild(c);
    });
    box.appendChild(svg);
  });

  /* ------------------------------------------------------------------------
     4. SLIDE 1: HERO ANIMATED CARBON-14 ATOM
     ------------------------------------------------------------------------ */
  const heroCanvas = document.getElementById("heroAtomCanvas");
  const heroCtx = heroCanvas.getContext("2d");
  const heroNucleons = generateNucleonLayout(6, 8, 12);

  function drawHeroAtom(t) {
    if (currentSlide !== 0) return;
    const c = getThemeColors();
    const w = heroCanvas.width;
    const h = heroCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    heroCtx.clearRect(0, 0, w, h);

    // Ambient unstable glow
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.004);
    const glow = heroCtx.createRadialGradient(cx, cy, 20, cx, cy, 130);
    glow.addColorStop(0, `rgba(248, 113, 113, ${0.18 + pulse * 0.1})`);
    glow.addColorStop(1, "rgba(248, 113, 113, 0)");
    heroCtx.fillStyle = glow;
    heroCtx.beginPath();
    heroCtx.arc(cx, cy, 130, 0, Math.PI * 2);
    heroCtx.fill();

    // Two shells (2 inner, 4 outer)
    const shells = [
      { r: 108, count: 2, speed: 0.0014 },
      { r: 174, count: 4, speed: -0.0009 }
    ];

    shells.forEach((shell) => {
      heroCtx.beginPath();
      heroCtx.setLineDash([6, 6]);
      heroCtx.arc(cx, cy, shell.r, 0, Math.PI * 2);
      heroCtx.strokeStyle = c.ring;
      heroCtx.lineWidth = 2;
      heroCtx.stroke();
      heroCtx.setLineDash([]);

      for (let i = 0; i < shell.count; i++) {
        const ang = t * shell.speed + (i * Math.PI * 2) / shell.count;
        const ex = cx + Math.cos(ang) * shell.r;
        const ey = cy + Math.sin(ang) * shell.r;
        drawSphere(heroCtx, ex, ey, 9.5, c.electron, "#0369a1");
      }
    });

    // Jiggling nucleus
    const jx = Math.sin(t * 0.024) * 1.8;
    const jy = Math.cos(t * 0.031) * 1.8;
    heroNucleons.forEach((nuc) => {
      const isP = nuc.type === "p";
      drawSphere(
        heroCtx,
        cx + nuc.dx + jx,
        cy + nuc.dy + jy,
        11.5,
        isP ? c.proton : c.neutron,
        isP ? c.protonDark : c.neutronDark
      );
    });
  }

  /* ------------------------------------------------------------------------
     5. SLIDE 4: SIMULATION 1 — INTERACTIVE ATOM, ISOTOPE & ION BUILDER
     ------------------------------------------------------------------------ */
  const ELEMENTS_1_TO_10 = {
    1: { name: "Hydrogen", sym: "H", stableN: [0, 1] },
    2: { name: "Helium", sym: "He", stableN: [1, 2] },
    3: { name: "Lithium", sym: "Li", stableN: [3, 4] },
    4: { name: "Beryllium", sym: "Be", stableN: [5] },
    5: { name: "Boron", sym: "B", stableN: [5, 6] },
    6: { name: "Carbon", sym: "C", stableN: [6, 7] },
    7: { name: "Nitrogen", sym: "N", stableN: [7, 8] },
    8: { name: "Oxygen", sym: "O", stableN: [8, 9, 10] },
    9: { name: "Fluorine", sym: "F", stableN: [10] },
    10: { name: "Neon", sym: "Ne", stableN: [10, 11, 12] }
  };

  const builderState = { p: 6, n: 6, e: 6, layout: [] };
  const builderCanvas = document.getElementById("builderCanvas");
  const builderCtx = builderCanvas.getContext("2d");

  const bMass = document.getElementById("bMass");
  const bAtomic = document.getElementById("bAtomic");
  const bSym = document.getElementById("bSym");
  const bChargeSup = document.getElementById("bChargeSup");
  const bName = document.getElementById("bName");
  const bStability = document.getElementById("bStability");
  const bChargeBadge = document.getElementById("bChargeBadge");
  const valP = document.getElementById("valP");
  const valN = document.getElementById("valN");
  const valE = document.getElementById("valE");

  function updateBuilderUI() {
    const { p, n, e } = builderState;
    const el = ELEMENTS_1_TO_10[p];
    const mass = p + n;
    const charge = p - e;
    const isStable = el.stableN.includes(n);

    valP.textContent = p;
    valN.textContent = n;
    valE.textContent = e;

    bMass.textContent = mass;
    bAtomic.textContent = p;
    bSym.textContent = el.sym;
    bName.textContent = `${el.name}-${mass}`;

    if (charge === 0) {
      bChargeSup.textContent = "";
      bChargeBadge.textContent = "Neutral Atom (0)";
      bChargeBadge.className = "status-pill neutral";
    } else {
      const mag = Math.abs(charge) === 1 ? "" : Math.abs(charge);
      const sign = charge > 0 ? "+" : "−";
      bChargeSup.textContent = `${mag}${sign}`;
      bChargeBadge.textContent = `Ion (${charge > 0 ? "+" : "−"}${Math.abs(charge)} charge)`;
      bChargeBadge.className = "status-pill ion";
    }

    if (isStable) {
      bStability.textContent = "✓ Stable Isotope";
      bStability.className = "status-pill stable";
    } else {
      bStability.textContent = "☢ Unstable (Radioisotope)";
      bStability.className = "status-pill unstable";
    }

    builderState.layout = generateNucleonLayout(p, n, 11.5);
  }

  document.querySelectorAll(".step-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const part = btn.dataset.part;
      const delta = parseInt(btn.dataset.delta, 10);
      if (part === "p") builderState.p = Math.max(1, Math.min(10, builderState.p + delta));
      if (part === "n") builderState.n = Math.max(0, Math.min(14, builderState.n + delta));
      if (part === "e") builderState.e = Math.max(0, Math.min(12, builderState.e + delta));
      updateBuilderUI();
    });
  });

  const BUILDER_PRESETS = {
    c12: { p: 6, n: 6, e: 6 },
    c14: { p: 6, n: 8, e: 6 },
    wsA: { p: 4, n: 3, e: 4 },
    wsB: { p: 4, n: 4, e: 4 },
    wsC: { p: 5, n: 5, e: 2 },
    wsD: { p: 3, n: 4, e: 2 }
  };

  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const preset = BUILDER_PRESETS[btn.dataset.preset];
      builderState.p = preset.p;
      builderState.n = preset.n;
      builderState.e = preset.e;
      updateBuilderUI();
    });
  });

  updateBuilderUI();

  function drawBuilderAtom(t) {
    if (currentSlide !== 3) return;
    const c = getThemeColors();
    const w = builderCanvas.width;
    const h = builderCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    builderCtx.clearRect(0, 0, w, h);

    const el = ELEMENTS_1_TO_10[builderState.p];
    const isStable = el.stableN.includes(builderState.n);

    // Unstable warning halo
    if (!isStable) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.008);
      const glow = builderCtx.createRadialGradient(cx, cy, 18, cx, cy, 90);
      glow.addColorStop(0, `rgba(251, 113, 133, ${0.25 + pulse * 0.16})`);
      glow.addColorStop(1, "rgba(251, 113, 133, 0)");
      builderCtx.fillStyle = glow;
      builderCtx.beginPath();
      builderCtx.arc(cx, cy, 90, 0, Math.PI * 2);
      builderCtx.fill();
    }

    // Electron shells: 2, 8, 2
    const eCount = builderState.e;
    const s1 = Math.min(2, eCount);
    const s2 = Math.min(8, Math.max(0, eCount - 2));
    const s3 = Math.max(0, eCount - 10);
    const shells = [
      { r: 88, count: s1, speed: 0.0014 },
      { r: 138, count: s2, speed: -0.00095 },
      { r: 178, count: s3, speed: 0.0007 }
    ];

    shells.forEach((shell, idx) => {
      if (idx === 2 && shell.count === 0) return;
      if (idx === 1 && shell.count === 0 && builderState.p <= 2) return;

      builderCtx.beginPath();
      builderCtx.setLineDash([5, 5]);
      builderCtx.arc(cx, cy, shell.r, 0, Math.PI * 2);
      builderCtx.strokeStyle = c.ring;
      builderCtx.lineWidth = 1.8;
      builderCtx.stroke();
      builderCtx.setLineDash([]);

      for (let i = 0; i < shell.count; i++) {
        const ang = t * shell.speed + (i * Math.PI * 2) / shell.count - Math.PI / 2;
        const ex = cx + Math.cos(ang) * shell.r;
        const ey = cy + Math.sin(ang) * shell.r;
        drawSphere(builderCtx, ex, ey, 8.5, c.electron, "#0369a1");
      }
    });

    // Nucleus (jiggles when unstable)
    const jx = isStable ? 0 : Math.sin(t * 0.036) * 2.5;
    const jy = isStable ? 0 : Math.cos(t * 0.044) * 2.5;

    builderState.layout.forEach((nuc) => {
      const isP = nuc.type === "p";
      drawSphere(
        builderCtx,
        cx + nuc.dx + jx,
        cy + nuc.dy + jy,
        10.5,
        isP ? c.proton : c.neutron,
        isP ? c.protonDark : c.neutronDark
      );
    });
  }

  /* ------------------------------------------------------------------------
     6. SLIDES 8, 9, 10: ALPHA, BETA, GAMMA DECAY ANIMATIONS
     ------------------------------------------------------------------------ */
  function buildNucHTML(A, Z, sym, extraClass) {
    return `<span class="nuc-display med ${extraClass || ""}"><span class="nuc-stack"><span class="text-mass">${A}</span><span class="text-p">${Z}</span></span><span class="nuc-sym">${sym}</span></span>`;
  }

  // --- 6A: ALPHA DECAY ---
  const ALPHA_EXAMPLES = {
    u238: { pA: 238, pZ: 92, pSym: "U", pName: "Uranium-238", dA: 234, dZ: 90, dSym: "Th", dName: "Thorium-234" },
    am241: { pA: 241, pZ: 95, pSym: "Am", pName: "Americium-241", dA: 237, dZ: 93, dSym: "Np", dName: "Neptunium-237" },
    ra226: { pA: 226, pZ: 88, pSym: "Ra", pName: "Radium-226", dA: 222, dZ: 86, dSym: "Rn", dName: "Radon-222" }
  };

  const alphaCanvas = document.getElementById("alphaCanvas");
  const alphaCtx = alphaCanvas.getContext("2d");
  const alphaSelect = document.getElementById("alphaSelect");
  const alphaEqDisplay = document.getElementById("alphaEqDisplay");
  const alphaState = { key: "u238", running: false, progress: 0, nucleons: generateNucleonLayout(14, 18, 9.2) };

  function syncAlphaEq() {
    const ex = ALPHA_EXAMPLES[alphaState.key];
    alphaEqDisplay.innerHTML = `${buildNucHTML(ex.pA, ex.pZ, ex.pSym)}<span class="eq-arrow">→</span>${buildNucHTML(ex.dA, ex.dZ, ex.dSym)}<span class="eq-plus">+</span>${buildNucHTML(4, 2, "He", "text-alpha")}`;
    const check = document.querySelector("#alphaEqBox .eq-check");
    check.innerHTML = `<span>Top: <strong>${ex.pA} = ${ex.dA} + 4</strong> ✓</span><span>Bottom: <strong>${ex.pZ} = ${ex.dZ} + 2</strong> ✓</span>`;
  }

  alphaSelect.addEventListener("change", () => {
    alphaState.key = alphaSelect.value;
    alphaState.running = false;
    alphaState.progress = 0;
    syncAlphaEq();
  });
  document.getElementById("btnRunAlpha").addEventListener("click", () => {
    alphaState.progress = 0;
    alphaState.running = true;
  });
  document.getElementById("btnResetAlpha").addEventListener("click", () => {
    alphaState.running = false;
    alphaState.progress = 0;
  });
  syncAlphaEq();

  function drawAlphaSim(t) {
    if (currentSlide !== 7) return;
    const c = getThemeColors();
    const w = alphaCanvas.width;
    const h = alphaCanvas.height;
    alphaCtx.clearRect(0, 0, w, h);

    if (alphaState.running && alphaState.progress < 1) {
      alphaState.progress = Math.min(1, alphaState.progress + 0.011);
    }
    const p = alphaState.progress;
    const ex = ALPHA_EXAMPLES[alphaState.key];

    const shake = p < 0.25 ? Math.sin(t * 0.05) * (alphaState.running ? 4 : 1.5) : 0;
    const recoil = p > 0.2 ? Math.min(1, (p - 0.2) * 2) * -18 : 0;
    const nx = 165 + recoil + shake;
    const ny = 152 + (p < 0.25 ? Math.cos(t * 0.06) * 1.8 : 0);

    // Draw parent/daughter nucleus
    alphaState.nucleons.forEach((nuc, i) => {
      // Last 4 nucleons eject if p > 0.22
      if (p > 0.22 && i >= alphaState.nucleons.length - 4) return;
      const isP = nuc.type === "p";
      drawSphere(alphaCtx, nx + nuc.dx, ny + nuc.dy, 8.2, isP ? c.proton : c.neutron, isP ? c.protonDark : c.neutronDark);
    });

    // Nucleus label
    alphaCtx.fillStyle = c.text;
    alphaCtx.font = "800 17px Segoe UI, sans-serif";
    alphaCtx.textAlign = "center";
    const decayed = p > 0.28;
    alphaCtx.fillText(decayed ? `${ex.dName} (${ex.dZ}p, ${ex.dA - ex.dZ}n)` : `${ex.pName} (${ex.pZ}p, ${ex.pA - ex.pZ}n)`, nx, 265);
    alphaCtx.fillStyle = decayed ? c.stable : c.unstable;
    alphaCtx.font = "700 13px Segoe UI, sans-serif";
    alphaCtx.fillText(decayed ? "New Daughter Element (−2p, −2n)" : "Unstable Parent Nucleus", nx, 286);

    // Ejected alpha particle (2p + 2n)
    if (p > 0.2) {
      const ep = Math.min(1, (p - 0.2) / 0.8);
      const ax = nx + 34 + ep * 245;
      const ay = ny;

      // Golden trail
      const grad = alphaCtx.createLinearGradient(nx + 40, ay, ax, ay);
      grad.addColorStop(0, "rgba(245, 158, 11, 0)");
      grad.addColorStop(1, "rgba(245, 158, 11, 0.55)");
      alphaCtx.strokeStyle = grad;
      alphaCtx.lineWidth = 10;
      alphaCtx.lineCap = "round";
      alphaCtx.beginPath();
      alphaCtx.moveTo(nx + 40, ay);
      alphaCtx.lineTo(ax - 12, ay);
      alphaCtx.stroke();

      // Cluster of 2p + 2n
      const offsets = [
        { dx: -7, dy: -6, isP: true },
        { dx: 7, dy: 6, isP: true },
        { dx: 7, dy: -6, isP: false },
        { dx: -7, dy: 6, isP: false }
      ];
      offsets.forEach((o) => {
        drawSphere(alphaCtx, ax + o.dx, ay + o.dy, 8.5, o.isP ? c.proton : c.neutron, o.isP ? c.protonDark : c.neutronDark);
      });

      // Halo ring
      alphaCtx.beginPath();
      alphaCtx.arc(ax, ay, 24, 0, Math.PI * 2);
      alphaCtx.strokeStyle = c.alpha;
      alphaCtx.lineWidth = 2.5;
      alphaCtx.stroke();

      alphaCtx.fillStyle = c.alpha;
      alphaCtx.font = "800 16px Segoe UI, sans-serif";
      alphaCtx.fillText("Alpha Particle (⁴₂He)", ax, ay - 36);
      alphaCtx.font = "700 13px Segoe UI, sans-serif";
      alphaCtx.fillText("2 protons + 2 neutrons", ax, ay + 46);
    }
  }

  // --- 6B: BETA DECAY ---
  const BETA_EXAMPLES = {
    k42: { pA: 42, pZ: 19, pSym: "K", pName: "Potassium-42", dA: 42, dZ: 20, dSym: "Ca", dName: "Calcium-42" },
    c14: { pA: 14, pZ: 6, pSym: "C", pName: "Carbon-14", dA: 14, dZ: 7, dSym: "N", dName: "Nitrogen-14" },
    i131: { pA: 131, pZ: 53, pSym: "I", pName: "Iodine-131", dA: 131, dZ: 54, dSym: "Xe", dName: "Xenon-131" }
  };

  const betaCanvas = document.getElementById("betaCanvas");
  const betaCtx = betaCanvas.getContext("2d");
  const betaSelect = document.getElementById("betaSelect");
  const betaEqDisplay = document.getElementById("betaEqDisplay");
  const betaEqCheck = document.getElementById("betaEqCheck");
  const betaState = { key: "k42", running: false, progress: 0, nucleons: generateNucleonLayout(7, 9, 11.5) };

  function syncBetaEq() {
    const ex = BETA_EXAMPLES[betaState.key];
    betaEqDisplay.innerHTML = `${buildNucHTML(ex.pA, ex.pZ, ex.pSym)}<span class="eq-arrow">→</span>${buildNucHTML(ex.dA, ex.dZ, ex.dSym)}<span class="eq-plus">+</span>${buildNucHTML(0, "−1", "e", "text-beta")}`;
    betaEqCheck.innerHTML = `<span>Top: <strong>${ex.pA} = ${ex.dA} + 0</strong> ✓</span><span>Bottom: <strong>${ex.pZ} = ${ex.dZ} + (−1)</strong> ✓</span>`;
  }

  betaSelect.addEventListener("change", () => {
    betaState.key = betaSelect.value;
    betaState.running = false;
    betaState.progress = 0;
    syncBetaEq();
  });
  document.getElementById("btnRunBeta").addEventListener("click", () => {
    betaState.progress = 0;
    betaState.running = true;
  });
  document.getElementById("btnResetBeta").addEventListener("click", () => {
    betaState.running = false;
    betaState.progress = 0;
  });
  syncBetaEq();

  function drawBetaSim(t) {
    if (currentSlide !== 8) return;
    const c = getThemeColors();
    const w = betaCanvas.width;
    const h = betaCanvas.height;
    betaCtx.clearRect(0, 0, w, h);

    if (betaState.running && betaState.progress < 1) {
      betaState.progress = Math.min(1, betaState.progress + 0.012);
    }
    const p = betaState.progress;
    const ex = BETA_EXAMPLES[betaState.key];
    const nx = 165;
    const ny = 152;

    // Pick rightmost neutron to morph into a proton!
    let targetIdx = 0;
    let bestX = -999;
    betaState.nucleons.forEach((nuc, i) => {
      if (nuc.type === "n" && nuc.dx > bestX) {
        bestX = nuc.dx;
        targetIdx = i;
      }
    });

    const morphed = p >= 0.32;
    const shake = p < 0.32 ? Math.sin(t * 0.05) * (betaState.running ? 3.2 : 1.4) : 0;

    betaState.nucleons.forEach((nuc, i) => {
      const isTarget = i === targetIdx;
      const isP = isTarget ? morphed : nuc.type === "p";
      const px = nx + nuc.dx + shake;
      const py = ny + nuc.dy;
      drawSphere(betaCtx, px, py, isTarget ? 11.2 : 9.8, isP ? c.proton : c.neutron, isP ? c.protonDark : c.neutronDark);

      // Highlight ring on transforming nucleon
      if (isTarget) {
        betaCtx.beginPath();
        betaCtx.arc(px, py, 14.5 + Math.sin(t * 0.015) * 2, 0, Math.PI * 2);
        betaCtx.strokeStyle = morphed ? c.proton : c.beta;
        betaCtx.lineWidth = 2.4;
        betaCtx.stroke();
      }
    });

    // Transformation flash & label
    const tNuc = betaState.nucleons[targetIdx];
    const tx = nx + tNuc.dx;
    const ty = ny + tNuc.dy;

    if (p > 0.24 && p < 0.5) {
      const flashAlpha = 1 - Math.abs(p - 0.35) / 0.16;
      betaCtx.beginPath();
      betaCtx.arc(tx, ty, 34 * (1 - flashAlpha * 0.4), 0, Math.PI * 2);
      betaCtx.fillStyle = `rgba(6, 182, 212, ${Math.max(0, flashAlpha * 0.55)})`;
      betaCtx.fill();
    }

    // Callout arrow for neutron -> proton
    betaCtx.fillStyle = c.text;
    betaCtx.font = "800 17px Segoe UI, sans-serif";
    betaCtx.textAlign = "center";
    betaCtx.fillText(morphed ? `${ex.dName} (${ex.dZ}p, ${ex.dA - ex.dZ}n)` : `${ex.pName} (${ex.pZ}p, ${ex.pA - ex.pZ}n)`, nx, 265);
    betaCtx.fillStyle = morphed ? c.stable : c.beta;
    betaCtx.font = "700 13px Segoe UI, sans-serif";
    betaCtx.fillText(morphed ? "1 Neutron turned into 1 Proton (+1 Z, same A!)" : "Watch the highlighted neutron →", nx, 286);

    // Fast moving beta electron shooting right
    if (p > 0.32) {
      const ep = Math.min(1, (p - 0.32) / 0.68);
      const exPos = tx + 16 + ep * 265;
      const eyPos = ty - ep * 22;

      const grad = betaCtx.createLinearGradient(tx + 12, ty, exPos, eyPos);
      grad.addColorStop(0, "rgba(6, 182, 212, 0)");
      grad.addColorStop(1, "rgba(6, 182, 212, 0.85)");
      betaCtx.strokeStyle = grad;
      betaCtx.lineWidth = 4;
      betaCtx.beginPath();
      betaCtx.moveTo(tx + 12, ty);
      betaCtx.lineTo(exPos, eyPos);
      betaCtx.stroke();

      drawSphere(betaCtx, exPos, eyPos, 7.5, c.electron, "#0369a1");

      betaCtx.fillStyle = c.beta;
      betaCtx.font = "800 16px Segoe UI, sans-serif";
      betaCtx.fillText("Beta Particle (⁰₋₁e)", Math.min(430, exPos), eyPos - 24);
      betaCtx.font = "700 13px Segoe UI, sans-serif";
      betaCtx.fillText("Fast-moving electron", Math.min(430, exPos), eyPos + 28);
    }
  }

  // --- 6C: GAMMA DECAY ---
  const GAMMA_EXAMPLES = {
    i125: { A: 125, Z: 53, sym: "I", name: "Iodine-125" },
    cs137: { A: 137, Z: 55, sym: "Cs", name: "Caesium-137" },
    tc99: { A: 99, Z: 43, sym: "Tc", name: "Technetium-99" }
  };

  const gammaCanvas = document.getElementById("gammaCanvas");
  const gammaCtx = gammaCanvas.getContext("2d");
  const gammaSelect = document.getElementById("gammaSelect");
  const gammaEqDisplay = document.getElementById("gammaEqDisplay");
  const gammaEqCheck = document.getElementById("gammaEqCheck");
  const gammaState = { key: "i125", running: false, progress: 0, nucleons: generateNucleonLayout(10, 12, 10) };

  function syncGammaEq() {
    const ex = GAMMA_EXAMPLES[gammaState.key];
    gammaEqDisplay.innerHTML = `${buildNucHTML(ex.A, ex.Z, ex.sym)}<span class="eq-arrow">→</span>${buildNucHTML(ex.A, ex.Z, ex.sym)}<span class="eq-plus">+</span><span class="nuc-display med text-gamma"><span class="nuc-sym">γ</span></span>`;
    gammaEqCheck.innerHTML = `<span>Top: <strong>${ex.A} = ${ex.A}</strong> ✓</span><span>Bottom: <strong>${ex.Z} = ${ex.Z}</strong> ✓</span>`;
  }

  gammaSelect.addEventListener("change", () => {
    gammaState.key = gammaSelect.value;
    gammaState.running = false;
    gammaState.progress = 0;
    syncGammaEq();
  });
  document.getElementById("btnRunGamma").addEventListener("click", () => {
    gammaState.progress = 0;
    gammaState.running = true;
  });
  document.getElementById("btnResetGamma").addEventListener("click", () => {
    gammaState.running = false;
    gammaState.progress = 0;
  });
  syncGammaEq();

  function drawGammaSim(t) {
    if (currentSlide !== 9) return;
    const c = getThemeColors();
    const w = gammaCanvas.width;
    const h = gammaCanvas.height;
    gammaCtx.clearRect(0, 0, w, h);

    if (gammaState.running && gammaState.progress < 1) {
      gammaState.progress = Math.min(1, gammaState.progress + 0.011);
    }
    const p = gammaState.progress;
    const ex = GAMMA_EXAMPLES[gammaState.key];
    const nx = 148;
    const ny = 152;
    const excited = p < 0.45;

    // Excited violet glow fades out as gamma wave leaves
    const glowStrength = excited ? 0.35 + 0.12 * Math.sin(t * 0.012) : Math.max(0.04, 0.35 * (1 - (p - 0.45) / 0.55));
    const glow = gammaCtx.createRadialGradient(nx, ny, 14, nx, ny, 78);
    glow.addColorStop(0, `rgba(192, 132, 252, ${glowStrength})`);
    glow.addColorStop(1, "rgba(192, 132, 252, 0)");
    gammaCtx.fillStyle = glow;
    gammaCtx.beginPath();
    gammaCtx.arc(nx, ny, 78, 0, Math.PI * 2);
    gammaCtx.fill();

    const vib = excited ? Math.sin(t * 0.045) * 2.5 : 0;
    gammaState.nucleons.forEach((nuc) => {
      const isP = nuc.type === "p";
      drawSphere(gammaCtx, nx + nuc.dx + vib, ny + nuc.dy, 9, isP ? c.proton : c.neutron, isP ? c.protonDark : c.neutronDark);
    });

    gammaCtx.fillStyle = c.text;
    gammaCtx.font = "800 17px Segoe UI, sans-serif";
    gammaCtx.textAlign = "center";
    gammaCtx.fillText(`${ex.name} (${ex.Z}p, ${ex.A - ex.Z}n)`, nx, 265);
    gammaCtx.fillStyle = excited ? c.gamma : c.stable;
    gammaCtx.font = "700 13px Segoe UI, sans-serif";
    gammaCtx.fillText(excited ? "Excited Nucleus (Extra Energy)" : "Same Element — Calmer, Lower Energy!", nx, 286);

    // Sinusoidal Gamma Wave
    if (p > 0.1) {
      const wp = Math.min(1, (p - 0.1) / 0.9);
      const startX = nx + 54;
      const waveLen = 290 * wp;

      gammaCtx.save();
      gammaCtx.beginPath();
      for (let x = 0; x <= waveLen; x += 2) {
        const y = ny + Math.sin(x * 0.18 - t * 0.025) * 20;
        if (x === 0) gammaCtx.moveTo(startX + x, y);
        else gammaCtx.lineTo(startX + x, y);
      }
      gammaCtx.strokeStyle = c.gamma;
      gammaCtx.lineWidth = 4;
      gammaCtx.shadowColor = c.gamma;
      gammaCtx.shadowBlur = 12;
      gammaCtx.stroke();
      gammaCtx.restore();

      // Arrowhead at leading edge
      const tipX = startX + waveLen;
      gammaCtx.fillStyle = c.gamma;
      gammaCtx.beginPath();
      gammaCtx.moveTo(tipX + 10, ny);
      gammaCtx.lineTo(tipX - 4, ny - 8);
      gammaCtx.lineTo(tipX - 4, ny + 8);
      gammaCtx.closePath();
      gammaCtx.fill();

      gammaCtx.font = "800 16px Segoe UI, sans-serif";
      gammaCtx.fillText("Gamma Ray (γ)", Math.min(400, startX + waveLen * 0.55), ny - 38);
      gammaCtx.font = "700 13px Segoe UI, sans-serif";
      gammaCtx.fillText("High-energy wave (0 mass, 0 charge)", Math.min(400, startX + waveLen * 0.55), ny + 48);
    }
  }

  /* ------------------------------------------------------------------------
     7. SLIDE 11: SIMULATION 3 — RADIATION PENETRATION LAB
     ------------------------------------------------------------------------ */
  const penCanvas = document.getElementById("penetrationCanvas");
  const penCtx = penCanvas.getContext("2d");
  const penStatus = document.getElementById("penStatus");
  const penBeams = [];

  const BARRIERS = [
    { name: "Paper", x: 255, w: 14, color: "#e2e8f0", stops: "alpha" },
    { name: "Aluminium", x: 435, w: 26, color: "#94a3b8", stops: "beta" },
    { name: "Thick Lead", x: 625, w: 68, color: "#475569", stops: "gamma" }
  ];

  function firePenBeam(type) {
    if (type === "all") {
      firePenBeam("alpha");
      firePenBeam("beta");
      firePenBeam("gamma");
      penStatus.textContent = "Alpha stops at Paper • Beta stops at Aluminium • Gamma requires Thick Lead!";
      return;
    }
    const yMap = { alpha: 62, beta: 125, gamma: 188 };
    const stopMap = { alpha: 253, beta: 446, gamma: 662 };
    penBeams.push({ type, x: 96, y: yMap[type], stopX: stopMap[type], stopped: false, alpha: 1 });

    if (type === "alpha") penStatus.textContent = "Alpha (α): Heavy & strongly ionising — stopped easily by a single sheet of paper!";
    if (type === "beta") penStatus.textContent = "Beta (β): Passes straight through paper, stopped by a thin sheet of aluminium!";
    if (type === "gamma") penStatus.textContent = "Gamma (γ): Pure energy wave — passes through paper & aluminium; needs thick lead!";
  }

  document.querySelectorAll("[data-fire]").forEach((btn) => {
    btn.addEventListener("click", () => firePenBeam(btn.dataset.fire));
  });

  function drawPenetrationSim(t) {
    if (currentSlide !== 10) return;
    const c = getThemeColors();
    const w = penCanvas.width;
    const h = penCanvas.height;
    penCtx.clearRect(0, 0, w, h);

    // Draw radioactive source housing
    penCtx.fillStyle = c.isLight ? "#1e293b" : "#0f172a";
    penCtx.fillRect(22, 32, 74, 186);
    penCtx.strokeStyle = c.alpha;
    penCtx.lineWidth = 2;
    penCtx.strokeRect(22, 32, 74, 186);

    penCtx.fillStyle = c.alpha;
    penCtx.font = "800 28px Segoe UI, sans-serif";
    penCtx.textAlign = "center";
    penCtx.fillText("☢", 59, 118);
    penCtx.fillStyle = "#f8fafc";
    penCtx.font = "700 12px Segoe UI, sans-serif";
    penCtx.fillText("SOURCE", 59, 144);

    // Track labels
    const rows = [
      { label: "α", y: 62, col: c.alpha },
      { label: "β", y: 125, col: c.beta },
      { label: "γ", y: 188, col: c.gamma }
    ];
    rows.forEach((r) => {
      penCtx.strokeStyle = "rgba(148,163,184,0.16)";
      penCtx.setLineDash([4, 6]);
      penCtx.beginPath();
      penCtx.moveTo(96, r.y);
      penCtx.lineTo(w - 24, r.y);
      penCtx.stroke();
      penCtx.setLineDash([]);
      penCtx.fillStyle = r.col;
      penCtx.font = "900 18px Segoe UI, sans-serif";
      penCtx.fillText(r.label, 114, r.y - 12);
    });

    // Draw barriers
    BARRIERS.forEach((b) => {
      penCtx.fillStyle = b.color;
      penCtx.fillRect(b.x, 26, b.w, 192);
      penCtx.strokeStyle = "rgba(15,23,42,0.4)";
      penCtx.strokeRect(b.x, 26, b.w, 192);

      penCtx.fillStyle = c.text;
      penCtx.font = "800 13px Segoe UI, sans-serif";
      penCtx.textAlign = "center";
      penCtx.fillText(b.name, b.x + b.w / 2, 238);
    });

    // Update & draw beams
    for (let i = penBeams.length - 1; i >= 0; i--) {
      const b = penBeams[i];
      const speed = b.type === "alpha" ? 4.2 : b.type === "beta" ? 6.8 : 8.2;

      if (!b.stopped) {
        b.x += speed;
        if (b.x >= b.stopX) {
          b.x = b.stopX;
          b.stopped = true;
        }
      } else {
        b.alpha -= 0.008;
      }

      if (b.alpha <= 0) {
        penBeams.splice(i, 1);
        continue;
      }

      penCtx.save();
      penCtx.globalAlpha = Math.max(0, b.alpha);

      if (b.type === "alpha") {
        penCtx.strokeStyle = c.alpha;
        penCtx.lineWidth = 6;
        penCtx.beginPath();
        penCtx.moveTo(96, b.y);
        penCtx.lineTo(b.x, b.y);
        penCtx.stroke();
        drawSphere(penCtx, b.x, b.y, 9, c.alpha, "#b45309");
      } else if (b.type === "beta") {
        penCtx.strokeStyle = c.beta;
        penCtx.lineWidth = 3.5;
        penCtx.beginPath();
        penCtx.moveTo(96, b.y);
        penCtx.lineTo(b.x, b.y);
        penCtx.stroke();
        drawSphere(penCtx, b.x, b.y, 6.5, c.electron, "#0369a1");
      } else {
        penCtx.strokeStyle = c.gamma;
        penCtx.lineWidth = 3;
        penCtx.beginPath();
        for (let x = 96; x <= b.x; x += 3) {
          const wy = b.y + Math.sin(x * 0.22 - t * 0.03) * 11;
          if (x === 96) penCtx.moveTo(x, wy);
          else penCtx.lineTo(x, wy);
        }
        penCtx.stroke();
      }

      // Impact ring when stopped
      if (b.stopped) {
        penCtx.beginPath();
        penCtx.arc(b.x, b.y, 14 + (1 - b.alpha) * 14, 0, Math.PI * 2);
        penCtx.strokeStyle = b.type === "alpha" ? c.alpha : b.type === "beta" ? c.beta : c.gamma;
        penCtx.lineWidth = 2;
        penCtx.stroke();
      }
      penCtx.restore();
    }
  }

  /* ------------------------------------------------------------------------
     8. SLIDE 12: SIMULATION 4 — INTERACTIVE NUCLEAR EQUATION BALANCER
     ------------------------------------------------------------------------ */
  const BALANCER_PROBLEMS = {
    am241: {
      type: "alpha",
      pA: 241, pZ: 95, pSym: "Am",
      dA: 237, dZ: 93, dSym: "Np",
      eA: 4, eZ: 2, eSym: "He",
      missing: ["dA", "dZ"],
      hint: "Alpha decay loses ⁴₂He → subtract 4 from the top (241 − 4 = 237) and subtract 2 from the bottom (95 − 2 = 93)."
    },
    sr90: {
      type: "beta",
      pA: 90, pZ: 38, pSym: "Sr",
      dA: 90, dZ: 39, dSym: "Y",
      eA: 0, eZ: -1, eSym: "e",
      missing: ["pA", "pZ"],
      hint: "Add the right-hand side! Top: 90 + 0 = 90. Bottom: 39 + (−1) = 38. (Watch the minus sign!)"
    },
    cs137: {
      type: "gamma",
      pA: 137, pZ: 55, pSym: "Cs",
      dA: 137, dZ: 55, dSym: "Cs",
      eA: "", eZ: "", eSym: "γ",
      missing: ["dA", "dZ"],
      hint: "Gamma decay only emits a high-energy wave (γ) — both Mass Number (137) and Atomic Number (55) stay identical!"
    },
    bi209: {
      type: "alpha",
      pA: 209, pZ: 83, pSym: "Bi",
      dA: 205, dZ: 81, dSym: "Tl",
      eA: 4, eZ: 2, eSym: "He",
      missing: ["pA", "dZ"],
      hint: "Top left: 205 + 4 = 209. Bottom right: 83 − 2 = 81. Always check both sides add up equally!"
    },
    po210: {
      type: "alpha",
      pA: 210, pZ: 84, pSym: "Po",
      dA: 206, dZ: 82, dSym: "Pb",
      eA: 4, eZ: 2, eSym: "He",
      missing: ["pZ", "dA", "dSym"],
      hint: "Bottom left: 82 + 2 = 84 (Po — note worksheet typo 'Pn'). Top right: 210 − 4 = 206. Look up Z = 82 on Periodic Table → Pb (Lead)!"
    },
    k40: {
      type: "beta",
      pA: 40, pZ: 19, pSym: "K",
      dA: 40, dZ: 20, dSym: "Ca",
      eA: 0, eZ: -1, eSym: "e",
      missing: ["pA", "dZ"],
      hint: "Beta decay keeps Mass unchanged (40) and increases Atomic Number by 1: 19 → 20 (Check: 20 + (−1) = 19 ✓)."
    }
  };

  const balSelect = document.getElementById("balProblemSelect");
  const balStage = document.getElementById("balancerStage");
  const balTopMath = document.getElementById("balTopMath");
  const balBotMath = document.getElementById("balBotMath");
  const balHint = document.getElementById("balHint");
  const btnBalToggleMode = document.getElementById("btnBalToggleMode");
  const btnBalReveal = document.getElementById("btnBalReveal");

  let balQuizMode = true;

  function renderBalancer() {
    const prob = BALANCER_PROBLEMS[balSelect.value];

    function fieldHTML(fieldKey, value, isSym, colorClass) {
      if (balQuizMode && prob.missing.includes(fieldKey)) {
        return `<input class="bal-input ${isSym ? "sym-input" : ""}" data-key="${fieldKey}" data-ans="${value}" placeholder="?" aria-label="Missing ${fieldKey}" />`;
      }
      if (isSym) return `<span class="bal-sym ${colorClass || ""}">${value}</span>`;
      return `<span class="bal-num ${colorClass || ""}">${value}</span>`;
    }

    const emitCol = prob.type === "alpha" ? "text-alpha" : prob.type === "beta" ? "text-beta" : "text-gamma";
    const emitStack = prob.type === "gamma"
      ? ""
      : `<div class="bal-stack"><span class="bal-num ${emitCol}">${prob.eA}</span><span class="bal-num ${emitCol}">${prob.eZ === -1 ? "−1" : prob.eZ}</span></div>`;

    balStage.innerHTML = `
      <div class="bal-nuc">
        <div class="bal-stack">
          ${fieldHTML("pA", prob.pA, false, "text-mass")}
          ${fieldHTML("pZ", prob.pZ, false, "text-p")}
        </div>
        ${fieldHTML("pSym", prob.pSym, true, "")}
      </div>
      <span class="eq-arrow">→</span>
      <div class="bal-nuc">
        <div class="bal-stack">
          ${fieldHTML("dA", prob.dA, false, "text-mass")}
          ${fieldHTML("dZ", prob.dZ, false, "text-p")}
        </div>
        ${fieldHTML("dSym", prob.dSym, true, "")}
      </div>
      <span class="eq-plus">+</span>
      <div class="bal-nuc">
        ${emitStack}
        <span class="bal-sym ${emitCol}">${prob.eSym}</span>
      </div>
    `;

    // Bind live input validation
    balStage.querySelectorAll(".bal-input").forEach((inp) => {
      inp.addEventListener("input", () => {
        const expected = String(inp.dataset.ans).trim().toLowerCase();
        const got = inp.value.trim().toLowerCase();
        inp.classList.remove("correct", "wrong");
        if (!got) return;
        if (got === expected) inp.classList.add("correct");
        else inp.classList.add("wrong");
        updateBalancerMath(prob);
      });
    });

    updateBalancerMath(prob);
    balHint.textContent = prob.hint;
  }

  function updateBalancerMath(prob) {
    const inputs = Array.from(balStage.querySelectorAll(".bal-input"));
    const allSolved = inputs.every((i) => i.value.trim().toLowerCase() === String(i.dataset.ans).trim().toLowerCase());

    if (!balQuizMode || allSolved) {
      if (prob.type === "gamma") {
        balTopMath.textContent = `${prob.pA} = ${prob.dA}  ✓ Balanced!`;
        balBotMath.textContent = `${prob.pZ} = ${prob.dZ}  ✓ Balanced!`;
      } else {
        const ezStr = prob.eZ < 0 ? `(−1)` : prob.eZ;
        balTopMath.textContent = `${prob.pA} = ${prob.dA} + ${prob.eA}  ✓ Balanced!`;
        balBotMath.textContent = `${prob.pZ} = ${prob.dZ} + ${ezStr}  ✓ Balanced!`;
      }
    } else {
      balTopMath.textContent = "Fill in the missing top number(s) so Left = Right";
      balBotMath.textContent = "Fill in the missing bottom number(s) so Left = Right";
    }
  }

  balSelect.addEventListener("change", renderBalancer);
  btnBalToggleMode.addEventListener("click", () => {
    balQuizMode = !balQuizMode;
    btnBalToggleMode.textContent = `Quiz Mode: ${balQuizMode ? "ON" : "OFF"}`;
    renderBalancer();
  });
  btnBalReveal.addEventListener("click", () => {
    balStage.querySelectorAll(".bal-input").forEach((inp) => {
      inp.value = inp.dataset.ans;
      inp.classList.remove("wrong");
      inp.classList.add("correct");
    });
    updateBalancerMath(BALANCER_PROBLEMS[balSelect.value]);
  });

  renderBalancer();

  /* ------------------------------------------------------------------------
     9. SLIDE 15: INTERACTIVE CLASS QUIZ
     ------------------------------------------------------------------------ */
  const QUIZ_QUESTIONS = [
    {
      q: "1. Two atoms are isotopes of the same element. Which statement MUST be true?",
      options: [
        "They have the same number of neutrons, different protons",
        "They have the same number of protons, different neutrons",
        "They always have different numbers of electrons",
        "They have the exact same mass number"
      ],
      ans: 1,
      explain: "Isotopes belong to the same element (same protons / atomic number Z) but differ in neutrons (different mass number A)."
    },
    {
      q: "2. How many neutrons are in Chromium-63 (Atomic Number Z = 24)?",
      options: ["24 neutrons", "63 neutrons", "39 neutrons", "87 neutrons"],
      ans: 2,
      explain: "Neutrons = Mass Number − Atomic Number = 63 − 24 = 39 neutrons. (Straight from Worksheet 1, Q1!)"
    },
    {
      q: "3. A particle has 5 protons, 5 neutrons, and 2 electrons. What is it?",
      options: [
        "A neutral Boron atom",
        "A Boron ion with a +3 charge",
        "A Helium isotope",
        "An alpha particle"
      ],
      ans: 1,
      explain: "5 protons makes it Boron (Z = 5). Because it has 5 protons (+) and only 2 electrons (−), protons ≠ electrons, so it is a +3 ion! (Worksheet 1, Q3c)"
    },
    {
      q: "4. When Uranium-238 (Z = 92) undergoes ALPHA decay, what new isotope forms?",
      options: [
        "Thorium-234 (Z = 90)",
        "Uranium-234 (Z = 92)",
        "Neptunium-238 (Z = 93)",
        "Thorium-236 (Z = 90)"
      ],
      ans: 0,
      explain: "Alpha decay emits ⁴₂He: Mass drops by 4 (238 − 4 = 234) and Atomic Number drops by 2 (92 − 2 = 90 → Thorium)."
    }
  ];

  const quizContainer = document.getElementById("quizContainer");
  let quizIdx = 0;
  let quizScore = 0;

  function renderQuiz() {
    const item = QUIZ_QUESTIONS[quizIdx];
    quizContainer.innerHTML = `
      <div class="quiz-meta">
        <span>Question ${quizIdx + 1} of ${QUIZ_QUESTIONS.length}</span>
        <span>Class Score: ${quizScore} / ${QUIZ_QUESTIONS.length}</span>
      </div>
      <div class="quiz-q">${item.q}</div>
      <div class="quiz-options">
        ${item.options.map((opt, i) => `<button class="quiz-opt" data-idx="${i}">${opt}</button>`).join("")}
      </div>
      <div class="quiz-feedback" id="quizFeedback"></div>
      <div class="quiz-footer">
        <button class="ghost-btn" id="quizRestart">↺ Restart Quiz</button>
        <button class="action-btn btn-beta" id="quizNext" ${quizIdx === QUIZ_QUESTIONS.length - 1 ? "" : ""}>
          ${quizIdx === QUIZ_QUESTIONS.length - 1 ? "Finish & Reset" : "Next Question →"}
        </button>
      </div>
    `;

    let answered = false;
    const fb = document.getElementById("quizFeedback");

    quizContainer.querySelectorAll(".quiz-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const chosen = parseInt(btn.dataset.idx, 10);
        const allBtns = quizContainer.querySelectorAll(".quiz-opt");
        allBtns.forEach((b) => (b.disabled = true));
        allBtns[item.ans].classList.add("correct");

        if (chosen === item.ans) {
          quizScore++;
          fb.innerHTML = `<strong style="color:var(--stable)">✓ Spot on!</strong> ${item.explain}`;
        } else {
          btn.classList.add("wrong");
          fb.innerHTML = `<strong style="color:var(--unstable)">✗ Not quite!</strong> ${item.explain}`;
        }
        fb.classList.add("show");
      });
    });

    document.getElementById("quizRestart").addEventListener("click", () => {
      quizIdx = 0;
      quizScore = 0;
      renderQuiz();
    });

    document.getElementById("quizNext").addEventListener("click", () => {
      if (quizIdx < QUIZ_QUESTIONS.length - 1) {
        quizIdx++;
      } else {
        quizIdx = 0;
        quizScore = 0;
      }
      renderQuiz();
    });
  }

  renderQuiz();

  /* ------------------------------------------------------------------------
     10. MAIN ANIMATION LOOP (Only renders the active slide's canvas)
     ------------------------------------------------------------------------ */
  function tick(t) {
    drawHeroAtom(t);
    drawBuilderAtom(t);
    drawAlphaSim(t);
    drawBetaSim(t);
    drawGammaSim(t);
    drawPenetrationSim(t);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Initialize Slide 1 state
  goToSlide(0);
})();
