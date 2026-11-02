/* eslint-disable */
/* global WebImporter */

/**
 * WKND Adventures cleanup transformer.
 * Removes non-authorable chrome (skip link, global header/nav + megamenus,
 * global footer), scripts/styles and tracking attributes.
 * Selectors are taken from migration-work/cleaned.html.
 */
// Source uses bare relative image paths ("images/..."), which the importer's
// adjustImageUrls cannot resolve and drops; make them absolute.
function absolutizeImages(element, payload) {
  const base = (payload.params && payload.params.originalURL) || payload.url;
  if (!base) return;
  element.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (!src || /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(src)) return;
    try {
      img.setAttribute('src', new URL(src, base).toString());
    } catch (e) {
      // leave as-is
    }
  });
}

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    absolutizeImages(element, payload);

    // Global chrome that would otherwise be picked up by block matching.
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      'nav.nav-menu',
      '#nav-menu',
      '.nav-megamenu',
      '.nav-mobile-menu-button',
      'footer.footer.inverse-footer',
    ]);

    // Non-content elements.
    WebImporter.DOMUtils.remove(element, [
      'script',
      'style',
      'noscript',
      'link',
      'iframe[src*="googletagmanager"]',
    ]);
  }

  if (hookName === 'afterTransform') {
    absolutizeImages(element, payload);

    // Button groups left in default content: one link per paragraph,
    // bold = primary (.button), italic = secondary (.button--ghost).
    const doc = element.ownerDocument;
    element.querySelectorAll('.button-group').forEach((group) => {
      const paras = [...group.querySelectorAll('a')].map((a) => {
        const p = doc.createElement('p');
        const wrap = doc.createElement(a.classList.contains('button--ghost') ? 'em' : 'strong');
        wrap.append(a);
        p.append(wrap);
        return p;
      });
      group.replaceWith(...paras);
    });

    // Safety net for any chrome left over after parsing.
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      '.nav-megamenu',
      'footer.footer',
      'script',
      'style',
      'noscript',
      'link',
    ]);

    // Strip tracking / interaction attributes.
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        const n = attr.name;
        if (
          n.startsWith('data-track')
          || n.startsWith('data-analytics')
          || n.startsWith('data-gtm')
          || n === 'onclick'
          || n === 'onload'
        ) {
          el.removeAttribute(n);
        }
      });
    });
  }
}
