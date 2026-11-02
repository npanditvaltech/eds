/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq.
 * Source: .faq-list > .faq-item (button.faq-question + div.faq-answer)
 * One row per item: cell 1 question text; cell 2 answer (rich text).
 */
export default function parse(element, { document }) {
  const cells = [];

  element.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-question');
    // Read text from the whole button: the inner <span> may be unwrapped by the
    // importer, and the icon span carries no text.
    const question = q ? q.textContent.replace(/\s+/g, ' ').trim() : '';
    if (!question) return;

    const a = item.querySelector('.faq-answer');
    const answer = [];
    if (a) {
      const blockChildren = [...a.children].filter((c) => /^(P|UL|OL|H[1-6]|TABLE|BLOCKQUOTE)$/.test(c.tagName));
      if (blockChildren.length) {
        answer.push(...blockChildren);
      } else if (a.textContent.trim()) {
        const p = document.createElement('p');
        p.append(...a.childNodes);
        answer.push(p);
      }
    }

    cells.push([question, answer]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
