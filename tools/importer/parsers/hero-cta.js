/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-cta.
 * Source: section.accent-section .container.utility-text-align-center
 * Single content row (no image): H2, paragraph, CTA links (one per paragraph;
 * bold = primary, italic = secondary).
 */
export default function parse(element, { document }) {
  const content = [];

  const heading = element.querySelector('h1, h2, h3');
  if (heading) content.push(heading);

  element.querySelectorAll(':scope > p, :scope > div:not(.button-group) > p').forEach((p) => {
    if (p.textContent.trim()) content.push(p);
  });

  element.querySelectorAll('.button-group a[href]').forEach((a) => {
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

  const cells = [[content]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
