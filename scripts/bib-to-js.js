#!/usr/bin/env node

// Usage: node bib-to-js.js bibfile.bib > ../data/publicationsData.js

const fs = require('fs');
const bibtexParse = require('bibtex-parse-js');

if (process.argv.length < 3) {
  console.error('Usage: node bib-to-js.js input.bib > data/publicationsData.js');
  process.exit(1);
}

const inputFile = process.argv[2];
const bibtex = fs.readFileSync(inputFile, 'utf8');
const entries = bibtexParse.toJSON(bibtex);

// Strip outer braces/quotes from BibTeX fields
function cleanField(value) {
  if (!value) return '';
  let v = value.trim();

  // Remove surrounding { } or " "
  if (
    (v.startsWith('{') && v.endsWith('}')) ||
    (v.startsWith('"') && v.endsWith('"'))
  ) {
    v = v.slice(1, -1);
  }

  return v.replace(/\s+/g, ' ').trim();
}

const smallTitleWords = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into',
  'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'via', 'vs', 'with', 'without',
  'within', 'among', 'about'
]);

const titleWordOverrides = new Map(Object.entries({
  ai: 'AI',
  airbnb: 'Airbnb',
  ble: 'BLE',
  casacare: 'CasaCare',
  'casacare.org': 'CasaCare.org',
  ccpa: 'CCPA',
  chi: 'CHI',
  clear: 'CLEAR',
  cscw: 'CSCW',
  defi: 'DeFi',
  genai: 'GenAI',
  gui: 'GUI',
  hci: 'HCI',
  ios: 'iOS',
  iot: 'IoT',
  llm: 'LLM',
  llms: 'LLMs',
  pipl: 'PIPL',
  popets: 'PoPETS',
  privacycon: 'PrivacyCon',
  privisense: 'PriviSense',
  redcapes: 'RedCapes',
  soups: 'SOUPS',
  tor: 'Tor',
  uefa: 'UEFA',
  ui: 'UI',
  usec: 'USEC',
  us: 'US',
  usenix: 'USENIX',
  ux: 'UX',
  vr: 'VR'
}));

const exactTitleOverrides = new Map(Object.entries({
  '"What are they gonna do with my data?": Privacy Expectations, Concerns, and Behaviors in Virtual Reality':
    '"What Are They Gonna Do with My Data?": Privacy Expectations, Concerns, and Behaviors in Virtual Reality',
  '"If We Had the Option": Infrastructuring for Access to Online Subscription-Based Services in Bangladesh':
    '"If We Had the Option": Infrastructuring for Access to Online Subscription-Based Services in Bangladesh',
  '"How I Know For Sure": People\'s Perspectives on Solely Automated Decision-Making':
    '"How I Know for Sure": People\'s Perspectives on Solely Automated Decision-Making',
  'CCPA opt-out icon testing--phase 2':
    'CCPA Opt-Out Icon Testing--Phase 2',
  'CasaCare. Org: A sociotechnical platform for women immigrant workers in the home care industry':
    'CasaCare.org: A Sociotechnical Platform for Women Immigrant Workers in the Home Care Industry'
}));

