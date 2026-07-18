# AOL transparency portal — Phase 0 (local demonstration)

**DRAFT — FOR DEMONSTRATION ONLY.** Not for production hosting or identifiable student data without IR/FERPA review.

## What this is

Accreditation PDF for the demo: `reference/Ratification_to_Extend_Accreditation_Report.pdf` (copy of `docs/Ratification to Extend Accreditation Report.pdf`; linked from `role-leadership.html`).

Static HTML/CSS/JSON that previews the AOL transparency website:

| Area | Key files |
|------|-----------|
| **Home / tips** | `index.html`, `data/tips.json` |
| **Methodology / governance** | `methodology.html`, `governance.html` — includes **COB strategic plan Goal 2** cross-references (demo anchors) |
| **Assessment calendar** | `calendar.html` — term checkboxes, **status colors** (SP ’25 / FL ’26 / BSBA SP ’26), `data/syllabus_instructors.json` — spec `docs/AOL_Website_Specification.md` §9 |
| **Degree plans** | `degree_plans.html` — **Mermaid** flowcharts (`js/degree_plan_prerequisite_diagrams.js`, synced from sibling `Advising/templates/prerequisite_diagram.html`) + **tool/skill highlights** (`js/degree_plan_tool_highlight.js`, `data/tech_table_extracted.json` (from `scripts/extract_tech_table.py`) + `data/tech_family_map.json` (consolidated tool families for the highlight dropdown; optional legacy `data/degree_plan_course_tools.json`)); **PDFs** in `reference/degree_plans/` |
| **Committee agenda** | `agenda.html` — motions, SPCH 201 / strategic plan notes; config `docs/aol_meeting_config.json` · **PDF snapshot (records):** `reference/AOL_committee_agenda_Spring_2026-03-30.pdf` — regenerate: `./aol_site/scripts/render_agenda_pdf.sh` (Chrome/Chromium headless) |
| **Minutes & record** | `minutes.html` — working place for discussion highlights, feedback, and follow-up items (votes remain on `agenda.html`); official college minutes supersede when distributed |
| **Rubrics** | `rubrics.html`, `rubric_template_demo.html`, `oral_communication_rubric_demo.html`, `data/rubric_definitions.json` |
| **Profiles** | `profiles.html` + `profiles/*.html` (copies from `ets_statistics_analysis/` pipeline HTML) |
| **Role previews** | `role-faculty.html`, `role-dept-head.html`, `role-leadership.html` |

Semester **tips** load from `data/tips.json`. **Deploy/update (verified steps):** `deploy/DEPLOY_AND_UPDATE.md`. **Repeatable flow:** `./deploy/publish.sh` from repo root (optional `deploy/deploy.env` from `deploy/deploy.env.example`), then both `sudo rsync` lines on the server, then `./deploy/publish.sh --check-only`. **Upload only:** `DEPLOY_USER=you ./deploy/push_site_to_server.sh`. **Build tarball + hints:** `./deploy/quick_deploy.sh`. Bundle only: `deploy/build_aol_site_bundle.sh` → `deploy/aol_site_latest.tar.gz`.

## Rubrics on the demo site

- **`rubric_change_log.Rmd`** → knit to **`rubric_change_log.html`** — running log (AOL + committee/UPIC requests, ownership fields). From repo root: `Rscript -e 'rmarkdown::render("aol_site/rubric_change_log.Rmd")'`. Output: `aol_site/rubric_change_log.html`.
- **`rubrics.html`** — Course–rubric inventory (from root `RUBRICS_TABLE.md`) + links to oral rubric demo/spec and the change log.
- **`rubric_template_demo.html`** — **All rubric types** from `data/rubric_definitions.json` with the **same 5-point competence scale**; dropdown + `?r=oral_communication` etc. Loads **`js/rubric_definitions_data.js`** first so it works via **`file://`** or `http://`. After editing the JSON, run `python3 aol_site/scripts/sync_rubric_definitions_embed.py`. See `docs/Rubric_Web_Template.md`.
- **`oral_communication_rubric_demo.html`** — Standalone oral demo (same scale/UI); optional duplicate of template with `?r=oral_communication`.
- **`assets/reference_written_comm_rubric.png`** — Written comm rubric screenshot (layout reference).
- Full rubric PDFs/Word masters may still live in DMS/Bayoupal; see `docs/Oral_Communication_Rubric_Electronic_Spec.md`.

## Edit semester tips

Update `data/tips.json` — fields `semester` and `tips_for_faculty` (array of `title` / `body`). The home page renders them automatically.

## Preview note

If you open `calendar.html` (or other pages) from a **repo-root** static server, links that point at `../ets_statistics_analysis/` resolve. A deploy bundle that contains **only** `aol_site/` should rely on paths under `aol_site/` (e.g. `data/syllabus_instructors.json`); see `calendar.html` provenance copy.

## Related docs

| Doc | Purpose |
|-----|---------|
| `docs/AOL_Website_Specification.md` | Full product spec (SSO, roles, FERPA) |
| `docs/AOL_Website_Roadmap.md` | Phases 0–2 + deployment checklist |
| `docs/semester_bundle/README.md` | Published semester folder layout + `MANIFEST.json` |
| `docs/AOL_Internal_Server_Deployment.md` | Internal server access + ACL checklist |
| `docs/AOL_Phase2_Data_Model.md` | Intervention + report version schema (Phase 2) |

## Pipeline-generated reports

- Faculty HTML: `ets_statistics_analysis/faculty_report_template.py`
- Department head HTML: `ets_statistics_analysis/create_department_head_report.py` + `department_head_report_config.json`

Do not copy raw pipeline output into this demo folder without de-identification review.


---

## Import note (PAL-of-the-Bayou)

Mirrored from `https://bayoupal.nicholls.edu/aol/` into `static/aol/` so Hugo serves the portal at `/aol/`.

**Not downloaded (server denied):** `reference/Ratification_to_Extend_Accreditation_Report.pdf` (HTTP 403).

Parent `docs/*.md` links from this portal are not on the public host (404); authoritative policy docs live in the separate AOL source repository.
