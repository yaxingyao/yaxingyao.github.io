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
  const title = cleanField(tags.title);
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
