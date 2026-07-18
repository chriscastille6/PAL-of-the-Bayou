/**
 * AOL rubric web template — shared 5-point competence scale (Novice → Exceptional).
 * Loads definitions via fetch(jsonUrl), or window.__AOL_RUBRIC_DEFINITIONS__ if fetch fails / file://
 */
(function (global) {
  "use strict";

  var SCALE_SHORT = ["Novice", "Learner", "Proficient", "Advanced", "Exceptional"];

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderScaleHelp(scaleRows) {
    var rows = scaleRows || [];
    var illustrativeNote =
      '<p class="scale-illustrative-note">' +
      "The <strong>Novice \u2192 Exceptional</strong> labels describe <strong>general competence</strong> on one shared scale across criteria. " +
      "On this demo they are shown <strong>for illustrative purposes</strong> (layout, committee review, print-to-PDF); " +
      "official wording and any program-specific rules remain in the approved rubric masters.</p>";
    var goalNote =
      '<p class="scale-target-note"><strong>Program goal:</strong> ' +
      "At least <strong>90%</strong> of students should meet each criterion at the " +
      "<strong>Proficient</strong> level (3) or higher.</p>";
    var tr = rows
      .map(function (r) {
        var rowClass = r.level === 3 ? ' class="scale-row-target"' : "";
        return (
          "<tr" +
          rowClass +
          "><td>" +
          r.level +
          "</td><td>" +
          escapeHtml(r.label) +
          "</td><td>" +
          escapeHtml(r.description) +
          "</td></tr>"
        );
      })
      .join("");
    return (
      '<details class="scale-help">' +
      "<summary>Competence scale (1–5) — full descriptions</summary>" +
      illustrativeNote +
      goalNote +
      "<table><thead><tr><th>#</th><th>Label</th><th>Description</th></tr></thead><tbody>" +
      tr +
      "</tbody></table></details>"
    );
  }

  function dimensionFacetAnchorsComplete(dim, bulletCount) {
    if (!dim.facet_anchors || dim.facet_anchors.length !== bulletCount) return false;
    for (var i = 0; i < bulletCount; i++) {
      if (!dim.facet_anchors[i] || dim.facet_anchors[i].length !== 5) return false;
    }
    return true;
  }

  function renderBehaviorAnchors(dim, scaleRows, opts) {
    opts = opts || {};
    var facetIndex = opts.facetIndex;
    var anchors = dim.anchors;
    var facetInterim = false;
    if (typeof facetIndex === "number") {
      var fa = dim.facet_anchors && dim.facet_anchors[facetIndex];
      if (fa && fa.length === 5) {
        anchors = fa;
      } else {
        facetInterim = true;
      }
    }
    if (!anchors || anchors.length !== 5) return "";
    var rows = scaleRows || [];
    var tr = anchors
      .map(function (text, i) {
        var level = i + 1;
        var label =
          rows[i] && rows[i].label ? rows[i].label : SCALE_SHORT[i];
        var rowClass = level === 3 ? ' class="scale-row-target"' : "";
        return (
          "<tr" +
          rowClass +
          "><td>" +
          level +
          "</td><td>" +
          escapeHtml(label) +
          "</td><td>" +
          escapeHtml(text) +
          "</td></tr>"
        );
      })
      .join("");
    var facetMode = typeof facetIndex === "number";
    var summaryText = facetMode
      ? "Behavioral anchors for this facet (defend your rating)"
      : "Behavioral anchors for this criterion (defend your rating)";
    var obsHeader = facetMode ? "Observable behavior (this facet)" : "Observable behavior (this criterion)";
    var interimNote =
      facetMode && facetInterim
        ? '<p class="bars-interim-note">Interim: dimension-level BARS shown for this facet until facet-specific anchors are added.</p>'
        : "";
    return (
      '<details class="bars-help">' +
      "<summary>" +
      escapeHtml(summaryText) +
      "</summary>" +
      interimNote +
      '<p class="bars-note">Observable behaviors for <strong>' +
      (facetMode ? "this facet" : "this outcome") +
      "</strong>. Match the student\u2019s performance to one level; use the college-wide labels (Novice\u2192Exceptional) consistently with the competence scale above.</p>" +
      '<table class="bars-table"><thead><tr><th>#</th><th>Label</th><th>' +
      escapeHtml(obsHeader) +
      "</th></tr></thead><tbody>" +
      tr +
      "</tbody></table></details>"
    );
  }

  function renderLikert(namePrefix, dimIndex, ariaLabel, facetIndex) {
    var isFacet = typeof facetIndex === "number";
    var nameAttr = isFacet
      ? namePrefix + "-" + dimIndex + "-f-" + facetIndex
      : namePrefix + "-" + dimIndex;
    var parts = [];
    for (var v = 1; v <= 5; v++) {
      var id = isFacet
        ? namePrefix + "-" + dimIndex + "-f-" + facetIndex + "-" + v
        : namePrefix + "-" + dimIndex + "-" + v;
      var shortLabel = SCALE_SHORT[v - 1];
      parts.push(
        '<div class="likert-option">' +
          '<input type="radio" id="' +
          id +
          '" name="' +
          nameAttr +
          '" value="' +
          v +
          '" />' +
          '<label for="' +
          id +
          '"><div class="font-semibold">' +
          v +
          '</div><div class="text-xs text-gray-600">' +
          escapeHtml(shortLabel) +
          "</div></label></div>"
      );
    }
    return (
      '<div class="likert-scale" role="radiogroup" aria-label="' +
      escapeHtml(ariaLabel) +
      '">' +
      parts.join("") +
      "</div>"
    );
  }

  function renderDimensions(def, namePrefix, data) {
    var scaleRows = data && data.scale_rows ? data.scale_rows : [];
    var unbundle = def.unbundle_bullets === true;
    var html = [];
    def.dimensions.forEach(function (dim, idx) {
      var num = idx + 1;
      var bulletArr = dim.bullets || [];
      var bullets = bulletArr
        .map(function (b) {
          return "<li>" + escapeHtml(b) + "</li>";
        })
        .join("");
      var commentId = "criterion-comment-" + namePrefix + "-" + num;

      var core =
        '<div class="card-rubric">' +
        '<h2 style="display:flex;align-items:center;"><span class="item-num">' +
        num +
        "</span> " +
        escapeHtml(dim.name) +
        "</h2>" +
        '<ul class="criterion-list">' +
        bullets +
        "</ul>";

      if (unbundle && bulletArr.length > 0) {
        var facetBlocks = [];
        var facetsComplete = dimensionFacetAnchorsComplete(dim, bulletArr.length);
        var unbundleNote =
          '<p class="unbundle-facet-note">' +
          (facetsComplete
            ? "Each bullet is rated separately on the same 5-point scale. BARS in each dropdown describe this facet only."
            : "Each bullet is rated separately on the same 5-point scale. Some facets use interim dimension-level BARS until facet-specific anchors are added.") +
          "</p>";
        bulletArr.forEach(function (bullet, fi) {
          facetBlocks.push(
            '<div class="criterion-facet">' +
              '<h3 class="facet-heading"><span class="facet-num">' +
              (fi + 1) +
              "</span> " +
              escapeHtml(bullet) +
              "</h3>" +
              renderBehaviorAnchors(dim, scaleRows, { facetIndex: fi }) +
              renderLikert(namePrefix, num, dim.name + " — " + bullet + " rating", fi) +
              "</div>"
          );
        });
        html.push(
          core +
            unbundleNote +
            facetBlocks.join("") +
            '<div class="criterion-comment-wrap">' +
            '<label class="criterion-comment-label" for="' +
            commentId +
            '">Comment for this criterion <span class="text-muted">(optional)</span></label>' +
            '<textarea class="criterion-comment" id="' +
            commentId +
            '" name="' +
            namePrefix +
            "-comment-" +
            num +
            '" rows="3" placeholder="Brief evidence or notes for ' +
            escapeHtml(dim.name) +
            ' — avoid identifying other students or unrelated third parties." aria-label="Comment for ' +
            escapeHtml(dim.name) +
            '"></textarea>' +
            "</div>" +
            "</div>"
        );
      } else {
        html.push(
          core +
            renderBehaviorAnchors(dim, scaleRows) +
            renderLikert(namePrefix, num, dim.name + " rating") +
            '<div class="criterion-comment-wrap">' +
            '<label class="criterion-comment-label" for="' +
            commentId +
            '">Comment for this criterion <span class="text-muted">(optional)</span></label>' +
            '<textarea class="criterion-comment" id="' +
            commentId +
            '" name="' +
            namePrefix +
            "-comment-" +
            num +
            '" rows="3" placeholder="Brief evidence or notes for ' +
            escapeHtml(dim.name) +
            ' — avoid identifying other students or unrelated third parties." aria-label="Comment for ' +
            escapeHtml(dim.name) +
            '"></textarea>' +
            "</div>" +
            "</div>"
        );
      }
    });
    return html.join("");
  }

  function buildRatingLines(def) {
    var lines = [];
    var unbundle = def.unbundle_bullets === true;
    def.dimensions.forEach(function (dim, dIdx) {
      var bullets = dim.bullets || [];
      if (unbundle && bullets.length > 0) {
        bullets.forEach(function (bullet) {
          lines.push({
            label: dim.name + " — " + bullet,
            dim: dim
          });
        });
      } else {
        lines.push({
          label: dim.name,
          dim: dim
        });
      }
    });
    return lines;
  }

  function getFacetIndexForLine(def, lineIndex) {
    var unbundle = def.unbundle_bullets === true;
    var idx = 0;
    for (var d = 0; d < def.dimensions.length; d++) {
      var dim = def.dimensions[d];
      var bullets = dim.bullets || [];
      if (unbundle && bullets.length > 0) {
        for (var fi = 0; fi < bullets.length; fi++) {
          if (idx === lineIndex) return { dim: dim, facetIndex: fi };
          idx++;
        }
      } else {
        if (idx === lineIndex) return { dim: dim, facetIndex: null };
        idx++;
      }
    }
    return null;
  }

  function getAnchorsForRatingLine(dim, facetIndex) {
    if (typeof facetIndex === "number") {
      var fa = dim.facet_anchors && dim.facet_anchors[facetIndex];
      if (fa && fa.length === 5) return fa;
    }
    var a = dim.anchors;
    return a && a.length === 5 ? a : [];
  }

  function renderNichollsPrintBrand(variant) {
    if (variant === "compact") {
      return (
        '<div class="rubric-print-brand rubric-print-brand--compact" aria-label="Institution">' +
        '<span class="rubric-print-brand-compact-inner">' +
        "<strong>Nicholls State University</strong> · College of Business · Assessment of Learning" +
        "</span></div>"
      );
    }
    return (
      '<header class="rubric-print-brand" aria-label="Nicholls State University">' +
      '<div class="rubric-print-brand-row rubric-print-brand-row--primary">Nicholls State University</div>' +
      '<div class="rubric-print-brand-row rubric-print-brand-row--accent">' +
      "College of Business · Assessment of Learning" +
      "</div>" +
      "</header>"
    );
  }

  function renderPrintPack(def, data, key) {
    var scaleRows = data.scale_rows || [];
    var lines = buildRatingLines(def);
    var title = escapeHtml(def.title);
    var rubricKey = escapeHtml(key);
    var compact = lines.length > 14;
    var matrixClass = "rubric-print-matrix" + (compact ? " rubric-print-matrix--compact" : "");

    var tableRows = lines
      .map(function (line, idx) {
        var cells = [1, 2, 3, 4, 5]
          .map(function () {
            return '<td class="rubric-print-m-rate"><span class="rubric-print-m-cell"></span></td>';
          })
          .join("");
        return (
          "<tr>" +
          '<td class="rubric-print-m-idx">' +
          (idx + 1) +
          "</td>" +
          '<td class="rubric-print-m-crit">' +
          escapeHtml(line.label) +
          "</td>" +
          cells +
          "</tr>"
        );
      })
      .join("");

    var scaleLegend =
      '<p class="rubric-print-scale-legend"><strong>Scale:</strong> ' +
      "1 = Novice · 2 = Learner · 3 = Proficient · 4 = Advanced · 5 = Exceptional " +
      "(mark one column per row).</p>";

    var meta =
      '<div class="rubric-print-meta">' +
      '<div class="rubric-print-meta-grid">' +
      '<div class="rubric-print-meta-item"><span class="rubric-print-meta-label">Instructor</span><span class="rubric-print-meta-line" role="presentation"></span></div>' +
      '<div class="rubric-print-meta-item"><span class="rubric-print-meta-label">Student</span><span class="rubric-print-meta-line" role="presentation"></span></div>' +
      '<div class="rubric-print-meta-item"><span class="rubric-print-meta-label">Date</span><span class="rubric-print-meta-line" role="presentation"></span></div>' +
      '<div class="rubric-print-meta-item"><span class="rubric-print-meta-label">Score assigned</span><span class="rubric-print-meta-line" role="presentation"></span></div>' +
      "</div>" +
      '<p class="rubric-print-meta-note">Score assigned: overall composite or average as your program defines (e.g., mean of row ratings).</p>' +
      "</div>";

    var summaryHtml =
      '<section class="rubric-print-summary" aria-label="Scoring sheet (page 1)">' +
      renderNichollsPrintBrand("full") +
      '<header class="rubric-print-summary-hd">' +
      '<h1 class="rubric-print-title">' +
      title +
      "</h1>" +
      '<p class="rubric-print-sub">Rubric: <code>' +
      rubricKey +
      "</code> · Faculty scoring matrix · landscape · one page when possible.</p>" +
      meta +
      scaleLegend +
      "</header>" +
      '<table class="' +
      matrixClass +
      '">' +
      "<thead><tr>" +
      '<th class="rubric-print-m-idx" scope="col">#</th>' +
      '<th class="rubric-print-m-crit" scope="col">Criterion (rating line)</th>' +
      '<th class="rubric-print-m-h-rating" colspan="5" scope="colgroup">Rating</th>' +
      "</tr><tr>" +
      '<th class="rubric-print-m-sub" colspan="2" scope="colgroup"></th>' +
      SCALE_SHORT.map(function (s, i) {
        return (
          '<th class="rubric-print-m-lhead" scope="col">' +
          (i + 1) +
          "<br/><span class=\"rubric-print-m-lsub\">" +
          escapeHtml(s) +
          "</span></th>"
        );
      }).join("") +
      "</tr></thead><tbody>" +
      tableRows +
      "</tbody></table>" +
      '<p class="rubric-print-summary-foot">Following pages: full behavioral anchors (BARS) for each row.</p>' +
      "</section>";

    var descriptorBlocks = lines
      .map(function (line, idx) {
        var facetInfo = getFacetIndexForLine(def, idx);
        var dimForAnchors = facetInfo ? facetInfo.dim : line.dim;
        var facetIndex = facetInfo ? facetInfo.facetIndex : null;
        var anchors = getAnchorsForRatingLine(dimForAnchors, facetIndex);

        var tr = "";
        if (anchors.length === 5) {
          tr = anchors
            .map(function (text, i) {
              var level = i + 1;
              var label = scaleRows[i] && scaleRows[i].label ? scaleRows[i].label : SCALE_SHORT[i];
              var rowClass = level === 3 ? ' class="rubric-print-bars-target"' : "";
              return (
                "<tr" +
                rowClass +
                "><td>" +
                level +
                "</td><td>" +
                escapeHtml(label) +
                "</td><td>" +
                escapeHtml(text) +
                "</td></tr>"
              );
            })
            .join("");
        } else {
          tr =
            '<tr><td colspan="3">Behavioral anchors not available for this line in the data file.</td></tr>';
        }
        return (
          '<section class="rubric-print-desc-block">' +
          '<h2 class="rubric-print-desc-h2">' +
          (idx + 1) +
          ". " +
          escapeHtml(line.label) +
          "</h2>" +
          '<table class="rubric-print-bars">' +
          "<thead><tr><th scope=\"col\">#</th><th scope=\"col\">Label</th><th scope=\"col\">Observable behavior</th></tr></thead><tbody>" +
          tr +
          "</tbody></table>" +
          "</section>"
        );
      })
      .join("");

    var descriptorsHtml =
      '<section class="rubric-print-descriptors" aria-label="Behavioral anchors reference">' +
      '<header class="rubric-print-desc-cover">' +
      renderNichollsPrintBrand("compact") +
      '<h1 class="rubric-print-title">' +
      title +
      "</h1>" +
      "<p>Reference pages — full BARS for each rating line (same order as page 1).</p>" +
      "</header>" +
      descriptorBlocks +
      "</section>";

    return summaryHtml + descriptorsHtml;
  }

  function renderRubric(def, data, key) {
    var namePrefix = "rubric-" + key.replace(/[^a-z0-9_-]/gi, "_");
    var retiredBanner =
      key === "graphics_presentation"
        ? '<div class="demo-banner" style="background:#fef3c7;color:#92400e;border:1px solid #fcd34d;">Retired rubric type — redundant with the <strong>technology</strong> rubric; shown for historical reference only.</div>'
        : "";
    var subtitle = def.subtitle
      ? '<p style="color:#6b7280;font-size:0.9rem;margin-top:0;">' + escapeHtml(def.subtitle) + "</p>"
      : "";
    var word = def.word_master
      ? '<p style="font-size:0.85rem;color:#6b7280;">Word master: <code>' +
        escapeHtml(def.word_master) +
        "</code> — reconcile criteria with committee.</p>"
      : "";

    return (
      retiredBanner +
      '<div class="card-rubric">' +
      "<h1>" +
      escapeHtml(def.title) +
      " — 5-point competence</h1>" +
      subtitle +
      word +
      '<div class="role-pick">' +
      "<span><strong>Mode (demo):</strong></span> " +
      '<label><input type="radio" name="role" value="student" checked /> Student self-report</label> ' +
      '<label><input type="radio" name="role" value="instructor" /> Instructor course rating</label>' +
      "</div>" +
      renderScaleHelp(data.scale_rows) +
      "</div>" +
      renderDimensions(def, namePrefix, data) +
      '<div class="card-rubric">' +
      "<h2>Global qualitative feedback</h2>" +
      '<p style="font-size:0.875rem;color:#4b5563;">Overall summary (optional). Per-criterion comments are above. Same transparency rules: avoid identifying others.</p>' +
      '<textarea class="global-feedback" id="globalComment" placeholder="Strengths, growth areas, next steps — avoid names of other students or sensitive identifiers."></textarea>' +
      '<button type="button" class="btn-secondary" id="piiCheck">Check for common PII patterns (demo)</button>' +
      '<div class="pii-flag" id="piiFlag" role="status"></div>' +
      '<div class="warn-pii">' +
      '<label><input type="checkbox" id="attest" /> I confirm this comment does not name or identify other students or unrelated third parties.</label>' +
      "</div></div>" +
      '<div class="card-rubric">' +
      '<button type="button" class="btn-primary" disabled title="Demo only">Submit (disabled — demo)</button>' +
      "</div>"
    );
  }

  function wirePiiCheck() {
    var flag = document.getElementById("piiFlag");
    var btn = document.getElementById("piiCheck");
    if (!flag || !btn) return;
    btn.addEventListener("click", function () {
      var chunks = [];
      document.querySelectorAll("textarea.criterion-comment").forEach(function (el) {
        chunks.push(el.value || "");
      });
      var globalTa = document.getElementById("globalComment");
      if (globalTa) chunks.push(globalTa.value || "");
      var t = chunks.join("\n");
      var issues = [];
      if (/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(t)) issues.push("Possible phone number");
      if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(t)) issues.push("Email-like pattern");
      if (/\bSSN\b|social security/i.test(t)) issues.push("Possible SSN reference");
      flag.className = "pii-flag visible";
      flag.textContent = issues.length
        ? "Flag (criterion comments + global): " + issues.join("; ") + " — review before submit."
        : "No common patterns flagged in criterion or global comments — still review manually.";
    });
  }

  function getRubricKeyFromLocation() {
    var params = new URLSearchParams(window.location.search);
    var r = params.get("r");
    if (r && r.length) return r;
    return "oral_communication";
  }

  function loadDefinitions(jsonUrl) {
    var embedded = typeof global.__AOL_RUBRIC_DEFINITIONS__ !== "undefined" && global.__AOL_RUBRIC_DEFINITIONS__;
    if (!jsonUrl) {
      return embedded
        ? Promise.resolve(embedded)
        : Promise.reject(new Error("no url and no embedded definitions"));
    }
    var resolved = new URL(jsonUrl, window.location.href).href;
    return fetch(resolved)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .catch(function () {
        if (embedded) return embedded;
        throw new Error("fetch failed and no embedded fallback");
      });
  }

  function init(containerId, jsonUrl, options) {
    options = options || {};
    var container = document.getElementById(containerId);
    if (!container) return;

    function fillPrintPack(html) {
      var id = options.printPackId;
      if (!id) return;
      var el = document.getElementById(id);
      if (el) el.innerHTML = html || "";
    }

    loadDefinitions(jsonUrl)
      .then(function (data) {
        var key = getRubricKeyFromLocation();
        var def = data.rubrics && data.rubrics[key];
        if (!def) {
          container.innerHTML =
            '<div class="card-rubric"><p>Unknown rubric <code>' +
            escapeHtml(key) +
            '</code>. Use <code>?r=</code> with a key from the picker.</p></div>';
          fillPrintPack("");
          return;
        }
        document.title = def.title + " — Rubric (demo)";
        container.innerHTML = renderRubric(def, data, key);
        wirePiiCheck();
        fillPrintPack(renderPrintPack(def, data, key));
      })
      .catch(function () {
        var isFile = window.location.protocol === "file:";
        var hint =
          "<p><strong>Could not load rubric definitions.</strong></p>" +
          "<ul style='margin:0.5rem 0 0 1rem;'>" +
          "<li>If you opened this page as a <code>file://</code> link, load <code>js/rubric_definitions_data.js</code> before <code>rubric_template.js</code> (the template demo does this), or run a local server.</li>" +
          "<li>From the <strong>AOL repo root</strong>: <code>python3 -m http.server 8080</code> then open " +
          "<code>http://localhost:8080/aol_site/rubric_template_demo.html</code></li>" +
          "<li>If you use a server, ensure the URL path includes <code>aol_site/</code> so <code>data/rubric_definitions.json</code> resolves correctly.</li>" +
          "</ul>";
        if (isFile) {
          hint +=
            "<p style='margin-top:0.75rem;'>Detected <code>file://</code> — browsers block <code>fetch()</code> for local JSON unless you use the embedded script or a local server.</p>";
        }
        container.innerHTML = '<div class="card-rubric">' + hint + "</div>";
        fillPrintPack("");
      });
  }

  global.RubricTemplate = {
    init: init,
    getRubricKeyFromLocation: getRubricKeyFromLocation,
    renderPrintPack: renderPrintPack
  };
})(typeof window !== "undefined" ? window : this);
