/**
 * Eight pre-decision rating-effectiveness survey packs.
 * Incident names must match INCIDENTS_DATA in ../incidents-data.js.
 * Decision order = classroom sequence (survey before corresponding decision).
 */
const SURVEY_PACKS = {
    '01': {
        id: '01',
        slug: 'remote-flexible-work',
        title: 'Survey 1: Remote and Flexible Work',
        decisionLabel: 'Decision 1: Remote and Flexible Work',
        shortTitle: 'Remote and Flexible Work',
        decisionOrder: 1,
        incidentNames: ['Remote and Flexible Work']
    },
    '02': {
        id: '02',
        slug: 'accommodations-bfoq',
        title: 'Survey 2: Workplace Accommodations & BFOQ',
        decisionLabel: 'Decision 2: Workplace Accommodations & BFOQ',
        shortTitle: 'Workplace Accommodations, Bona Fide Occupational Requirements',
        decisionOrder: 2,
        incidentNames: [
            'Workplace Accommodations',
            'Bona Fide Occupational Requirement'
        ]
    },
    '03': {
        id: '03',
        slug: 'job-analysis-design-aed',
        title: 'Survey 3: Job Analysis, Job Design & Adverse Effect Discrimination',
        decisionLabel: 'Decision 3: Job Analysis, Job Design & Adverse Effect Discrimination',
        shortTitle: 'Job Analysis, Job Design, Adverse Effect Discrimination',
        decisionOrder: 3,
        incidentNames: [
            'Job Analysis',
            'Job Design',
            'Adverse Effect Discrimination'
        ]
    },
    '04': {
        id: '04',
        slug: 'selection-mental-health',
        title: 'Survey 4: Employee Selection Process & Mental Health Programs',
        decisionLabel: 'Decision 4: Employee Selection Process & Mental Health Programs',
        shortTitle: 'Employee Selection Process, Mental Health Programs',
        decisionOrder: 4,
        incidentNames: [
            'Employee Selection Process',
            'Mental Health Programs'
        ]
    },
    '05': {
        id: '05',
        slug: 'crisis-management',
        title: 'Survey 5: Crisis Management',
        decisionLabel: 'Decision 5: Crisis Management',
        shortTitle: 'Crisis Management',
        decisionOrder: 5,
        incidentNames: ['Crisis Management']
    },
    '06': {
        id: '06',
        slug: 'appraisal-teams-promotion',
        title: 'Survey 6: Performance Appraisal, Self-Managed Work Teams & Promotion',
        decisionLabel: 'Decision 6: Performance Appraisal, Teams & Promotion',
        shortTitle: 'Performance Appraisal, Self-Managed Work Teams, Promotion Decisions',
        decisionOrder: 6,
        incidentNames: [
            'Performance Appraisal',
            'Self-Managed Work Teams',
            'Promotion Decisions'
        ]
    },
    '07': {
        id: '07',
        slug: 'pay-equity-exempt-wages',
        title: 'Survey 7: Pay Equity, Exempt Employees & Wage Negotiations',
        decisionLabel: 'Decision 7: Pay Equity, Exempt Employees & Wage Negotiations',
        shortTitle: 'Job Evaluation for Pay Equity, Exempt Employees, and Wage Negotiations',
        decisionOrder: 7,
        incidentNames: [
            'Job Evaluation for Pay Equity',
            'Exempt Employees',
            'Wage Negotiations'
        ]
    },
    '08': {
        id: '08',
        slug: 'safety-wellness',
        title: 'Survey 8: Safety Issues & Employee Health and Wellness',
        decisionLabel: 'Decision 8: Safety Issues & Employee Health and Wellness',
        shortTitle: 'Safety Issues, Employee Health and Wellness Proposal',
        decisionOrder: 8,
        incidentNames: [
            'Safety Issues',
            'Employee Health and Wellness Proposals'
        ]
    }
};

function getPackFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const packId = (params.get('pack') || '').padStart(2, '0');
    return SURVEY_PACKS[packId] || null;
}

function resolvePackIncidents(pack, allIncidents) {
    const byName = new Map(allIncidents.map((inc, idx) => [inc.name, { incident: inc, fullIndex: idx }]));
    const resolved = [];
    const missing = [];

    pack.incidentNames.forEach((name) => {
        const hit = byName.get(name);
        if (!hit) {
            missing.push(name);
            return;
        }
        resolved.push({
            ...hit.incident,
            fullIncidentNumber: hit.fullIndex + 1
        });
    });

    return { resolved, missing };
}
