/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-ticker.
 * Source: div.ticker-strip > .ticker-track > span (labels duplicated for looping,
 * separated by span.ticker-sep "·"). One row per unique label, one plain-text cell.
 *
 * The real html2md path may unwrap inline <span>s, leaving the labels as bare text
 * nodes separated by "·" and newlines, so labels are read from text, not span count.
 */
export default function parse(element, { document }) {
  // Both instance selectors (div.ticker-strip, .ticker-track) can match nested nodes of the
  // same ticker. Always operate on the outer strip so whichever runs first produces the
  // block, and the second match (now detached) becomes a no-op.
  const root = (element.closest && element.closest('.ticker-strip')) || element;
  if (!root.parentNode) return;

  const track = root.querySelector('.ticker-track') || root;

  // Prefer span labels when present; otherwise split the raw text on separators.
  let rawLabels = [...track.querySelectorAll('span:not(.ticker-sep)')]
    .map((s) => s.textContent);
  if (!rawLabels.length) {
    rawLabels = track.textContent.split(/[·•\n\r]+/);
  }

  const cells = [];
  const seen = new Set();
  rawLabels.forEach((raw) => {
    const text = raw.replace(/\s+/g, ' ').trim();
    if (!text || /^[·•|\-–—]+$/.test(text)) return;
    const key = text.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    cells.push([text]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-ticker', cells });
  root.replaceWith(block);
}
