# Study status setting (SONA / PRAMS)

**File:** `hr-sjt-assessment/study-status.json`  
**Consumed by:** `modular-surveys/js/survey-engine.js` (and `demographics.html`) at page load.

## Fields

| Field | Type | Default today | Effect |
|-------|------|---------------|--------|
| `irb_approved` | boolean | `false` | `false` → classroom / **not** Nicholls IRB-approved consent. `true` → research consent template. |
| `data_collection` | boolean | `false` | `false` → consent states that **no data are collected**. `true` → research data-handling language. |
| `mode` | string | `"classroom_only"` | Informational; use `"research"` after IRB approval. |
| `irb_protocol_id` | string\|null | `null` | Shown on research consent when set. |
| `approved_date` | string\|null | `null` | Shown on research consent when set (ISO date preferred). |
| `status_message` | string\|null | `null` | Optional override banner at top of consent. |
| `updated` | string | date | Human audit trail. |
| `sona_notes` | string | — | Operator notes (not shown to participants). |

## Flip when IRB approves

1. Edit **only** `study-status.json` (Website `static/` and Teaching source copies).
2. Set at least:
   ```json
   {
     "irb_approved": true,
     "data_collection": true,
     "mode": "research",
     "irb_protocol_id": "HSIRB-XXXX",
     "approved_date": "YYYY-MM-DD",
     "status_message": null,
     "updated": "YYYY-MM-DD"
   }
   ```
3. Redeploy Netlify (or sync static assets). No survey HTML rewrite required.
4. If fetch fails (e.g. `file://` Canvas zip), the engine defaults to **classroom / not IRB-approved / no data collection** — safe fail-closed.

## Live path

`https://bayou-pal.netlify.app/hr-sjt-assessment/study-status.json`
