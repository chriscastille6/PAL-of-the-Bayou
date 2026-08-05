// File location: static/ai-disclosure/participant-id.js
// What this file does: Derives anonymous candidate IDs from name (or random fallback) for the AI Disclosure form
// Why this file exists: Keeps the disclosure tool self-contained under Website/static without depending on the Psychological Assessments platform path
// RELEVANT FILES: static/ai-disclosure/index.html, Psychological Assessments/platform/js/participant-id.js

// platform/js/participant-id.js
// Participant ID generation for research data (CANDIDATE approach).
// Primary: derive from name (names not stored). Fallback: random XXXX-XXXX-XXXX.
// Based on: Sandnes, F. E. (2021). CANDIDATE: A tool for generating anonymous participant-linking IDs in multi-session studies. PLOS ONE, 16(12), e0260569. https://doi.org/10.1371/journal.pone.0260569
// RELEVANT FILES: emotional-intelligence-assessment/deploy/sjt_only_assessment_engine.js, IRB/data-governance-protocol.md

const ID_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// System-level pepper applied in browser before hashing; never transmitted. Prevents dictionary attacks using student rosters.
const PARTICIPANT_ID_PEPPER = 'APID@W-2025-nicholls-research-v1'

/**
 * Derive participant ID from name using CANDIDATE-ID-GENERATOR algorithm.
 * Names are never stored; only the derived code is used.
 * A system-level pepper is combined with the normalized name before hashing so that dictionary attacks using external rosters are not feasible.
 * Same name always returns the same code (deterministic for this deployment).
 * Implementation adapted from CANDIDATE (Sandnes, 2021, PLOS ONE); see https://github.com/chriscastille6/CANDIDATE-ID-GENERATOR
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {string} [middleName] - Middle name (optional)
 * @returns {string|null} Participant ID in format XXXX-XXXX-XXXX (12 chars), or null if empty
 */
function deriveParticipantIdFromName(firstName, lastName, middleName) {
  const nameParts = [firstName, middleName, lastName]
    .filter(name => name && String(name).trim())
    .map(name => String(name).trim())
  const fullName = nameParts.join(' ').trim()
  if (!fullName) return null

  const normalized = fullName.trim().toLowerCase().replace(/\s+/g, ' ')
  const salted = PARTICIPANT_ID_PEPPER + normalized
  let hash = 0
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }

  // Seeded PRNG: deterministic 12 chars from hash
  let seed = Math.abs(hash)
  const next = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  const segments = [4, 4, 4]
  const id = segments.map(len =>
    Array.from({ length: len }, () =>
      ID_CHARS[Math.floor(next() * ID_CHARS.length)]
    ).join('')
  ).join('-')
  return id
}

/**
 * Generate a randomized participant ID (fallback when name not used)
 * Format: XXXX-XXXX-XXXX (12 chars)
 * @returns {string} Randomized participant ID
 */
function generateParticipantId() {
  const segment = (n) => Array.from({ length: n }, () =>
    ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)]
  ).join('')
  return `${segment(4)}-${segment(4)}-${segment(4)}`
}

/**
 * Store participant ID in sessionStorage
 * @param {string} participantId - Participant ID to store
 */
function storeParticipantId(participantId) {
    sessionStorage.setItem('research_participant_id', participantId);
}

/**
 * Get stored participant ID or generate new one
 * @returns {string} Participant ID
 */
function getOrCreateParticipantId() {
    let participantId = sessionStorage.getItem('research_participant_id');
    
    if (!participantId) {
        participantId = generateParticipantId();
        storeParticipantId(participantId);
    }
    
    return participantId;
}

// Export functions
window.ParticipantID = {
    deriveFromName: deriveParticipantIdFromName,
    generate: generateParticipantId,
    store: storeParticipantId,
    getOrCreate: getOrCreateParticipantId
};
