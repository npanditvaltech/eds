/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery.
 * Source: .grid-layout.grid-images (3 images) + the NEXT SIBLING div.utility-margin-top-lg
 * holding the wide 4th image. The sibling is consumed (removed) so it does not also
 * import as default content.
 * One row per tile: cell 1 image; cell 2 caption (empty).
 */
export default function parse(element, { document }) {
  // Both instance selectors match the same node; skip if already replaced.
  if (!element.parentNode) return;

  const sources = [...element.querySelectorAll('img')];

  // Wide trailing tile lives in the next element sibling.
  const next = element.nextElementSibling;
  const nextIsWideTile = next
    && next.classList.contains('utility-margin-top-lg')
    && next.querySelector('img')
    && !next.textContent.trim();
  if (nextIsWideTile) {
    sources.push(...next.querySelectorAll('img'));
  }

  const cells = [];
  sources.forEach((src) => {
    const img = document.createElement('img');
    img.src = src.getAttribute('src');
    img.alt = src.getAttribute('alt') || '';
    cells.push([img, '']);
  });

  if (nextIsWideTile) next.remove();

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
