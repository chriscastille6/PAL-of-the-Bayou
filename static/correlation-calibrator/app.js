(() => {
  "use strict";

  const items = window.CORRELATION_ITEMS;
  const N_POINTS = 90;
  const PHASES = [
    "Intuitive",
    "Single-event",
    "Medical",
    "Business",
    "Mixed",
  ];
  const LIM = 3.2;

  const el = {
    welcome: document.getElementById("welcome"),
    game: document.getElementById("game"),
    done: document.getElementById("done"),
    start: document.getElementById("startBtn"),
    restart: document.getElementById("restartBtn"),
    submit: document.getElementById("submitBtn"),
    next: document.getElementById("nextBtn"),
    slider: document.getElementById("guess"),
    guessReadout: document.getElementById("guessReadout"),
    progressMeta: document.getElementById("progressMeta"),
    phasePills: document.getElementById("phasePills"),
    var1: document.getElementById("var1"),
    var2: document.getElementById("var2"),
    itemDesc: document.getElementById("itemDesc"),
    reveal: document.getElementById("reveal"),
    trueR: document.getElementById("trueR"),
    yourGuess: document.getElementById("yourGuess"),
    absError: document.getElementById("absError"),
    interpretation: document.getElementById("interpretation"),
    obvious: document.getElementById("obvious"),
    context: document.getElementById("context"),
    ladder: document.getElementById("ladder"),
    besdHigh: document.getElementById("besdHigh"),
    besdLow: document.getElementById("besdLow"),
    besdHighLbl: document.getElementById("besdHighLbl"),
    besdLowLbl: document.getElementById("besdLowLbl"),
    besdNote: document.getElementById("besdNote"),
    canvas: document.getElementById("scatter"),
    canvasCaption: document.getElementById("canvasCaption"),
    legend: document.getElementById("scatterLegend"),
    meanError: document.getElementById("meanError"),
    scoreLine: document.getElementById("scoreLine"),
  };

  const state = {
    index: 0,
    revealed: false,
    errors: [],
    lastGuess: 0,
    /** Fixed latent normals for smooth morphing as r changes */
    latents: [],
  };

  function clamp(x, a, b) {
    return Math.max(a, Math.min(b, x));
  }

  function fmtR(r) {
    const sign = r > 0 ? "+" : r < 0 ? "−" : "";
    const abs = Math.abs(r).toFixed(2);
    return sign === "−" ? `−${abs}` : sign + abs;
  }

  function funderBand(absR) {
    if (absR < 0.05) {
      return {
        rung: ".05",
        interpretation:
          "Very small in a single event; likely consequential only when outcomes accumulate over many repetitions.",
        obvious:
          "Everyday feel: almost never visible in a single encounter — you need many repetitions to notice a pattern.",
      };
    }
    if (absR < 0.1) {
      return {
        rung: ".10",
        interpretation:
          "Small in a single event; can become meaningful over repeated decisions or interactions.",
        obvious:
          "Everyday feel: still hard to see once; subtle even when you know what to look for.",
      };
    }
    if (absR < 0.2) {
      return {
        rung: ".10",
        interpretation:
          "Still modest for one event, but often practically meaningful when scaled across people or time.",
        obvious:
          "Everyday feel: occasionally noticeable if you attend carefully; easy to miss in noisy settings.",
      };
    }
    if (absR < 0.3) {
      return {
        rung: ".20",
        interpretation:
          "Medium and useful even in the short run; typically more important in the long run.",
        obvious:
          "Everyday feel: often useful to notice in the short run — like many solid workplace predictors.",
      };
    }
    if (absR < 0.4) {
      return {
        rung: ".30",
        interpretation:
          "Large in psychological research; often consequential in both short-run and long-run contexts.",
        obvious:
          "Everyday feel: fairly conspicuous when you compare people across situations.",
      };
    }
    return {
      rung: ".40+",
      interpretation:
        "Very large for psychological research — as conspicuous as height and weight. Effects this large are rare and often overestimated.",
      obvious:
        "Everyday feel: as obvious as height and weight — you can see it nearly every day.",
    };
  }

  /** Deterministic RNG so each item keeps a stable cloud while the slider morphs. */
  function mulberry32(seed) {
    let t = seed >>> 0;
    return function next() {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeLatents(seed) {
    const rnd = mulberry32(seed * 9973 + 42);
    const out = [];
    for (let i = 0; i < N_POINTS; i++) {
      const u1 = rnd() || 1e-12;
      const u2 = rnd() || 1e-12;
      const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
      out.push([z1, z2]);
    }
    return out;
  }

  function cloudFromLatents(r) {
    const s = Math.sqrt(Math.max(0, 1 - r * r));
    return state.latents.map(([z1, z2]) => [z1, r * z1 + s * z2]);
  }

  function toPlot(x, y, pad, plotW, plotH) {
    const px = pad + ((x + LIM) / (2 * LIM)) * plotW;
    const py = pad + plotH - ((y + LIM) / (2 * LIM)) * plotH;
    return [px, py];
  }

  function lineEnds(r, pad, plotW, plotH) {
    const x0 = -LIM;
    const x1 = LIM;
    return [
      toPlot(x0, r * x0, pad, plotW, plotH),
      toPlot(x1, r * x1, pad, plotW, plotH),
    ];
  }

  /**
   * @param {object} opts
   * @param {number} opts.cloudR  correlation used for the point cloud
   * @param {number} [opts.guessR]
   * @param {number} [opts.trueR]
   * @param {boolean} [opts.showError]
   * @param {string} opts.label
   */
  function drawScatter(opts) {
    const { cloudR, guessR, trueR, showError, label } = opts;
    const canvas = el.canvas;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth || 360;
    const cssH = canvas.clientHeight || 360;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, cssW, cssH);
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, cssW, cssH);

    const pad = 28;
    const axisH = showError ? 36 : 0;
    const plotW = cssW - pad * 2;
    const plotH = cssH - pad * 2 - axisH;

    // axes
    ctx.strokeStyle = "#d4d0c8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, pad);
    ctx.lineTo(pad, pad + plotH);
    ctx.lineTo(pad + plotW, pad + plotH);
    ctx.stroke();

    const midX = pad + plotW / 2;
    const midY = pad + plotH / 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(midX, pad);
    ctx.lineTo(midX, pad + plotH);
    ctx.moveTo(pad, midY);
    ctx.lineTo(pad + plotW, midY);
    ctx.stroke();
    ctx.setLineDash([]);

    const pts = cloudFromLatents(cloudR);
    ctx.fillStyle = showError
      ? "rgba(30, 77, 123, 0.55)"
      : "rgba(130, 39, 39, 0.72)";
    for (const [x, y] of pts) {
      const [px, py] = toPlot(x, y, pad, plotW, plotH);
      ctx.beginPath();
      ctx.arc(px, py, 3.1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Guess line (always while guessing; keep after reveal for comparison)
    if (guessR != null && Number.isFinite(guessR)) {
      const [[g0x, g0y], [g1x, g1y]] = lineEnds(guessR, pad, plotW, plotH);
      ctx.strokeStyle = "#822727";
      ctx.lineWidth = showError ? 2.5 : 2.5;
      ctx.setLineDash(showError ? [7, 5] : []);
      ctx.beginPath();
      ctx.moveTo(g0x, g0y);
      ctx.lineTo(g1x, g1y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // True line pops in on reveal
    if (showError && trueR != null && Number.isFinite(trueR)) {
      const [[t0x, t0y], [t1x, t1y]] = lineEnds(trueR, pad, plotW, plotH);
      ctx.strokeStyle = "#1e4d7b";
      ctx.lineWidth = 3.25;
      ctx.beginPath();
      ctx.moveTo(t0x, t0y);
      ctx.lineTo(t1x, t1y);
      ctx.stroke();

      // Soft highlight pulse ring at center for “pop”
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = "#1e4d7b";
      ctx.beginPath();
      ctx.arc(midX, midY, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 1D error ruler: guess → true on r ∈ [-1, 1]
    if (showError && guessR != null && trueR != null) {
      const ay = cssH - 18;
      const ax0 = pad;
      const ax1 = pad + plotW;
      const mapR = (r) => ax0 + ((r + 1) / 2) * (ax1 - ax0);

      ctx.strokeStyle = "#cfc9be";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ax0, ay);
      ctx.lineTo(ax1, ay);
      ctx.stroke();

      // tick marks
      for (const t of [-1, -0.5, 0, 0.5, 1]) {
        const tx = mapR(t);
        ctx.beginPath();
        ctx.moveTo(tx, ay - 4);
        ctx.lineTo(tx, ay + 4);
        ctx.stroke();
      }

      const gx = mapR(clamp(guessR, -1, 1));
      const tx = mapR(clamp(trueR, -1, 1));

      // error segment
      ctx.strokeStyle = "#9a6b12";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(gx, ay);
      ctx.lineTo(tx, ay);
      ctx.stroke();

      // guess marker
      ctx.fillStyle = "#822727";
      ctx.beginPath();
      ctx.arc(gx, ay, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // true marker (pops larger)
      ctx.fillStyle = "#1e4d7b";
      ctx.beginPath();
      ctx.arc(tx, ay, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#6b7280";
      ctx.font = "600 11px 'Source Sans 3', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("−1", ax0, ay - 8);
      ctx.fillText("+1", ax1, ay - 8);
      ctx.fillText("error on r", (ax0 + ax1) / 2, ay - 8);
    }

    el.canvasCaption.textContent = label;
    if (el.legend) {
      if (showError) {
        el.legend.hidden = false;
        el.legend.innerHTML =
          `<span class="leg guess">Your guess ${fmtR(guessR)}</span>` +
          `<span class="leg true">Published ${fmtR(trueR)}</span>` +
          `<span class="leg err">|Error| ${(Math.abs(guessR - trueR)).toFixed(2)}</span>`;
      } else {
        el.legend.hidden = true;
        el.legend.innerHTML = "";
      }
    }
  }

  function refreshScatter() {
    const guess = Number(el.slider.value);
    if (!state.revealed) {
      drawScatter({
        cloudR: guess,
        guessR: guess,
        showError: false,
        label: `Your guess visualized (r = ${fmtR(guess)})`,
      });
      return;
    }
    const item = items[state.index];
    const trueR = item.r;
    drawScatter({
      cloudR: trueR,
      guessR: state.lastGuess,
      trueR,
      showError: true,
      label: `Published estimate pops in (r = ${fmtR(trueR)}${
        item.n ? `, N ≈ ${item.n.toLocaleString()}` : ""
      })`,
    });
  }

  function updateGuessReadout() {
    const g = Number(el.slider.value);
    el.guessReadout.textContent = fmtR(g);
    if (!state.revealed) {
      refreshScatter();
    }
  }

  function firstIndexForPhase(phase) {
    return items.findIndex((it) => it.phase === phase);
  }

  function renderPhases() {
    const current = items[state.index]?.phase;
    const seen = new Set(items.slice(0, state.index).map((i) => i.phase));
    el.phasePills.setAttribute("aria-hidden", "false");
    el.phasePills.innerHTML = PHASES.map((p) => {
      let cls = "pill";
      if (p === current && !el.welcome.hidden) cls += " active";
      else if (p === current && el.game && !el.game.hidden) cls += " active";
      else if (seen.has(p) && p !== current) cls += " done";
      return `<button type="button" class="${cls}" data-phase="${p}">${p}</button>`;
    }).join("");
  }

  function jumpToPhase(phase) {
    const idx = firstIndexForPhase(phase);
    if (idx < 0) return;
    el.welcome.hidden = true;
    el.done.hidden = true;
    el.game.hidden = false;
    state.index = idx;
    loadItem();
  }

  function highlightLadder(rung) {
    el.ladder.querySelectorAll(".rung").forEach((node) => {
      node.classList.toggle("on", node.dataset.rung === rung);
    });
  }

  function showBesd(r) {
    const high = 0.5 + r / 2;
    const low = 0.5 - r / 2;
    const hPct = clamp(high * 100, 0, 100);
    const lPct = clamp(low * 100, 0, 100);
    el.besdHigh.style.width = `${hPct}%`;
    el.besdLow.style.width = `${lPct}%`;
    el.besdHighLbl.textContent = `${Math.round(hPct)}%`;
    el.besdLowLbl.textContent = `${Math.round(lPct)}%`;
    const gap = Math.round(Math.abs(r) * 100);
    el.besdNote.textContent = `BESD intuition: about a ${gap}-point success-rate gap between “high” and “low” groups (Rosenthal & Rubin).`;
  }

  function loadItem() {
    if (state.index >= items.length) {
      finish();
      return;
    }
    const item = items[state.index];
    state.revealed = false;
    state.lastGuess = 0;
    state.latents = makeLatents(state.index + 1);

    el.var1.textContent = item.variable1;
    el.var2.textContent = item.variable2;
    el.itemDesc.textContent = item.description;
    el.progressMeta.textContent = `Item ${state.index + 1} of ${items.length} · ${item.phase}`;
    el.slider.value = "0";
    el.slider.disabled = false;
    el.submit.disabled = false;
    el.next.hidden = true;
    el.reveal.hidden = true;
    el.context.textContent = "";

    renderPhases();
    updateGuessReadout();
  }

  function submitGuess() {
    const item = items[state.index];
    const guess = Number(el.slider.value);
    const err = Math.abs(guess - item.r);
    state.errors.push(err);
    state.lastGuess = guess;
    state.revealed = true;

    const band = funderBand(Math.abs(item.r));
    el.trueR.textContent = fmtR(item.r);
    el.yourGuess.textContent = fmtR(guess);
    el.absError.textContent = err.toFixed(2);
    el.interpretation.textContent = band.interpretation;
    el.obvious.textContent = band.obvious;
    el.context.textContent = item.context;
    highlightLadder(band.rung);
    showBesd(item.r);
    refreshScatter();

    // Brief CSS pop on metrics
    el.reveal.classList.remove("pop");
    void el.reveal.offsetWidth;
    el.reveal.classList.add("pop");

    el.slider.disabled = true;
    el.submit.disabled = true;
    el.next.hidden = false;
    el.reveal.hidden = false;
  }

  function finish() {
    el.game.hidden = true;
    el.done.hidden = false;
    const mean =
      state.errors.reduce((a, b) => a + b, 0) / Math.max(1, state.errors.length);
    el.meanError.textContent = mean.toFixed(2);
    el.scoreLine.textContent =
      mean < 0.1
        ? "Excellent calibration — you are close to published estimates."
        : mean < 0.2
          ? "Solid start. The misses are the point: update your sense of “obvious.”"
          : "Useful miss rate. Small workplace effects will keep surprising you — that’s the lesson.";
    renderPhases();
  }

  function start(fromPhase) {
    state.errors = [];
    el.welcome.hidden = true;
    el.done.hidden = true;
    el.game.hidden = false;
    if (fromPhase) {
      const idx = firstIndexForPhase(fromPhase);
      state.index = idx >= 0 ? idx : 0;
    } else {
      state.index = 0;
    }
    loadItem();
  }

  el.start.addEventListener("click", () => start());
  el.restart.addEventListener("click", () => start());
  el.submit.addEventListener("click", submitGuess);
  el.next.addEventListener("click", () => {
    state.index += 1;
    loadItem();
  });
  el.slider.addEventListener("input", updateGuessReadout);

  el.phasePills.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-phase]");
    if (!btn) return;
    const phase = btn.getAttribute("data-phase");
    jumpToPhase(phase);
  });

  // Show pills on welcome too so users can jump in
  renderPhases();

  window.addEventListener("resize", () => {
    if (!el.game.hidden) refreshScatter();
  });
})();
