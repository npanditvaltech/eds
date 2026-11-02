/* eslint-disable */
/* global WebImporter */

/**
 * WKND Adventures sections transformer.
 * beforeTransform: inserts <hr> section breaks (reverse order) while the
 *   original section elements still exist; styled sections get a marker.
 * afterTransform: inserts Section Metadata blocks for styled sections and
 *   removes temporary markers.
 */
const MARKER = 'data-excat-section-id';

function findSection(root, selectors) {
  const list = Array.isArray(selectors) ? selectors : [selectors];
  for (const sel of list) {
    if (!sel) continue;
    try {
      const el = root.querySelector(sel);
      if (el) return el;
    } catch (e) {
      // unsupported selector in this DOM implementation; try next
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const sections = (payload && payload.template && payload.template.sections) || [];
  if (sections.length < 2) return;
  const document = element.ownerDocument || payload.document;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const el = findSection(element, section.selector);
      if (!el) continue;
      // Remember the source element so afterTransform can find it if it survives.
      if (section.style) el.setAttribute(`${MARKER}-el`, section.id);
      if (i > 0 || section.style) {
        const hr = document.createElement('hr');
        if (section.style) hr.setAttribute(MARKER, section.id);
        if (i === 0) hr.setAttribute(`${MARKER}-first`, 'true');
        el.parentNode.insertBefore(hr, el);
      }
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;
      const surviving = element.querySelector(`[${MARKER}-el="${section.id}"]`);
      const marker = element.querySelector(`hr[${MARKER}="${section.id}"]`);
      const anchor = surviving || marker;
      if (!anchor) continue;
      const metadata = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadata);
    }

    element.querySelectorAll(`[${MARKER}-el]`).forEach((el) => el.removeAttribute(`${MARKER}-el`));
    element.querySelectorAll(`hr[${MARKER}-first]`).forEach((hr) => hr.remove());
    element.querySelectorAll(`[${MARKER}]`).forEach((el) => el.removeAttribute(MARKER));
  }
}
