/**
 * Modular HR SJT survey engine (client-side).
 * Flow: consent → name/ID → intro → rate → PDF.
 * Demographics are a separate optional page (demographics.html).
 * Consent copy is driven by ../study-status.json (SONA can flip IRB without rewriting HTML).
 */
(function () {
    const RATING_LABELS = {
        1: 'Not effective',
        2: 'Somewhat ineffective',
        3: 'Moderately effective',
        4: 'Effective',
        5: 'Highly effective'
    };

    let pack = null;
    let participantId = null;
    let incidents = [];
    let responses = [];
    let currentIncidentIndex = 0;
    let startTime = null;
    let consentGiven = false;
    let demographicsData = null;
    let participantRole = 'student';
    let studyStatus = null;

    const DEFAULT_STUDY_STATUS = {
        irb_approved: false,
        data_collection: false,
        mode: 'classroom_only',
        irb_protocol_id: null,
        approved_date: null,
        status_message: null
    };

    function $(id) {
        return document.getElementById(id);
    }

    function show(id) {
        const el = $(id);
        if (el) el.style.display = 'block';
    }

    function hide(id) {
        const el = $(id);
        if (el) el.style.display = 'none';
    }

    function setText(id, text) {
        const el = $(id);
        if (el) el.textContent = text;
    }

    function init() {
        pack = getPackFromUrl();
        if (!pack) {
            document.body.innerHTML = `
                <div class="container">
                    <h1>Survey pack not found</h1>
                    <p>Use a link with <code>?pack=01</code> through <code>?pack=08</code>.</p>
                    <p><a href="index.html">Back to survey hub</a></p>
                </div>`;
            return;
        }

        if (typeof INCIDENTS_DATA === 'undefined') {
            document.body.innerHTML = `
                <div class="container">
                    <h1>Incidents data missing</h1>
                    <p>Could not load <code>incidents-data.js</code>.</p>
                </div>`;
            return;
        }

        const { resolved, missing } = resolvePackIncidents(pack, INCIDENTS_DATA);
        if (missing.length) {
            console.error('Missing incidents for pack', pack.id, missing);
            alert('Configuration error: missing incidents — ' + missing.join(', '));
            return;
        }
        incidents = resolved;

        document.title = (pack.decisionLabel || pack.title) + ' | HR SJT';
        document.querySelectorAll('[data-pack-title]').forEach((el) => {
            el.textContent = pack.decisionLabel || pack.title;
        });
        document.querySelectorAll('[data-pack-short]').forEach((el) => {
            el.textContent = pack.shortTitle;
        });
        document.querySelectorAll('[data-pack-count]').forEach((el) => {
            el.textContent = String(incidents.length);
        });
        document.querySelectorAll('[data-pack-badge]').forEach((el) => {
            el.textContent = `Decision ${pack.decisionOrder} of 8`;
        });

        const params = new URLSearchParams(window.location.search);
        participantRole = (params.get('role') || sessionStorage.getItem('hr_sjt_role') || 'student').toLowerCase();
        if (participantRole !== 'professional') participantRole = 'student';
        sessionStorage.setItem('hr_sjt_role', participantRole);

        const consentCb = $('consent-checkbox');
        const consentBtn = $('consent-continue-btn');
        if (consentCb && consentBtn) {
            consentCb.addEventListener('change', () => {
                consentBtn.disabled = !consentCb.checked;
            });
        }

        // Same-name ID persists across packs in this browser session
        const savedId = sessionStorage.getItem('candidate_id') || sessionStorage.getItem('research_participant_id');
        if (savedId) {
            const idDisplay = $('participantIdDisplay');
            const generatedIdDiv = $('generatedId');
            if (idDisplay && generatedIdDiv) {
                generatedIdDiv.textContent = savedId;
                idDisplay.style.display = 'block';
            }
        }

        window.acceptConsent = acceptConsent;
        window.continueWithParticipantId = continueWithParticipantId;
        window.startAssessment = startAssessment;
        window.selectRating = selectRating;
        window.nextIncident = nextIncident;
        window.previousIncident = previousIncident;
        window.submitAssessment = submitAssessment;
        window.generatePDFReport = generatePDFReport;

        loadStudyStatus().then((status) => {
            studyStatus = status;
            renderConsentFromStatus(status);
            applyPackLabels();
        });
    }

    function applyPackLabels() {
        if (!pack) return;
        document.querySelectorAll('[data-pack-title]').forEach((el) => {
            el.textContent = pack.decisionLabel || pack.title;
        });
        document.querySelectorAll('[data-pack-short]').forEach((el) => {
            el.textContent = pack.shortTitle;
        });
        document.querySelectorAll('[data-pack-count]').forEach((el) => {
            el.textContent = String(incidents.length);
        });
        document.querySelectorAll('[data-pack-badge]').forEach((el) => {
            el.textContent = `Decision ${pack.decisionOrder} of 8`;
        });
    }


    function contactHtml() {
        return "Dr. Christopher M. Castille, <a href=\"mailto:christopher.castille@nicholls.edu\">christopher.castille@nicholls.edu</a>, (337) 256-0664. Questions about rights as a participant: Nicholls State University IRB.";
    }

    function loadStudyStatus() {
        const url = new URL('../study-status.json', window.location.href).href;
        return fetch(url, { cache: 'no-store' })
            .then((res) => {
                if (!res.ok) throw new Error('study-status HTTP ' + res.status);
                return res.json();
            })
            .then((data) => ({ ...DEFAULT_STUDY_STATUS, ...data }))
            .catch(() => {
                console.warn('study-status.json unavailable; using classroom defaults (fail-closed).');
                return { ...DEFAULT_STUDY_STATUS };
            });
    }

    function renderConsentFromStatus(status) {
        const box = $('consent-box');
        if (!box) return;
        const approved = !!(status && status.irb_approved);
        const collecting = !!(status && status.data_collection);
        box.innerHTML = approved
            ? buildResearchConsentHtml(status, collecting)
            : buildClassroomConsentHtml(status, collecting);
        applyRoleConsentNote(approved);
        const agree = $('consent-agree-label');
        if (agree) {
            agree.textContent = approved
                ? 'I have read and understand the above information. I am 18 years of age or older. I voluntarily agree to participate.'
                : 'I have read and understand the above information. I am 18 years of age or older. I agree to continue this classroom educational activity.';
        }
    }

    function statusBannerHtml(status) {
        if (status && status.status_message) {
            return `<p class="note-box" style="border-left:4px solid #1e3a8a;"><strong>Status:</strong> ${escapeHtml(status.status_message)}</p>`;
        }
        return '';
    }

    function buildClassroomConsentHtml(status, collecting) {
        const dataLine = collecting
            ? '<p><strong>Data:</strong> This classroom activity may store ratings locally in your browser and on a PDF you download. Research database collection is configured separately.</p>'
            : '<p><strong>No data are collected</strong> by the investigators or this website as of today. Ratings stay in your browser session and on the PDF you choose to download (for example, to upload to Canvas). Nothing is sent to a research server.</p>';
        return `
            ${statusBannerHtml(status)}
            <h3>Classroom Educational Activity: HR Situational Judgment Test</h3>
            <p><strong>Instructor:</strong> Dr. Christopher M. Castille &nbsp;|&nbsp; <strong>Institution:</strong> Nicholls State University</p>
            <div class="note-box" style="border-left:4px solid #b91c1c;background:#fef2f2;">
                <p style="margin:0;"><strong>This activity is NOT approved by the Nicholls State University IRB.</strong>
                It is <strong>purely for classroom educational purposes</strong>.</p>
            </div>
            <h4>Purpose</h4>
            <p>This exercise helps you practice evaluating HR management tactics in situational judgment scenarios before class decisions. It is a teaching tool, not an IRB-approved research study.</p>
            <p id="consent-role-note" class="role-note"></p>
            <h4>What you will do (this sitting)</h4>
            <p>You will complete <strong>one short survey pack</strong> (<span data-pack-count>1</span> scenario(s)) covering: <em data-pack-short></em>. Rate tactics on a 1–5 scale or <strong>skip</strong> any item, then download a PDF report. Students may upload the PDF to Canvas as directed. There are up to 8 packs; the same name always produces the same Candidate ID so your packs can be linked for course work.</p>
            <p>Optional demographics are <strong>not required</strong> to complete this pack. If you wish, complete them separately from the survey hub.</p>
            <h4>Voluntary participation</h4>
            <p>Participation in this classroom activity is voluntary. You may skip any rating, skip this pack, or stop at any time by closing the browser. You must be 18 years of age or older.</p>
            <h4>Risks and benefits</h4>
            <p>Risks are minimal (time; feedback may differ from expectations). Benefits may include practice with HR situational judgment and a PDF summary of your ratings. Students may receive course credit as determined by the instructor. There is no monetary payment.</p>
            <h4>Privacy</h4>
            ${dataLine}
            <p>Your name is used only to generate a Candidate ID and is not stored with any instructor-facing research database. The ID appears on your PDF for course upload if required.</p>
            <h4>Contact</h4>
            <p>${contactHtml()}</p>
        `;
    }

    function buildResearchConsentHtml(status, collecting) {
        const protocol = status && status.irb_protocol_id
            ? `<p><strong>IRB protocol:</strong> ${escapeHtml(String(status.irb_protocol_id))}`
              + (status.approved_date ? ` &nbsp;|&nbsp; <strong>Approved:</strong> ${escapeHtml(String(status.approved_date))}` : '')
              + `</p>`
            : '';
        const dataPara = collecting
            ? '<p>Your responses will be used for research and teaching in aggregate. No names are stored with research data—only a participant ID.</p>'
            : '<p><strong>Note:</strong> IRB approval is recorded, but data collection is currently off in study settings. No research data are collected until collection is enabled.</p>';
        return `
            ${statusBannerHtml(status)}
            <h3>Research Study: HR Situational Judgment Test – Evidence-Based HR Decision-Making</h3>
            <p><strong>Principal Investigator:</strong> Dr. Christopher M. Castille &nbsp;|&nbsp; <strong>Institution:</strong> Nicholls State University</p>
            ${protocol}
            <h4>Purpose</h4>
            <p>This research examines how students and working professionals evaluate the effectiveness of HR management tactics in situational judgment scenarios.</p>
            ${dataPara}
            <p id="consent-role-note" class="role-note"></p>
            <h4>What you will do (this sitting)</h4>
            <p>You will complete <strong>one short survey pack</strong> (<span data-pack-count>1</span> scenario(s)) covering: <em data-pack-short></em>. You may rate tactics on a 1–5 scale or <strong>skip</strong> any item, and download a PDF report. Students may upload the PDF to Canvas as directed. Optional demographics are available separately and are not required to finish this pack. There are up to 8 packs; the same name always produces the same ID so your packs can be linked.</p>
            <h4>Voluntary participation</h4>
            <p>Participation is voluntary. You may skip any rating, skip this pack, or withdraw at any time by closing the browser. Contact the investigator to request destruction of data already collected. You must be 18 years of age or older.</p>
            <h4>Risks and benefits</h4>
            <p>Risks are minimal (time; feedback may differ from expectations). Benefits may include practice with HR situational judgment, a PDF summary of your ratings, and contribution to research. Students may receive course credit as determined by the instructor. There is no monetary payment.</p>
            <h4>Confidentiality</h4>
            <p>Your name is used only to generate a participant ID and is not stored with research data. Demographic answers (if provided on the optional demographics page) are stored with your participant ID only. Data are reported only in aggregate or de-identified form.</p>
            <h4>Contact</h4>
            <p>${contactHtml()}</p>
        `;
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function applyRoleConsentNote(approved) {
        const note = $('consent-role-note');
        if (!note) return;
        if (participantRole === 'professional') {
            note.innerHTML = '<strong>For professionals / managers:</strong> You were invited as a working professional. Participation has no effect on your employment or relationship with Nicholls State University.';
        } else if (approved) {
            note.innerHTML = '<strong>For students:</strong> Research use of your ratings is voluntary. Course PDF submission policies, if any, are separate from this research consent.';
        } else {
            note.innerHTML = '<strong>For students:</strong> This pack is a classroom educational exercise. Course PDF submission policies, if any, are set by your instructor and are separate from any future research consent.';
        }
    }

    function acceptConsent() {
        consentGiven = true;
        sessionStorage.setItem('hr_sjt_modular_consent_given', 'true');
        sessionStorage.setItem('hr_sjt_modular_consent_timestamp', new Date().toISOString());
        hide('consent-screen');
        show('participant-id-screen');
    }

    function continueWithParticipantId() {
        const firstName = ($('firstNameInput') || {}).value?.trim() || '';
        const lastName = ($('lastNameInput') || {}).value?.trim() || '';
        const errorDiv = $('participant-error');

        if (!firstName || !lastName) {
            if (errorDiv) {
                errorDiv.textContent = 'Please enter both your first and last name.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        participantId = generateCandidateIdFromName(firstName, '', lastName);
        if (!participantId) {
            if (errorDiv) {
                errorDiv.textContent = 'Failed to generate participant ID. Please try again.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        setText('generatedId', participantId);
        show('participantIdDisplay');
        if (errorDiv) errorDiv.style.display = 'none';

        sessionStorage.setItem('candidate_id', participantId);
        sessionStorage.setItem('research_participant_id', participantId);
        setText('candidateIdDisplay', participantId);

        hide('participant-id-screen');
        // Demographics are optional and live on demographics.html — never block pack flow.
        demographicsData = (window.Demographics && Demographics.load(participantId)) || null;
        show('intro-screen');
    }

    function startAssessment() {
        if (!participantId) {
            alert('Participant ID not found. Please enter your name first.');
            hide('intro-screen');
            show('participant-id-screen');
            return;
        }

        startTime = Date.now();
        responses = [];
        incidents.forEach((incident, i) => {
            incident.tactics.forEach((tactic, j) => {
                responses.push({
                    pack_id: pack.id,
                    pack_title: pack.title,
                    incident_index_in_pack: i + 1,
                    full_incident_number: incident.fullIncidentNumber,
                    incident_name: incident.name,
                    tactic_number: j + 1,
                    tactic_text: tactic.text,
                    rating: null
                });
            });
        });

        hide('intro-screen');
        show('assessment-container');
        loadIncident(0);
    }

    function loadIncident(index) {
        currentIncidentIndex = index;
        const incident = incidents[index];
        const progress = ((index + 1) / incidents.length) * 100;
        $('progress-fill').style.width = `${progress}%`;
        setText('progress-text', `Scenario ${index + 1} of ${incidents.length}`);

        let prompt = 'Based on your own experience and judgment, rate the effectiveness of each tactic:';
        if (incident.name === 'Performance Appraisal') {
            prompt = 'Based on your own experience and judgment, rate the effectiveness of each option and method:';
        }

        let html = `
            <div class="incident-header"><h2>${incident.name}</h2></div>
            <div class="scenario"><h3>Scenario</h3><p>${incident.scenario}</p></div>
            <div class="tactics-section"><h3>${prompt}</h3>
        `;

        if (incident.sections && incident.sections.length > 0) {
            incident.sections.forEach((section, sectionIndex) => {
                html += `<h4 style="margin-top: ${sectionIndex > 0 ? '30px' : '0'};">${section.title}</h4>`;
                for (let i = section.startIndex; i <= section.endIndex; i++) {
                    html += renderTactic(incident, index, i, section);
                }
            });
        } else {
            incident.tactics.forEach((_, i) => {
                html += renderTactic(incident, index, i, null);
            });
        }

        html += '</div>';
        $('incident-container').innerHTML = html;

        $('prev-btn').disabled = index === 0;
        $('next-btn').style.display = index < incidents.length - 1 ? 'inline-block' : 'none';
        $('submit-btn').style.display = index === incidents.length - 1 ? 'inline-block' : 'none';
    }

    function renderTactic(incident, incidentIndex, tacticIndex, section) {
        const tactic = incident.tactics[tacticIndex];
        const responseIndex = responses.findIndex((r) =>
            r.incident_index_in_pack === incidentIndex + 1 && r.tactic_number === tacticIndex + 1
        );
        const currentRating = responses[responseIndex]?.rating || null;

        let labelPrefix = `Tactic ${tacticIndex + 1}`;
        if (section) {
            labelPrefix = section.title === 'Appraiser Options'
                ? `Option ${tacticIndex - section.startIndex + 1}`
                : `Method ${tacticIndex - section.startIndex + 1}`;
        }

        const costHtml = tactic.cost
            ? (section && tactic.cost.includes('Method:')
                ? `<span class="cost">(${tactic.cost})</span>`
                : section && tactic.cost.includes('Appraiser')
                    ? ''
                    : `<span class="cost">(${tactic.cost})</span>`)
            : '';

        let buttons = '';
        for (let rating = 1; rating <= 5; rating++) {
            const selected = currentRating === rating ? 'selected' : '';
            buttons += `
                <div class="rating-option">
                    <button type="button" class="rating-btn ${selected}"
                            onclick="selectRating(${incidentIndex}, ${tacticIndex}, ${rating})"
                            data-rating="${rating}">${rating}</button>
                    <div class="rating-label">${RATING_LABELS[rating]}</div>
                </div>`;
        }

        return `
            <div class="tactic-item" data-tactic-index="${tacticIndex}">
                <div class="tactic-text">
                    <strong>${labelPrefix}:</strong> ${tactic.text}${costHtml}
                </div>
                <div class="rating-buttons">${buttons}</div>
            </div>`;
    }

    function selectRating(incidentIndex, tacticIndex, rating) {
        const responseIndex = responses.findIndex((r) =>
            r.incident_index_in_pack === incidentIndex + 1 && r.tactic_number === tacticIndex + 1
        );
        if (responseIndex !== -1) responses[responseIndex].rating = rating;

        const tacticItem = document.querySelector(`.tactic-item[data-tactic-index="${tacticIndex}"]`);
        if (!tacticItem) return;
        tacticItem.querySelectorAll('.rating-btn').forEach((btn) => {
            const btnRating = parseInt(btn.getAttribute('data-rating'), 10);
            btn.classList.toggle('selected', btnRating === rating);
        });
    }

    function formatRating(rating) {
        return rating == null ? 'No response' : `${rating}/5`;
    }

    function nextIncident() {
        if (currentIncidentIndex < incidents.length - 1) {
            loadIncident(currentIncidentIndex + 1);
        }
    }

    function previousIncident() {
        if (currentIncidentIndex > 0) loadIncident(currentIncidentIndex - 1);
    }

    function submitAssessment() {
        const durationSeconds = Math.round((Date.now() - startTime) / 1000);
        if (!demographicsData && window.Demographics) {
            demographicsData = Demographics.load(participantId);
        }
        window.reportData = {
            pack,
            participantId,
            participantRole,
            consentGiven,
            demographics: demographicsData,
            session: {
                completed_at: new Date().toISOString(),
                duration_seconds: durationSeconds
            },
            responses: responses.slice()
        };

        // Persist locally so students can re-download if needed this session
        try {
            const key = `hr_sjt_modular_pack_${pack.id}_${participantId}`;
            localStorage.setItem(key, JSON.stringify(window.reportData));
        } catch (e) {
            console.warn('Could not save locally:', e);
        }

        hide('assessment-container');
        show('completion-screen');
        renderCompletionSummary();
    }

    function renderCompletionSummary() {
        const data = window.reportData;
        let html = `
            <p><strong>Participant ID:</strong> <span class="id-mono" style="display:inline;font-size:1em;padding:4px 8px;">${data.participantId}</span></p>
            <p><strong>Survey:</strong> ${data.pack.title}</p>
            <p><strong>Duration:</strong> ${Math.round(data.session.duration_seconds / 60)} minute(s)</p>
            <div class="canvas-callout">
                <strong>Next step:</strong> Download your PDF report. Students: upload it to the matching Canvas assignment.
            </div>
        `;

        const demoLines = window.Demographics
            ? Demographics.formatForDisplay(data.demographics)
            : [];
        if (demoLines.length) {
            html += `<h3 style="color:#1e3a8a;margin:18px 0 8px;">Demographics (optional)</h3>`;
            demoLines.forEach((row) => {
                html += `<p style="margin:4px 0 4px 8px;"><strong>${escapeHtml(row.label)}:</strong> ${escapeHtml(row.value)}</p>`;
            });
        } else if (data.demographics && data.demographics.skipped) {
            html += `<p style="color:#64748b;margin-top:12px;"><em>Demographics skipped.</em></p>`;
        }

        html += `<hr style="margin:20px 0;border:none;border-top:1px solid #e5e7eb;">`;

        let current = null;
        data.responses.forEach((r) => {
            if (r.incident_name !== current) {
                html += `<h3 style="color:#1e3a8a;margin:18px 0 8px;">${r.incident_name}</h3>`;
                current = r.incident_name;
            }
            const ratingColor = r.rating == null ? '#64748b' : '#059669';
            html += `<p style="margin:6px 0 6px 8px;"><strong>Tactic ${r.tactic_number}:</strong> ${escapeHtml(r.tactic_text)}<br>
                <span style="color:${ratingColor};font-weight:700;">Rating: ${formatRating(r.rating)}</span></p>`;
        });

        $('detailed-report').innerHTML = html;
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    async function generatePDFReport() {
        if (typeof window.jspdf === 'undefined') {
            alert('PDF generation not available. Please refresh and try again.');
            return;
        }
        const data = window.reportData;
        if (!data) {
            alert('No report data found. Please complete the survey first.');
            return;
        }

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            let yPos = 25;
            const margin = 25;
            const pageHeight = doc.internal.pageSize.height;
            const pageWidth = doc.internal.pageSize.width;
            const contentWidth = pageWidth - (margin * 2);
            const lineHeight = 7;

            const checkPageBreak = (requiredSpace = 20) => {
                if (yPos + requiredSpace > pageHeight - margin) {
                    doc.addPage();
                    yPos = margin;
                    return true;
                }
                return false;
            };

            const addText = (text, x, y, maxWidth, fontSize = 12, color = [0, 0, 0]) => {
                doc.setFontSize(fontSize);
                doc.setTextColor(...color);
                const lines = doc.splitTextToSize(text, maxWidth);
                let currentY = y;
                lines.forEach((line) => {
                    checkPageBreak(lineHeight);
                    if (currentY + lineHeight > pageHeight - margin) {
                        doc.addPage();
                        currentY = margin;
                    }
                    doc.text(line, x, currentY);
                    currentY += lineHeight;
                });
                return currentY;
            };

            checkPageBreak(50);
            doc.setFillColor(249, 250, 251);
            doc.setDrawColor(220, 38, 38);
            doc.rect(margin, yPos, contentWidth, 40, 'FD');
            try {
                const imgElement = document.querySelector('img.lab-logo');
                if (imgElement && imgElement.complete && imgElement.naturalWidth > 0) {
                    const canvas = document.createElement('canvas');
                    canvas.width = imgElement.naturalWidth;
                    canvas.height = imgElement.naturalHeight;
                    canvas.getContext('2d').drawImage(imgElement, 0, 0);
                    const imgData = canvas.toDataURL('image/png');
                    const logoWidth = 35;
                    const logoHeight = 35;
                    doc.addImage(imgData, 'PNG', margin + contentWidth / 2 - logoWidth / 2, yPos + 2, logoWidth, logoHeight);
                }
            } catch (e) {
                console.log('Logo not available for PDF');
            }
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text('Nicholls State University | Al Danos College of Business Administration', margin + contentWidth / 2, yPos + 38, { align: 'center' });
            yPos += 50;

            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(30, 58, 138);
            yPos = addText('HR SJT — Pre-Decision Rating Report', margin, yPos, contentWidth, 16, [30, 58, 138]);
            yPos += 4;
            doc.setFont(undefined, 'normal');
            yPos = addText(data.pack.title, margin, yPos, contentWidth, 12, [30, 58, 138]);
            yPos += 8;

            yPos = addText(`Participant ID: ${data.participantId}`, margin, yPos, contentWidth, 12);
            yPos = addText(`Pack: ${data.pack.id} of 08 (Decision ${data.pack.decisionOrder})`, margin, yPos, contentWidth, 12);
            yPos = addText(`Role path: ${data.participantRole || 'student'}`, margin, yPos, contentWidth, 12);
            yPos = addText(`Date: ${date}`, margin, yPos, contentWidth, 12);
            yPos = addText(`Duration: ${Math.round(data.session.duration_seconds / 60)} minutes`, margin, yPos, contentWidth, 12);
            yPos += 8;

            const demoLines = window.Demographics
                ? Demographics.formatForDisplay(data.demographics)
                : [];
            if (demoLines.length) {
                doc.setFont(undefined, 'bold');
                yPos = addText('Demographics (optional)', margin, yPos, contentWidth, 12, [30, 58, 138]);
                doc.setFont(undefined, 'normal');
                demoLines.forEach((row) => {
                    yPos = addText(`${row.label}: ${row.value}`, margin, yPos, contentWidth, 10);
                });
                yPos += 6;
            } else if (data.demographics && data.demographics.skipped) {
                yPos = addText('Demographics: skipped', margin, yPos, contentWidth, 10, [100, 116, 139]);
                yPos += 6;
            }

            let currentIncident = null;
            data.responses.forEach((r) => {
                if (r.incident_name !== currentIncident) {
                    checkPageBreak(25);
                    yPos += 5;
                    doc.setFont(undefined, 'bold');
                    yPos = addText(`${r.incident_name} (full SJT #${r.full_incident_number})`, margin, yPos, contentWidth, 13, [30, 58, 138]);
                    doc.setDrawColor(59, 130, 246);
                    doc.line(margin, yPos, margin + contentWidth, yPos);
                    yPos += 5;
                    currentIncident = r.incident_name;
                    doc.setFont(undefined, 'normal');
                }
                checkPageBreak(15);
                yPos = addText(`Tactic ${r.tactic_number}: ${r.tactic_text}`, margin + 5, yPos, contentWidth - 10, 11);
                doc.setFont(undefined, 'bold');
                const ratingColor = r.rating == null ? [100, 116, 139] : [16, 185, 129];
                yPos = addText(`Rating: ${formatRating(r.rating)}`, margin + 10, yPos, contentWidth - 10, 11, ratingColor);
                doc.setFont(undefined, 'normal');
                yPos += 3;
            });

            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text(
                    `Page ${i} of ${totalPages} | People Analytics Lab of the Bayou | Pack ${data.pack.id} | ${date}`,
                    margin + contentWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
            }

            const filename = `hr-sjt-pack${data.pack.id}-${data.participantId}-${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(filename);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF: ' + error.message);
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
