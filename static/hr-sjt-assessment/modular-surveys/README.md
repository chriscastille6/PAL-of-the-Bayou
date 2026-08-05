# HR SJT Modular Pre-Decision Surveys

Breaks the full 27-incident HR Situational Judgment Test into **8 short surveys**. Students complete each pack **before** the matching class decision, then download a PDF and upload it to Canvas.

**Delivery (BayouPAL offline):** ship `hr-sjt-modular-packs-canvas.zip` via Canvas Files. Students unzip locally, open a pack HTML file, then upload the PDF to the matching Canvas assignment. See [CANVAS_SETUP.md](CANVAS_SETUP.md).

**IRB / consent (course root):** `../../IRB_STUDY_DETAILS.md`, `../../Consent_Form_HR_SJT_Study.md`, `../../Consent_Process_HR_SJT.md` (paths relative to this folder: `MNGT 425 - HR Analytics/`).

## Why

One sitting for all 27 scenarios is too long and can harm rating quality. Shorter packs preserve attention; a shared **Candidate ID** links responses across packs.

## Student flow (each pack)

1. Download and unzip `hr-sjt-modular-packs-canvas.zip` from Canvas Files (once)  
2. Open the pack file for that decision (double-click `pack-0N.html`, or open via a local folder server)  
3. Consent → enter **same first + last name** → Candidate ID is generated  
4. Rate tactics (1–5) for that pack’s scenarios  
5. **Download PDF** → upload to the Canvas assignment for that decision  

PDF filename pattern:

`hr-sjt-pack{NN}-{PARTICIPANT_ID}-{YYYY-MM-DD}.pdf`

## Decision / pack order

| Pack | Decision topics | Incidents |
|------|-----------------|-----------|
| 01 | Remote and Flexible Work | Remote and Flexible Work |
| 02 | Workplace Accommodations, BFOQ | Workplace Accommodations; Bona Fide Occupational Requirement |
| 03 | Job Analysis, Job Design, Adverse Effect Discrimination | Job Analysis; Job Design; Adverse Effect Discrimination |
| 04 | Employee Selection Process, Mental Health Programs | Employee Selection Process; Mental Health Programs |
| 05 | Crisis Management | Crisis Management |
| 06 | Performance Appraisal, Self-Managed Work Teams, Promotion Decisions | Performance Appraisal; Self-Managed Work Teams; Promotion Decisions |
| 07 | Job Evaluation for Pay Equity, Exempt Employees, Wage Negotiations | Job Evaluation for Pay Equity; Exempt Employees; Wage Negotiations |
| 08 | Safety Issues, Employee Health and Wellness | Safety Issues; Employee Health and Wellness Proposals |

## Local paths (after unzip)

Keep this folder layout — packs load vignettes from the parent folder:

```text
hr-sjt-assessment/
  incidents-data.js
  lab-emblem.png
  modular-surveys/
    index.html          ← hub
    survey.html?pack=0N
    pack-01.html … pack-08.html
    css/  js/  materials/
```

Hub: `modular-surveys/index.html`

| Pack | Open this file |
|------|----------------|
| 01 | `pack-01.html` or `survey.html?pack=01` |
| 02 | `pack-02.html` or `survey.html?pack=02` |
| 03 | `pack-03.html` or `survey.html?pack=03` |
| 04 | `pack-04.html` or `survey.html?pack=04` |
| 05 | `pack-05.html` or `survey.html?pack=05` |
| 06 | `pack-06.html` or `survey.html?pack=06` |
| 07 | `pack-07.html` or `survey.html?pack=07` |
| 08 | `pack-08.html` or `survey.html?pack=08` |

**Build / refresh the Canvas zip** (from Teaching repo):

```bash
bash "MNGT 425 - HR Analytics/hr-sjt-assessment/install/build-canvas-zip.sh"
```

## Candidate ID

Uses the same deterministic algorithm as the full HR SJT (`generateCandidateIdFromName`), aligned with the CANDIDATE-ID-GENERATOR family:

- Same name → same ID across all 8 packs  
- Name is **not** stored; only the ID appears on the PDF  

Source: `js/participant-id.js`

## Technical notes

- **Client-side only** (no API / no BayouPAL). Ratings live in memory + optional `localStorage` for the session; the Canvas deliverable is the PDF.  
- Incidents load from `../incidents-data.js` (single source of truth).  
- Pack membership is configured in `js/packs.js`.  
- jsPDF loads from a CDN — students need internet for PDF download.  
- Opening via `file://` usually works; if a browser blocks scripts, run a tiny local server from `hr-sjt-assessment/`: `python3 -m http.server 8080` then visit `http://localhost:8080/modular-surveys/`.

## Incidents not in these 8 packs

Intentionally omitted from the modular classroom sequence (still in the full SJT item bank): Recruiting for Temporary Positions; Selection of Employee; Sexual Harassment; Compensation Planning; References; Harassment vs. Lying Dilemma; Collective Bargaining; Health Care Law Changes; Drug Testing; Diverse Hiring Pipeline.

Adjust `js/packs.js` if you want any of these added later.
