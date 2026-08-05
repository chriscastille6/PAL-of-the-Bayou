/**
 * Modular HR SJT survey engine (client-side).
 * Flow: consent → name/ID → optional demographics → intro → rate → PDF.
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
        applyRoleConsentNote();

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
    }

    function applyRoleConsentNote() {
        const note = $('consent-role-note');
        if (!note) return;
        if (participantRole === 'professional') {
            note.innerHTML = '<strong>For professionals / managers:</strong> You were invited as a working professional. Participation has no effect on your employment or relationship with Nicholls State University.';
        } else {
            note.innerHTML = '<strong>For students:</strong> Research use of your ratings is voluntary. Course PDF submission policies, if any, are separate from this research consent.';
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
        goToDemographicsOrIntro();
    }

    function goToDemographicsOrIntro() {
        demographicsData = (window.Demographics && Demographics.load(participantId)) || null;
        // Ask once per Candidate ID; allow edit if they want by clearing storage
        if (demographicsData && demographicsData.saved_at) {
            show('intro-screen');
            return;
        }
        showDemographicsScreen();
    }

    function showDemographicsScreen() {
        show('demographics-screen');
        if (window.Demographics) {
            Demographics.renderForm($('demographics-container'), demographicsData);
            const skipBtn = $('demo-skip-btn');
            const contBtn = $('demo-continue-btn');
            if (skipBtn) {
                skipBtn.onclick = () => {
                    demographicsData = { skipped: true };
                    Demographics.save(participantId, demographicsData);
                    hide('demographics-screen');
                    show('intro-screen');
                };
            }
            if (contBtn) {
                contBtn.onclick = () => {
                    demographicsData = Demographics.collect();
                    Demographics.save(participantId, demographicsData);
                    hide('demographics-screen');
                    show('intro-screen');
                };
            }
        } else {
            hide('demographics-screen');
            show('intro-screen');
        }
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
