/**
 * A paragraph that contains nothing but a single link (an authored CTA).
 * @param {Element} el
 * @returns {boolean}
 */
function isCtaParagraph(el) {
  if (!el || el.tagName !== 'P') return false;
  const link = el.querySelector('a');
  return !!link && el.textContent.trim() === link.textContent.trim();
}

export default function decorate(block) {
  const firstRow = block.firstElementChild;
  const cols = firstRow ? [...firstRow.children] : [];
  if (cols.length) block.classList.add(`columns-feature-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add('columns-feature-row');
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      // a column whose only content is a picture is the media column
      const imageOnly = pic && col.textContent.trim() === '';
      col.classList.add(imageOnly ? 'columns-feature-img-col' : 'columns-feature-text-col');
      if (imageOnly) return;

      // eyebrow tag: a short leading paragraph directly followed by a heading
      const first = col.firstElementChild;
      const next = first && first.nextElementSibling;
      if (first && first.tagName === 'P' && next && /^H[1-6]$/.test(next.tagName)
        && !first.querySelector('a, picture')) {
        first.classList.add('columns-feature-tag');
      }

      // trailing CTA paragraphs form the footer bar (divider + right-aligned buttons)
      const ctas = [];
      let el = col.lastElementChild;
      while (isCtaParagraph(el)) {
        ctas.unshift(el);
        el = el.previousElementSibling;
      }
      if (ctas.length) {
        const footer = document.createElement('div');
        footer.className = 'columns-feature-footer';
        ctas[0].before(footer);
        footer.append(...ctas);
      }
    });
  });
}
