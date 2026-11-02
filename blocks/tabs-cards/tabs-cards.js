import { createOptimizedPicture, toClassName } from '../../scripts/aem.js';

let instanceCount = 0;

/**
 * Splits a tab panel's flat authored content into cards.
 * A new card starts at each picture, or at a heading when the current card already has one.
 * Expected per card: image, tag paragraph, heading (linked), description.
 * @param {Element[]} nodes element children of the panel cell(s)
 * @returns {Element[][]}
 */
function splitIntoCards(nodes) {
  const cards = [];
  let current = null;
  nodes.forEach((node) => {
    const hasPicture = !!(node.matches('picture') || node.querySelector('picture'));
    const isHeading = /^H[1-6]$/.test(node.tagName);
    const startNew = !current
      || (hasPicture && current.length > 0)
      || (isHeading && current.some((n) => /^H[1-6]$/.test(n.tagName)));
    if (startNew) {
      current = [];
      cards.push(current);
    }
    current.push(node);
  });
  return cards;
}

/**
 * Builds the card grid for one panel.
 * @param {Element[]} nodes
 * @returns {HTMLUListElement}
 */
function buildCardGrid(nodes) {
  const ul = document.createElement('ul');
  ul.className = 'tabs-cards-grid';
  splitIntoCards(nodes).forEach((cardNodes) => {
    const li = document.createElement('li');
    li.className = 'tabs-cards-card';
    const image = document.createElement('div');
    image.className = 'tabs-cards-card-image';
    const body = document.createElement('div');
    body.className = 'tabs-cards-card-body';
    cardNodes.forEach((node) => {
      const pic = node.matches('picture') ? node : node.querySelector('picture');
      if (pic && !image.children.length && node.textContent.trim() === '') {
        image.append(pic);
      } else {
        body.append(node);
      }
    });
    if (image.children.length) li.append(image);
    li.append(body);
    // the first link in the card heading makes the whole card clickable (via CSS)
    const headingLink = body.querySelector('h1 a, h2 a, h3 a, h4 a, h5 a, h6 a');
    if (headingLink) li.classList.add('tabs-cards-card-linked');
    ul.append(li);
  });
  return ul;
}

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

export default function decorate(block) {
  instanceCount += 1;
  const prefix = `tabs-cards-${instanceCount}`;

  const tablist = document.createElement('div');
  tablist.className = 'tabs-cards-list';
  tablist.setAttribute('role', 'tablist');

  const panels = [];
  const buttons = [];

  const select = (index, focus = false) => {
    buttons.forEach((btn, i) => {
      const active = i === index;
      btn.setAttribute('aria-selected', active);
      btn.tabIndex = active ? 0 : -1;
      panels[i].setAttribute('aria-hidden', !active);
    });
    if (focus) buttons[index].focus();
  };

  [...block.children].forEach((row) => {
    const [labelCell, ...contentCells] = [...row.children];
    if (!labelCell) return;
    const label = labelCell.textContent.trim();
    if (!label && !contentCells.length) return;

    const i = panels.length;
    const id = `${prefix}-${toClassName(label) || i + 1}-${i}`;

    const panel = document.createElement('div');
    panel.className = 'tabs-cards-pane';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    const nodes = contentCells.flatMap((cell) => [...cell.children]);
    if (nodes.length) panel.append(buildCardGrid(nodes));

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tabs-cards-tab';
    button.id = `tab-${id}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panel.id);
    button.textContent = label || `Tab ${i + 1}`;
    button.addEventListener('click', () => select(i));

    panels.push(panel);
    buttons.push(button);
    tablist.append(button);
  });

  tablist.addEventListener('keydown', (e) => {
    const current = buttons.indexOf(document.activeElement);
    if (current < 0) return;
    let next = null;
    if (e.key === 'ArrowRight') next = (current + 1) % buttons.length;
    else if (e.key === 'ArrowLeft') next = (current - 1 + buttons.length) % buttons.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = buttons.length - 1;
    if (next !== null) {
      e.preventDefault();
      select(next, true);
    }
  });

  block.replaceChildren(tablist, ...panels);
  if (buttons.length) select(0);
  optimizeImages(block);
}
