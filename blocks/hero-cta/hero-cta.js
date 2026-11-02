/**
 * Whether a paragraph holds nothing but a single link (optionally wrapped in strong/em).
 * @param {Element} el
 * @returns {boolean}
 */
function isLinkOnlyParagraph(el) {
  if (el.tagName !== 'P') return false;
  const links = el.querySelectorAll('a[href]');
  return links.length === 1 && el.textContent.trim() === links[0].textContent.trim();
}

/**
 * Groups consecutive link-only paragraphs into one actions container.
 * @param {Element} content
 */
function groupActions(content) {
  let group = null;
  [...content.children].forEach((child) => {
    if (isLinkOnlyParagraph(child)) {
      if (!group) {
        group = document.createElement('div');
        group.className = 'hero-cta-actions';
        child.before(group);
      }
      group.append(child);
    } else {
      group = null;
    }
  });
}

export default function decorate(block) {
  const content = document.createElement('div');
  content.className = 'hero-cta-content';

  // Image-less banner: flatten every authored row/cell into one content column.
  // An optional image (if an author adds one) is kept inline rather than dropped.
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => content.append(...cell.childNodes));
  });

  groupActions(content);
  block.replaceChildren(content);
}
