/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature.
 * Source: .featured-article
 * One row, two cells: (1) image, (2) tag paragraph, H2, description, CTA link.
 */
export default function parse(element, { document }) {
  const imgSrc = element.querySelector('.featured-article-image img, img');
  const imageCell = [];
  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc.getAttribute('src');
    img.alt = imgSrc.getAttribute('alt') || '';
    imageCell.push(img);
  }

  const textScope = [...element.children].find((c) => !c.classList.contains('featured-article-image')) || element;
  const textCell = [];

  const tag = textScope.querySelector('p.tag');
  if (tag) {
    const p = document.createElement('p');
    p.textContent = tag.textContent.trim();
    textCell.push(p);
  }

  const heading = textScope.querySelector('h1, h2, h3');
  if (heading) textCell.push(heading);

  textScope.querySelectorAll('p:not(.tag)').forEach((p) => {
    if (p.textContent.trim() && !p.closest('.featured-article-footer')) textCell.push(p);
  });

  textScope.querySelectorAll('.featured-article-footer a[href]').forEach((a) => {
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = a.textContent.trim();
    const strong = document.createElement('strong');
    strong.append(link);
    const p = document.createElement('p');
    p.append(strong);
    textCell.push(p);
  });

  const cells = [[imageCell, textCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