function normalizeTitlePunctuation(title) {
  return title
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\s+:/g, ':')
    .replace(/:([^\s"'])/g, ': $1')
    .replace(/^"\s+/, '"')
    .replace(/\(in\)\s*/gi, '(In)')
    .trim()
    .replace(/\.$/, '');
}

function splitWord(raw) {
  const match = raw.match(/^([^A-Za-z0-9]*)(.*?)([^A-Za-z0-9]*)$/);
  return match ? { lead: match[1], core: match[2], trail: match[3] } : { lead: '', core: raw, trail: '' };
}

function titleCaseWord(raw, forceCap = false) {
  if (!raw) return raw;
  const { lead, core, trail } = splitWord(raw);
  if (!core) return raw;

  const lower = core.toLowerCase();
  if (titleWordOverrides.has(lower)) return `${lead}${titleWordOverrides.get(lower)}${trail}`;
  if (!forceCap && smallTitleWords.has(lower)) return `${lead}${lower}${trail}`;
  if (/^[A-Z0-9]+$/.test(core) && core.length > 1) return `${lead}${core}${trail}`;
  return `${lead}${core.charAt(0).toUpperCase()}${core.slice(1).toLowerCase()}${trail}`;
}

function titleCaseHyphenated(word, forceCap = false) {
  const parts = word.split('-');
  return parts.map((part, index) => {
    const { core } = splitWord(part);
    const lower = core.toLowerCase();
    const partForce = forceCap || (parts.length > 1 && (index === 0 || !smallTitleWords.has(lower)));
    return titleCaseWord(part, partForce);
  }).join('-');
}

function titleCaseTitle(title) {
  const normalized = normalizeTitlePunctuation(title);
  if (exactTitleOverrides.has(normalized)) return exactTitleOverrides.get(normalized);

  const words = normalized.split(' ');
  let forceNext = true;
  return words.map((word, index) => {
    const last = index === words.length - 1;
    const out = titleCaseHyphenated(word, forceNext || last);
    forceNext = /[:?!]"?$/.test(word) || /[:?!]$/.test(word.replace(/"$/, ''));
    return out;
  }).join(' ')
    .replace(/\bStay-At-Home-Moms'/g, "Stay-at-Home-Moms'")
    .replace(/\bSelf-presentation\b/g, 'Self-Presentation')
    .replace(/\bUser-centered\b/g, 'User-Centered')
    .replace(/\bVoice-controlled\b/g, 'Voice-Controlled')
    .replace(/\bCamera-based\b/g, 'Camera-Based')
    .replace(/\bEnd-user\b/g, 'End-User')
    .replace(/\bLocation-based\b/g, 'Location-Based')
    .replace(/\bOpt-out\b/g, 'Opt-Out')
    .replace(/\bTurn Into\b/g, 'Turn into')
    .replace(/\bUser Centered\b/g, 'User-Centered');
}

// Convert "Last, First and Doe, Jane" to "Last, F., Doe, J."
function formatAuthors(authorField) {
  if (!authorField) return '';

  // Split authors on " and " (BibTeX standard)
  const authors = authorField
    .split(/\s+and\s+/i)
    .map(a => a.trim())
    .filter(Boolean);

  const formatted = authors.map(a => {
    // Case 1: "Last, First"
    if (a.includes(',')) {
      const [last, firstPart] = a.split(',').map(s => s.trim());
      const initials = firstPart
        ? firstPart
            .split(/\s+/)
            .filter(Boolean)
            .map(n => n[0].toUpperCase() + '.')
            .join(' ')
        : '';
      return initials ? `${last}, ${initials}` : last;
    }

    // Case 2: "First Middle Last"
    const parts = a.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0]; // Single name
    }
    const last = parts[parts.length - 1];
    const firstNames = parts.slice(0, -1);
    const initials = firstNames
      .map(n => n[0].toUpperCase() + '.')
      .join(' ');
    return `${last}, ${initials}`;
  });

  return formatted.join(', ');
}

// Extract venue: prefer journal, then booktitle, then others
function getVenue(tags) {
  const candidates = [
    tags.journal,
    tags.booktitle,
    tags.school,
    tags.institution,
    tags.publisher,
    tags.organization
  ];
  return cleanField(candidates.find(v => v) || '');
}

// Extract link: url, or DOI if available, else '#'
function getLink(tags) {
  const url = cleanField(tags.url);
  if (url) return url;
  const doi = cleanField(tags.doi);
  if (doi) return `https://doi.org/${doi}`;
  return '#';
}

// Map BibTeX entries → publications[]
const publications = entries.map(entry => {
  const tags = entry.entryTags || {};

  const year = tags.year ? parseInt(cleanField(tags.year), 10) : null;
  const title = titleCaseTitle(cleanField(tags.title));
  const authors = formatAuthors(cleanField(tags.author));
  const venue = getVenue(tags);
  const link = getLink(tags);

  return { year, title, authors, venue, link };
});

// Sort descending by year (optional, but matches your example)
publications.sort((a, b) => {
  if (a.year === null) return 1;
  if (b.year === null) return -1;
  return b.year - a.year;
});

// Output JS file content in the same format as publicationsData.js
const output = `// Publications data (auto-generated from BibTeX)
// To update: edit this file or run: node bib-to-js.js your-file.bib > data/publicationsData.js

const publications = ${JSON.stringify(publications, null, 2)};
`;

process.stdout.write(output);
