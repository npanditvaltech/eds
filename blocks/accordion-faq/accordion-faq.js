/*
 * Accordion FAQ block: separate bordered question/answer items with a plus icon.
 * Row = [question, answer]. A row with a single cell becomes a question with no answer body.
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [label, body] = [...row.children];
    if (!label || (!label.textContent.trim() && !body)) {
      row.remove();
      return;
    }

    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    const text = document.createElement('span');
    text.className = 'accordion-faq-item-title';
    // summary allows phrasing content only: unwrap a lone paragraph
    const only = label.children.length === 1 ? label.firstElementChild : null;
    const source = only?.tagName === 'P' && label.textContent.trim() === only.textContent.trim()
      ? only : label;
    text.append(...source.childNodes);
    const icon = document.createElement('span');
    icon.className = 'accordion-faq-item-icon';
    icon.setAttribute('aria-hidden', 'true');
    summary.append(text, icon);

    const content = body || document.createElement('div');
    content.className = 'accordion-faq-item-body';

    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary, content);
    row.replaceWith(details);
  });
}
