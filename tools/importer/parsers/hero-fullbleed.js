/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-fullbleed.
 * Source: section.hero-section.hero-section--full
 * Rows: (1) background image, (2) eyebrow, H1, lead, CTA links (one per paragraph;
 * bold = primary, italic = secondary).
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: background image
  const img = element.querySelector('.hero-bg img, img');
  if (img) {
    const bg = document.createElement('img');
    bg.src = img.getAttribute('src');
    bg.alt = img.getAttribute('alt') || '';
    cells.push([bg]);
  } else {
    cells.push(['']);
  }

  // Row 2: text content
  const content = [];
  const scope = element.querySelector('.hero-content-inner, .hero-content') || element;

  const eyebrow = scope.querySelector('p.tag');
  if (eyebrow) {
    const p = document.createElement('p');
    p.textContent = eyebrow.textContent.trim();
    content.push(p);
  }

  const heading = scope.querySelector('h1, h2');
  if (heading) content.push(heading);

  const lead = scope.querySelector('p.hero-lead, p.paragraph-xl');
  if (lead) content.push(lead);

  scope.querySelectorAll('.button-group a[href]').forEach((a) => {
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = a.textContent.trim();
    const isSecondary = /ghost|secondary/.test(a.className);
    const wrap = document.createElement(isSecondary ? 'em' : 'strong');
    wrap.append(link);
    const p = document.createElement('p');
    p.append(wrap);
    content.push(p);
  });

  cells.push([content]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-fullbleed', cells });
  element.replaceWith(block);
}
