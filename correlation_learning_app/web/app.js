(() => {
  "use strict";

  const items = window.CORRELATION_ITEMS;
  /** Fallback when item.n is null/0/missing (e.g. baseball). */
  const DEFAULT_N = 80;
  /**
   * Soft cap for extreme Ns (e.g. ~194k). Prefer full N for Meyer sizes
   * like 19,724; only subsample above this threshold.
   */
  const DRAW_CAP = 100000;
  const PHASES = [
    "Medical",
    "Intuitive",
    "Single-event",
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
    besdNote: document.getElementById("besdNote"),
    sampleN: document.getElementById("sampleN"),
    expectancy: document.getElementById("expectancy"),
    expGuessHighCol: document.getElementById("expGuessHighCol"),
    expGuessLowCol: document.getElementById("expGuessLowCol"),
    expGuessHigh: document.getElementById("expGuessHigh"),
    expGuessLow: document.getElementById("expGuessLow"),
    expGuessHighLbl: document.getElementById("expGuessHighLbl"),
    expGuessLowLbl: document.getElementById("expGuessLowLbl"),
    expTrueHigh: document.getElementById("expTrueHigh"),
    expTrueLow: document.getElementById("expTrueLow"),
    expTrueHighLbl: document.getElementById("expTrueHighLbl"),
    expTrueLowLbl: document.getElementById("expTrueLowLbl"),
    expTrueHighSeries: document.getElementById("expTrueHighSeries"),
    expTrueLowSeries: document.getElementById("expTrueLowSeries"),
    canvas: document.getElementById("scatter"),
    canvasCaption: document.getElementById("canvasCaption"),
    legend: document.getElementById("scatterLegend"),
    publishedChip: document.getElementById("publishedChip"),
    publishedChipValue: document.getElementById("publishedChipValue"),
    meanError: document.getElementById("meanError"),
    scoreLine: document.getElementById("scoreLine"),
  };

  const state = {
    index: 0,
    revealed: false,
    errors: [],
    lastGuess: 0,
    /** Fixed latent normals for smooth morphing as r changes */
    latents: null,
    /** Resolved sample size for the current item */
    sample: { reported: null, drawN: DEFAULT_N, capped: false },
    scatterRaf: 0,
  };

  function clamp(x, a, b) {
    return Math.max(a, Math.min(b, x));
  }

  function fmtR(r) {
    const sign = r > 0 ? "+" : r < 0 ? "−" : "";
    const abs = Math.abs(r).toFixed(2);
    return sign === "−" ? `−${abs}` : sign + abs;
  }

  /**
   * Map item.n → how many dots to draw.
   * @returns {{ reported: number|null, drawN: number, capped: boolean }}
   */
  function resolveSample(item) {
    const raw = item?.n;
    if (raw == null || !Number.isFinite(raw) || raw <= 0) {
      return { reported: null, drawN: DEFAULT_N, capped: false };
    }
    const reported = Math.round(raw);
    if (reported > DRAW_CAP) {
      return { reported, drawN: DRAW_CAP, capped: true };
    }
    return { reported, drawN: reported, capped: false };
  }

  /** Badge / caption text matching the points actually drawn. */
  function formatSampleLabel(sample) {
    if (!sample || sample.reported == null) return "N not reported";
    if (sample.capped) {
      return `showing ${sample.drawN.toLocaleString()} of ${sample.reported.toLocaleString()}`;
    }
    return `N ≈ ${sample.reported.toLocaleString()}`;
  }

  function pointSizeForN(n) {
    if (n >= 50000) return 1;
    if (n >= 10000) return 1.35;
    if (n >= 2000) return 1.75;
    if (n >= 400) return 2.4;
    return 3.1;
  }

  function pointFill(showError, n) {
    const a =
      n >= 20000 ? 0.22 : n >= 5000 ? 0.32 : n >= 800 ? 0.48 : showError ? 0.55 : 0.72;
    return showError
      ? `rgba(30, 77, 123, ${a})`
      : `rgba(130, 39, 39, ${a})`;
  }

  /** BESD success rates: high/low groups = 0.5 ± r/2 */
  function besdRates(r) {
    const high = clamp((0.5 + r / 2) * 100, 0, 100);
    const low = clamp((0.5 - r / 2) * 100, 0, 100);
    return { high, low, gap: Math.round(Math.abs(r) * 100) };
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

  /** Build N latent (z1, z2) pairs once per item so the cloud morphs with r. */
  function makeLatents(seed, n) {
    const count = Math.max(1, Math.round(n) || DEFAULT_N);
    const z1 = new Float32Array(count);
    const z2 = new Float32Array(count);
    const rnd = mulberry32(seed * 9973 + 42);
    for (let i = 0; i < count; i++) {
      const u1 = rnd() || 1e-12;
      const u2 = rnd() || 1e-12;
      const mag = Math.sqrt(-2 * Math.log(u1));
      const ang = 2 * Math.PI * u2;
      z1[i] = mag * Math.cos(ang);
      z2[i] = mag * Math.sin(ang);
    }
    return { z1, z2, n: count };
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

    // Point cloud: item.n dots (or DEFAULT_N / capped drawN)
    const latents = state.latents;
    const nDots = latents ? latents.n : 0;
    if (latents && nDots > 0) {
      const r = cloudR;
      const s = Math.sqrt(Math.max(0, 1 - r * r));
      const size = pointSizeForN(nDots);
      const half = size / 2;
      ctx.fillStyle = pointFill(!!showError, nDots);

      // Efficient draw: fillRect for dense clouds (no per-point beginPath)
      const { z1, z2 } = latents;
      const xScale = plotW / (2 * LIM);
      const yScale = plotH / (2 * LIM);
      const ox = pad + plotW / 2;
      const oy = pad + plotH / 2;
      if (nDots >= 400) {
        for (let i = 0; i < nDots; i++) {
          const px = ox + z1[i] * xScale;
          const py = oy - (r * z1[i] + s * z2[i]) * yScale;
          ctx.fillRect(px - half, py - half, size, size);
        }
      } else {
        for (let i = 0; i < nDots; i++) {
          const px = ox + z1[i] * xScale;
          const py = oy - (r * z1[i] + s * z2[i]) * yScale;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Guess line (always while guessing; keep after reveal for comparison)
    if (guessR != null && Number.isFinite(guessR)) {
      const [[g0x, g0y], [g1x, g1y]] = lineEnds(guessR, pad, plotW, plotH);
      ctx.strokeStyle = "#822727";
      ctx.lineWidth = showError ? 2 : 2.75;
      ctx.setLineDash(showError ? [7, 5] : []);
      ctx.beginPath();
      ctx.moveTo(g0x, g0y);
      ctx.lineTo(g1x, g1y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // True / published line pops in on reveal — thicker + higher contrast
    if (showError && trueR != null && Number.isFinite(trueR)) {
      const [[t0x, t0y], [t1x, t1y]] = lineEnds(trueR, pad, plotW, plotH);
      ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(t0x, t0y);
      ctx.lineTo(t1x, t1y);
      ctx.stroke();
      ctx.strokeStyle = "#1e4d7b";
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.moveTo(t0x, t0y);
      ctx.lineTo(t1x, t1y);
      ctx.stroke();
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
    if (el.publishedChip && el.publishedChipValue) {
      if (showError && trueR != null && Number.isFinite(trueR)) {
        el.publishedChip.hidden = false;
        el.publishedChipValue.textContent = fmtR(trueR);
      } else {
        el.publishedChip.hidden = true;
        el.publishedChipValue.textContent = "—";
      }
    }
    if (el.legend) {
      if (showError) {
        el.legend.hidden = false;
        el.legend.innerHTML =
          `<span class="leg true">Published r = ${fmtR(trueR)}</span>` +
          `<span class="leg guess">Your guess ${fmtR(guessR)}</span>` +
          `<span class="leg err">|Error| ${(Math.abs(guessR - trueR)).toFixed(2)}</span>`;
      } else {
        el.legend.hidden = true;
        el.legend.innerHTML = "";
      }
    }
  }

  function setSampleN(sample) {
    if (!el.sampleN) return;
    el.sampleN.textContent = formatSampleLabel(sample || state.sample);
  }

  function setBar(barEl, lblEl, pct) {
    if (!barEl || !lblEl) return;
    const rounded = Math.round(pct);
    barEl.style.height = `${clamp(pct, 0, 100)}%`;
    lblEl.textContent = `${rounded}%`;
  }

  /**
   * Expectancy bar chart under the scatter.
   * While guessing: live BESD from the slider.
   * After reveal: guess vs published side-by-side.
   */
  function updateExpectancy(guessR, trueR, revealed) {
    if (!el.expectancy) return;
    const g = besdRates(guessR);

    if (!revealed) {
      el.expectancy.classList.add("guess-mode");
      el.expGuessHighCol.hidden = true;
      el.expGuessLowCol.hidden = true;
      el.expTrueHighSeries.textContent = "Guess";
      el.expTrueLowSeries.textContent = "Guess";
      setBar(el.expTrueHigh, el.expTrueHighLbl, g.high);
      setBar(el.expTrueLow, el.expTrueLowLbl, g.low);
      el.besdNote.textContent = `Your guess (r = ${fmtR(guessR)}): about a ${g.gap}-point success-rate gap between above-median and below-median groups (0.5 ± r/2).`;
      return;
    }

    const t = besdRates(trueR);
    el.expectancy.classList.remove("guess-mode");
    el.expGuessHighCol.hidden = false;
    el.expGuessLowCol.hidden = false;
    el.expTrueHighSeries.textContent = "Published";
    el.expTrueLowSeries.textContent = "Published";
    setBar(el.expGuessHigh, el.expGuessHighLbl, g.high);
    setBar(el.expGuessLow, el.expGuessLowLbl, g.low);
    setBar(el.expTrueHigh, el.expTrueHighLbl, t.high);
    setBar(el.expTrueLow, el.expTrueLowLbl, t.low);
    el.besdNote.textContent = `Published r = ${fmtR(trueR)}: about a ${t.gap}-point success-rate gap (Rosenthal & Rubin BESD). Maroon = your guess; blue = published.`;
  }

  function refreshScatter() {
    const guess = Number(el.slider.value);
    const item = items[state.index];
    const sampleLabel = formatSampleLabel(state.sample);
    setSampleN(state.sample);

    if (!state.revealed) {
      drawScatter({
        cloudR: guess,
        guessR: guess,
        showError: false,
        label: `Your guess visualized (r = ${fmtR(guess)}) · ${sampleLabel}`,
      });
      updateExpectancy(guess, null, false);
      return;
    }
    const trueR = item.r;
    drawScatter({
      cloudR: trueR,
      guessR: state.lastGuess,
      trueR,
      showError: true,
      label: `Published r = ${fmtR(trueR)} · ${sampleLabel}`,
    });
    updateExpectancy(state.lastGuess, trueR, true);
  }

  function scheduleScatterRefresh() {
    if (state.scatterRaf) return;
    state.scatterRaf = requestAnimationFrame(() => {
      state.scatterRaf = 0;
      refreshScatter();
    });
  }

  function updateGuessReadout() {
    const g = Number(el.slider.value);
    el.guessReadout.textContent = fmtR(g);
    if (!state.revealed) {
      scheduleScatterRefresh();
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

  function loadItem() {
    if (state.index >= items.length) {
      finish();
      return;
    }
    const item = items[state.index];
    state.revealed = false;
    state.lastGuess = 0;
    state.sample = resolveSample(item);
    state.latents = makeLatents(state.index + 1, state.sample.drawN);

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
    if (el.publishedChip) el.publishedChip.hidden = true;
    if (el.publishedChipValue) el.publishedChipValue.textContent = "—";
    setSampleN(state.sample);

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
