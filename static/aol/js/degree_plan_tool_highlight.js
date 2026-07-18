/**
 * Highlight Mermaid flowchart course nodes by tool/skill (Excel, etc.).
 * Matches the visible label text inside each g.node (e.g. "FINC 302").
 *
 * Config JSON shapes:
 * - Legacy demo: { tools: [{ id, label, courses: string[] }] } — e.g. data/degree_plan_course_tools.json
 * - Tech table extract: { courses: [{ course_code, technology_tokens }] } — data/tech_table_extracted.json
 */
(function (global) {
  var DEFAULT_CONFIG = { tools: [] };

  var MAX_LABEL_LEN = 96;

  function slugifyToolId(label) {
    var s = String(label || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    return s || "tool";
  }

  function sortCourseCodes(arr) {
    return arr.slice().sort(function (a, b) {
      var pa = String(a).trim().split(/\s+/);
      var pb = String(b).trim().split(/\s+/);
      if (pa[0] !== pb[0]) return pa[0].localeCompare(pb[0]);
      var na = parseInt(pa[1], 10);
      var nb = parseInt(pb[1], 10);
      if (!isNaN(na) && !isNaN(nb) && na !== nb) return na - nb;
      return String(a).localeCompare(String(b));
    });
  }

  /**
   * Build highlight config from aol_site/data/tech_table_extracted.json (one checkbox per token).
   */
  function configFromTechExtract(data) {
    var tokenToCourses = {};
    (data.courses || []).forEach(function (row) {
      var code = row && row.course_code ? String(row.course_code).trim() : "";
      if (!code) return;
      (row.technology_tokens || []).forEach(function (tok) {
        var t = String(tok || "").trim();
        if (!t || t.length > MAX_LABEL_LEN) return;
        if (!tokenToCourses[t]) tokenToCourses[t] = [];
        if (tokenToCourses[t].indexOf(code) === -1) tokenToCourses[t].push(code);
      });
    });

    var labels = Object.keys(tokenToCourses).sort(function (a, b) {
      return a.localeCompare(b, undefined, { sensitivity: "base" });
    });

    var usedIds = {};
    var tools = labels.map(function (label) {
      var base = slugifyToolId(label);
      var id = base;
      var n = 2;
      while (usedIds[id]) {
        id = base + "_" + n;
        n += 1;
      }
      usedIds[id] = true;
      return {
        id: id,
        label: label,
        courses: sortCourseCodes(tokenToCourses[label])
      };
    });

    return { tools: tools, source: "tech_table_extracted" };
  }

  function normalizeHighlightConfig(data) {
    if (!data || typeof data !== "object") return DEFAULT_CONFIG;
    var hasCourseTokens =
      Array.isArray(data.courses) &&
      data.courses.some(function (row) {
        return row && Array.isArray(row.technology_tokens) && row.technology_tokens.length > 0;
      });
    if (hasCourseTokens) {
      var fromExtract = configFromTechExtract(data);
      if (fromExtract.tools.length) return fromExtract;
    }
    if (Array.isArray(data.tools) && data.tools.length && data.tools[0].courses) {
      return data;
    }
    return DEFAULT_CONFIG;
  }

  var OTHER_FAMILY_ID = "other_technologies";

  /**
   * JSON patterns use a (?i) prefix for case-insensitivity; JavaScript RegExp does not support that flag inline.
   */
  function safeRegexTest(patternStr, text) {
    try {
      var s = String(patternStr || "");
      var flags = "";
      if (s.indexOf("(?i)") === 0) {
        s = s.slice(4);
        flags = "i";
      }
      return new RegExp(s, flags).test(text);
    } catch (e) {
      return false;
    }
  }

  /**
   * Split compound PDF tokens: "Word / PowerPoint", "Google Apps; Excel; powerpoint", "Word and Excel".
   */
  function splitTokenFragments(raw) {
    var t = String(raw || "").trim();
    if (!t) return [];
    return t
      .split(/\s*;\s*|\s+and\s+|\s*\/\s*|\s*,\s*/)
      .map(function (p) {
        return p.trim();
      })
      .filter(Boolean);
  }

  /**
   * @param {string} fragment
   * @param {{ ignoreTokenPatterns?: string[], families: Array<{ id: string, label: string, patterns: string[] }> }} famMap
   * @returns {string|null} family id, OTHER_FAMILY_ID, or null (ignored fragment)
   */
  function classifyTechFragment(fragment, famMap) {
    var f = String(fragment || "").trim();
    if (!f || f.length > MAX_LABEL_LEN) return null;
    var ignores = famMap.ignoreTokenPatterns || [];
    for (var i = 0; i < ignores.length; i++) {
      if (safeRegexTest(ignores[i], f)) return null;
    }
    var families = famMap.families || [];
    for (var j = 0; j < families.length; j++) {
      var fam = families[j];
      var pats = fam.patterns || [];
      for (var k = 0; k < pats.length; k++) {
        if (safeRegexTest(pats[k], f)) return fam.id;
      }
    }
    return OTHER_FAMILY_ID;
  }

  /**
   * @param {*} extractData tech_table_extracted.json
   * @param {*} famMap tech_family_map.json
   */
  function buildConsolidatedHighlightConfig(extractData, famMap) {
    if (!extractData || !Array.isArray(extractData.courses)) {
      throw new Error("Extract must include courses[]");
    }
    if (!famMap || !Array.isArray(famMap.families)) {
      throw new Error("Family map must include families[]");
    }

    var famToCourses = {};
    famMap.families.forEach(function (fam) {
      famToCourses[fam.id] = [];
    });
    famToCourses[OTHER_FAMILY_ID] = [];

    extractData.courses.forEach(function (row) {
      var code = row && row.course_code ? String(row.course_code).trim() : "";
      if (!code) return;
      var seenFam = {};
      (row.technology_tokens || []).forEach(function (tok) {
        splitTokenFragments(tok).forEach(function (frag) {
          var fid = classifyTechFragment(frag, famMap);
          if (fid === null) return;
          seenFam[fid] = true;
        });
      });
      Object.keys(seenFam).forEach(function (fid) {
        if (!famToCourses[fid]) famToCourses[fid] = [];
        if (famToCourses[fid].indexOf(code) === -1) famToCourses[fid].push(code);
      });
    });

    var tools = [];
    famMap.families.forEach(function (fam) {
      if (!fam || !fam.id || !fam.label || !(fam.patterns && fam.patterns.length)) return;
      var list = sortCourseCodes(famToCourses[fam.id] || []);
      if (list.length) {
        tools.push({
          id: fam.id,
          label: fam.label,
          group: fam.group || "Other",
          courses: list
        });
      }
    });
    var otherList = sortCourseCodes(famToCourses[OTHER_FAMILY_ID] || []);
    if (otherList.length) {
      tools.push({
        id: OTHER_FAMILY_ID,
        label: "Other technologies",
        group: "Unmapped or miscellaneous",
        courses: otherList
      });
    }

    var groupOrder = famMap.groupOrder || [];
    function groupRank(g) {
      var idx = groupOrder.indexOf(g);
      return idx === -1 ? 999 : idx;
    }
    tools.sort(function (a, b) {
      var ga = groupRank(a.group);
      var gb = groupRank(b.group);
      if (ga !== gb) return ga - gb;
      return a.label.localeCompare(b.label, undefined, { sensitivity: "base" });
    });

    return {
      tools: tools,
      groupOrder: groupOrder,
      source: "tech_table_consolidated"
    };
  }

  /**
   * Load tech extract + family map; returns consolidated tools for the dropdown.
   */
  function loadTechHighlightConsolidated(extractUrl, familyMapUrl) {
    return Promise.all([
      fetch(extractUrl).then(function (r) {
        if (!r.ok) throw new Error("Tech extract HTTP " + r.status);
        return r.json();
      }),
      fetch(familyMapUrl).then(function (r) {
        if (!r.ok) throw new Error("Family map HTTP " + r.status);
        return r.json();
      })
    ]).then(function (pair) {
      var cfg = buildConsolidatedHighlightConfig(pair[0], pair[1]);
      if (!cfg.tools.length) throw new Error("No courses mapped to technology families");
      return cfg;
    });
  }

  /**
   * Load only tech_table_extracted.json (courses[] + technology_tokens). Rejects on missing file or empty extract.
   */
  function loadTechExtractOnly(url) {
    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        if (!data || !Array.isArray(data.courses)) {
          throw new Error("JSON must include courses[] (Tech Table extract)");
        }
        var built = configFromTechExtract(data);
        if (!built.tools.length) throw new Error("No technology_tokens in extract");
        return built;
      });
  }

  function normalizeCourseToken(s) {
    return String(s || "").trim();
  }

  function courseMatchesLabel(courseToken, nodeText) {
    var c = normalizeCourseToken(courseToken);
    if (!c || !nodeText) return false;
    var escaped = c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    escaped = escaped.replace(/\s+/g, "\\s*");
    var re = new RegExp("\\b" + escaped.replace(/\//g, "\\/") + "\\b", "i");
    return re.test(nodeText);
  }

  function nodeMatchesAnyCourse(nodeText, courses) {
    for (var i = 0; i < courses.length; i++) {
      if (courseMatchesLabel(courses[i], nodeText)) return true;
    }
    return false;
  }

  function getNodeGroups(svg) {
    var nodes = svg.querySelectorAll("g.node");
    if (nodes.length) return Array.prototype.slice.call(nodes);
    var out = [];
    svg.querySelectorAll("g[id^='flowchart-']").forEach(function (g) {
      if (g.querySelector && g.querySelector("rect, polygon, circle, ellipse") && g.querySelector("text")) {
        if (g.getAttribute("class") && g.getAttribute("class").indexOf("cluster") !== -1) return;
        out.push(g);
      }
    });
    return out;
  }

  function nodeLabelText(g) {
    return (g.textContent || "").replace(/\s+/g, " ").trim();
  }

  /**
   * @param {SVGElement} svg
   * @param {{ tools: Array<{ id: string, courses: string[] }> }} config
   * @param {string[]} activeToolIds
   */
  function applyToolHighlight(svg, config, activeToolIds) {
    if (!svg || !config || !config.tools) return;
    var groups = getNodeGroups(svg);
    var activeCourses = [];
    if (activeToolIds && activeToolIds.length) {
      config.tools.forEach(function (t) {
        if (activeToolIds.indexOf(t.id) === -1) return;
        (t.courses || []).forEach(function (c) {
          if (activeCourses.indexOf(c) === -1) activeCourses.push(c);
        });
      });
    }
    var anyFilter = activeCourses.length > 0;

    groups.forEach(function (g) {
      g.classList.remove("aol-tool-hit", "aol-tool-dim");
      var text = nodeLabelText(g);
      if (!text) return;
      var hit = anyFilter && nodeMatchesAnyCourse(text, activeCourses);
      if (anyFilter) {
        if (hit) g.classList.add("aol-tool-hit");
        else g.classList.add("aol-tool-dim");
      }
    });
  }

  function loadConfig(url) {
    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(normalizeHighlightConfig)
      .catch(function () {
        return DEFAULT_CONFIG;
      });
  }

  global.AOLDegreePlanToolHighlight = {
    apply: applyToolHighlight,
    loadConfig: loadConfig,
    loadTechExtractOnly: loadTechExtractOnly,
    loadTechHighlightConsolidated: loadTechHighlightConsolidated,
    buildConsolidatedHighlightConfig: buildConsolidatedHighlightConfig,
    normalizeHighlightConfig: normalizeHighlightConfig,
    configFromTechExtract: configFromTechExtract,
    DEFAULT_CONFIG: DEFAULT_CONFIG
  };
})(typeof window !== "undefined" ? window : this);
