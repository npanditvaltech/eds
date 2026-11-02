/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-cards.
 * Source: .tab-container (tab menu buttons + .tab-pane panels, incl. hidden panes)
 * One row per tab: cell 1 tab label; cell 2 flat list of article cards, each as
 * image, tag paragraph, H3 containing the article link, description paragraph.
 */
export default function parse(element, { document }) {
  const cells = [];

  const labels = [...element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button')]
    .filter((b, i, arr) => arr.indexOf(b) === i)
    .map((b) => b.textContent.trim());
  const panes = [...element.querySelectorAll('.tab-pane')];

  panes.forEach((pane, i) => {
    let label = labels[i];
    if (!label) {
      const id = (pane.id || '').replace(/^tab-/, '');
      label = id ? id.charAt(0).toUpperCase() + id.slice(1) : `Tab ${i + 1}`;
    }

    const content = [];
    pane.querySelectorAll('.article-card').forEach((card) => {
      const href = card.getAttribute('href') || (card.querySelector('a[href]') && card.querySelector('a[href]').getAttribute('href'));

      const srcImg = card.querySelector('.article-card-image img, img');
      if (srcImg) {
        const img = document.createElement('img');
        img.src = srcImg.getAttribute('src');
        img.alt = srcImg.getAttribute('alt') || '';
        content.push(img);
      }

      const tag = card.querySelector('.article-card-meta .tag, .tag');
      if (tag && tag.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = tag.textContent.trim();
        content.push(p);
      }

      const srcHeading = card.querySelector('h1, h2, h3, h4, h5, h6');
      if (srcHeading) {
        const h3 = document.createElement('h3');
        if (href) {
          const a = document.createElement('a');
          a.href = href;
          a.textContent = srcHeading.textContent.trim();
          h3.append(a);
        } else {
          h3.textContent = srcHeading.textContent.trim();
        }
        content.push(h3);
      }

      const desc = card.querySelector('.article-card-body p');
      if (desc && desc.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        content.push(p);
      }
    });

    cells.push([label, content]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-cards', cells });
  element.replaceWith(block);
}
