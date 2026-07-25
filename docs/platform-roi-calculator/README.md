<!--
File location: docs/platform-roi-calculator/README.md
What this file does: Explains the BayouPAL ROI calculator 503 and how to restore it
Why this file exists: Document host-side fix steps and the static mirror in this repo
RELEVANT FILES: static/platform/tools/roi-calculator/index.html, .github/workflows/deploy-correlation-calibrator-pages.yml
-->

# Human Capital ROI Calculator — restore notes

## Live symptom

`https://bayoupal.nicholls.edu/platform/tools/roi-calculator/` returns **Apache 503** for every path under that directory (including nonexistent files). Sibling platform pages (e.g. `/platform/survey/checklist.html`) still return 200.

Apache on BayouPAL reverse-proxies this route to a local Flask app:

```apache
# /etc/httpd/conf.d/bayoupal-routes.inc
# 0. /platform/tools/roi-calculator/ -> Program ROI Calculator (Flask, port 8011)
ProxyPass /platform/tools/roi-calculator/ http://127.0.0.1:8011/
ProxyPassReverse /platform/tools/roi-calculator/ http://127.0.0.1:8011/
```

A 503 for the whole directory means **nothing is listening on port 8011** (or the proxy target is otherwise unhealthy)—not a missing Hugo page in this repo.

## Source of truth

Formulas and classroom defaults come from the Fitz-enz HCROI implementation in:

`chriscastille6/performance-management-tool` → `interpretive-sim-augmentations/modules/hc_roi/enhanced_hc_roi_module.R`

The live Flask app that Apache expects on **port 8011** lives on the BayouPAL host (home directory / service layout similar to `~/ai-disclosure` on port 8010). That app is **not** checked into this Hugo repo.

## What this repo provides

A rebuilt **static** Human Capital ROI calculator matching the teaching metrics:

| Metric | Formula |
|--------|---------|
| HCRF | Revenue / Total FTEs |
| HCCF | Pay & Benefits + Contingents + Absence + Turnover |
| HCVA | (Revenue − Adjusted Expenses) / Total FTEs |
| HCROI | (Revenue − (Expenses − HCCF)) / HCCF |

- Path in repo: `static/platform/tools/roi-calculator/index.html`
- Self-contained HTML/JS (Tailwind CDN + Chart.js)
- Defaults reproduce the Bayou Energy example (HCRF ≈ $166,666.67; HCCF = $31,550,000; HCVA ≈ $85,916.67; HCROI ≈ 1.63)

### Working mirror (GitHub Pages)

After the Pages workflow runs:

https://chriscastille6.github.io/PAL-of-the-Bayou/platform/tools/roi-calculator/

## Restore the Nicholls URL

Preferred (keep Flask): on the BayouPAL host, restart the Program ROI Calculator service on port **8011** (same pattern as AI disclosure on 8010):

```bash
ss -lntp | rg 8011 || true
# Find the app directory (often under ~), then:
# cd ~/roi-calculator   # or whatever path holds the Flask app
# ./start.sh            # or: nohup ./start.sh > roi-calculator.log 2>&1 &
curl -sI http://127.0.0.1:8011/ | head
curl -sI https://bayoupal.nicholls.edu/platform/tools/roi-calculator/ | head
# expect HTTP 200
```

Static fallback (if Flask will not be restored):

1. Comment out or remove the `ProxyPass` / `ProxyPassReverse` lines for `/platform/tools/roi-calculator/` in `bayoupal-routes.inc`.
2. Remove `tools/roi-calculator` from the `AliasMatch` exclusion list so Apache can serve static files for that path.
3. Deploy this repo’s `static/platform/tools/roi-calculator/index.html` to `/var/www/html/platform/tools/roi-calculator/`.
4. Reload Apache and verify with `curl -sI` as above.

Until the host-side step is done, use the GitHub Pages mirror or open the static file locally.
