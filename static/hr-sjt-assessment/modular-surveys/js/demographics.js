/**
 * Optional demographics for modular HR SJT packs.
 * Stored once per Candidate ID (localStorage) and included on PDF reports.
 * All items are skippable.
 */
const DEMOGRAPHICS_STORAGE_PREFIX = 'hr_sjt_modular_demographics_';

const DEMOGRAPHICS_FIELDS = [
    {
        id: 'participant_role',
        label: 'Which best describes you?',
        type: 'select',
        options: [
            '',
            'Undergraduate student',
            'Graduate student',
            'HR professional',
            'Manager (non-HR)',
            'Other working professional',
            'Prefer not to say'
        ]
    },
    {
        id: 'age_range',
        label: 'Age range',
        type: 'select',
        options: [
            '',
            '18-24',
            '25-34',
            '35-44',
            '45-54',
            '55-64',
            '65+',
            'Prefer not to say'
        ]
    },
    {
        id: 'gender',
        label: 'Gender identity',
        type: 'select',
        options: [
            '',
            'Woman',
            'Man',
            'Non-binary',
            'Another identity',
            'Prefer not to say'
        ]
    },
    {
        id: 'race_ethnicity',
        label: 'Race / ethnicity (select all that apply)',
        type: 'checkbox',
        options: [
            'American Indian or Alaska Native',
            'Asian',
            'Black or African American',
            'Hispanic or Latino/a/x',
            'Middle Eastern or North African',
            'Native Hawaiian or Other Pacific Islander',
            'White',
            'Another identity',
            'Prefer not to say'
        ]
    },
    {
        id: 'student_year',
        label: 'If you are a student: year in school',
        type: 'select',
        options: [
            '',
            'Freshman',
            'Sophomore',
            'Junior',
            'Senior',
            'Graduate',
            'Not a student',
            'Prefer not to say'
        ]
    },
    {
        id: 'major',
        label: 'If you are a student: major / concentration (optional)',
        type: 'text',
        placeholder: 'e.g., Management, HR concentration'
    },
    {
        id: 'years_experience',
        label: 'Years of professional work experience',
        type: 'select',
        options: [
            '',
            'None / student only',
            'Less than 1 year',
            '1-3 years',
            '4-7 years',
            '8-15 years',
            '16+ years',
            'Prefer not to say'
        ]
    },
    {
        id: 'hr_experience_years',
        label: 'Years of HR-specific experience (if any)',
        type: 'select',
        options: [
            '',
            'None',
            'Less than 1 year',
            '1-3 years',
            '4-7 years',
            '8-15 years',
            '16+ years',
            'Prefer not to say'
        ]
    },
    {
        id: 'industry',
        label: 'Primary industry (optional)',
        type: 'text',
        placeholder: 'e.g., Healthcare, Manufacturing, Education, Oil & Gas'
    },
    {
        id: 'hr_credential',
        label: 'HR credential (e.g., SHRM-CP, PHR)',
        type: 'select',
        options: [
            '',
            'Yes',
            'No',
            'In progress',
            'Prefer not to say'
        ]
    },
    {
        id: 'prior_hr_coursework',
        label: 'Have you completed formal HR coursework before this activity?',
        type: 'select',
        options: [
            '',
            'Yes',
            'No',
            'Prefer not to say'
        ]
    }
];

function demographicsStorageKey(participantId) {
    return DEMOGRAPHICS_STORAGE_PREFIX + participantId;
}

function loadDemographics(participantId) {
    if (!participantId) return null;
    try {
        const raw = localStorage.getItem(demographicsStorageKey(participantId));
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function saveDemographics(participantId, data) {
    if (!participantId) return;
    try {
        localStorage.setItem(
            demographicsStorageKey(participantId),
            JSON.stringify({
                ...data,
                saved_at: new Date().toISOString()
            })
        );
    } catch (e) {
        console.warn('Could not save demographics:', e);
    }
}

function renderDemographicsForm(container, existing) {
    if (!container) return;
    const prior = existing || {};
    let html = `
        <p class="note-box">
            These questions are <strong>optional</strong>. You may skip any item.
            Answers are stored with your Candidate ID only (not your name) in this browser.
            Survey packs do not require demographics.
        </p>
        <form id="demographics-form" class="demo-form">
    `;

    DEMOGRAPHICS_FIELDS.forEach((field) => {
        html += `<div class="demo-field">`;
        html += `<label for="demo_${field.id}">${field.label}</label>`;
        if (field.type === 'select') {
            html += `<select id="demo_${field.id}" name="${field.id}">`;
            field.options.forEach((opt) => {
                const selected = prior[field.id] === opt ? ' selected' : '';
                const label = opt === '' ? '— Skip / leave blank —' : opt;
                html += `<option value="${escapeAttr(opt)}"${selected}>${escapeHtmlDemo(label)}</option>`;
            });
            html += `</select>`;
        } else if (field.type === 'checkbox') {
            const selected = Array.isArray(prior[field.id]) ? prior[field.id] : [];
            html += `<div class="demo-checkboxes">`;
            field.options.forEach((opt, i) => {
                const checked = selected.includes(opt) ? ' checked' : '';
                html += `
                    <label class="demo-check">
                        <input type="checkbox" name="${field.id}" value="${escapeAttr(opt)}"${checked}>
                        <span>${escapeHtmlDemo(opt)}</span>
                    </label>`;
            });
            html += `</div>`;
        } else {
            const val = prior[field.id] || '';
            html += `<input type="text" id="demo_${field.id}" name="${field.id}"
                value="${escapeAttr(val)}" placeholder="${escapeAttr(field.placeholder || '')}">`;
        }
        html += `</div>`;
    });

    html += `
        </form>
        <div class="demo-actions">
            <button type="button" class="btn btn-secondary" id="demo-skip-btn">Skip demographics</button>
            <button type="button" class="btn btn-primary" id="demo-continue-btn">Save and continue</button>
        </div>
    `;
    container.innerHTML = html;
}

function collectDemographicsFromForm() {
    const data = {};
    DEMOGRAPHICS_FIELDS.forEach((field) => {
        if (field.type === 'checkbox') {
            const boxes = document.querySelectorAll(`input[name="${field.id}"]:checked`);
            data[field.id] = Array.from(boxes).map((b) => b.value);
        } else {
            const el = document.getElementById(`demo_${field.id}`);
            data[field.id] = el ? String(el.value || '').trim() : '';
        }
    });
    return data;
}

function formatDemographicsForDisplay(data) {
    if (!data) return [];
    const lines = [];
    DEMOGRAPHICS_FIELDS.forEach((field) => {
        let val = data[field.id];
        if (Array.isArray(val)) val = val.length ? val.join('; ') : '';
        if (val) lines.push({ label: field.label, value: String(val) });
    });
    return lines;
}

function escapeHtmlDemo(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escapeAttr(text) {
    return escapeHtmlDemo(text);
}

window.Demographics = {
    fields: DEMOGRAPHICS_FIELDS,
    load: loadDemographics,
    save: saveDemographics,
    renderForm: renderDemographicsForm,
    collect: collectDemographicsFromForm,
    formatForDisplay: formatDemographicsForDisplay
};
