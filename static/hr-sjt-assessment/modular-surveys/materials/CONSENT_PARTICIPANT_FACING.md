# Exact Consent Text Participants See (Modular Surveys)

**Source of truth for the live interface:** `../survey.html` consent screen, filled at load by `../js/survey-engine.js` from `../../study-status.json`.  
**Audience variants:** wording adjusts slightly for Students vs Professionals. Role comes from optional demographics (`hr_sjt_role` in browser storage) or an optional `?role=student|professional` URL override — not from the survey hub.

**SONA / PRAMS:** flip fields in `hr-sjt-assessment/study-status.json` (see `../../STUDY_STATUS.md`). Do not rewrite this HTML to change IRB status.

---

## Mode A — Classroom educational (default: `irb_approved: false`)

Participants see a clear banner that:

1. This activity is **NOT approved by the Nicholls State University IRB**.
2. It is **purely for classroom educational purposes**.
3. **No data are collected** by the investigators or this website when `data_collection` is `false` (current default). Ratings stay in the browser session and on the PDF the participant downloads (e.g., Canvas upload).

Title: **Classroom Educational Activity: HR Situational Judgment Test**

Optional demographics are **not required** to complete a pack; they live on `demographics.html`.

Agreement checkbox (classroom):

> I have read and understand the above information. I am 18 years of age or older. I agree to continue this classroom educational activity.

**Button:** I Agree – Continue

---

## Mode B — Research (when `irb_approved: true`)

Title: **Research Study: HR Situational Judgment Test – Evidence-Based HR Decision-Making**

Shows Principal Investigator, institution, and optional `irb_protocol_id` / `approved_date` from JSON. Research purpose, voluntary participation, risks/benefits, confidentiality, and contact. Data-collection language follows `data_collection`.

Agreement checkbox (research):

> I have read and understand the above information. I am 18 years of age or older. I voluntarily agree to participate.

---

## What you will do (both modes, pack-specific)

One short survey pack covering the decision topic on screen. Rate tactics 1–5 or skip any item; download PDF. Up to 8 packs; same name → same Candidate ID.

**Pack flow:** consent → name/ID → rate → PDF (demographics are **not** in this path).

---

## Role-specific sentence

**Student (classroom):** This pack is a classroom educational exercise. Course PDF submission policies, if any, are set by your instructor and are separate from any future research consent.

**Student (research):** Research use of your ratings is voluntary. Course PDF submission policies, if any, are separate from this research consent.

**Professional / manager:** You were invited as a working professional. Participation has no effect on your employment or relationship with Nicholls State University.

---

## Contact

Shown from the live consent template (instructor / PI contact and Nicholls IRB rights language as configured in `survey-engine.js`).
