/**
 * Deterministic Candidate / Participant ID generator.
 * Matches the algorithm used in hr-sjt-assessment/index.html
 * (same family as CANDIDATE-ID-GENERATOR / bayoupal linking).
 *
 * Format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 * Same name → same ID (names are not stored).
 */
function generateCandidateIdFromName(firstName, middleName, lastName) {
    const nameParts = [firstName, middleName, lastName]
        .filter((name) => name && String(name).trim())
        .map((name) => String(name).trim());

    const fullName = nameParts.join(' ').trim();
    if (!fullName) return null;

    const normalized = fullName.toLowerCase().replace(/\s+/g, ' ');

    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
        const char = normalized.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const segments = [8, 4, 4, 4, 12];
    let seed = Math.abs(hash);
    const seededRandom = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };

    return segments.map((length) => {
        return Array.from({ length }, () => {
            const index = Math.floor(seededRandom() * chars.length);
            return chars[index];
        }).join('');
    }).join('-');
}

if (typeof window !== 'undefined') {
    window.ParticipantId = {
        generateFromName: generateCandidateIdFromName
    };
}
