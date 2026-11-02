import { createOptimizedPicture } from '../../scripts/aem.js';

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
        group.className = 'hero-fullbleed-actions';
        child.before(group);
      }
      group.append(child);
    } else {
      group = null;
    }
  });
}

/**
 * Optimizes the background image when it is same-origin and not an SVG.
 * External (not yet uploaded) and SVG images keep the authored picture.
 * @param {Element} media
 */
function optimizeMedia(media) {
  media.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, true, [
      { media: '(min-width: 900px)', width: '2000' },
      { width: '900' },
    ]));
  });
}

export default function decorate(block) {
  const media = document.createElement('div');
  media.className = 'hero-fullbleed-media';
  const content = document.createElement('div');
  content.className = 'hero-fullbleed-content';

  // Authors may put the image in its own row, in its own cell, or alongside the text.
  // The first picture becomes the background; any further pictures stay in the content.
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const pic = media.querySelector('picture') ? null : cell.querySelector('picture');
      if (pic) {
        const wrapper = pic.parentElement;
        media.append(pic);
        if (wrapper !== cell && wrapper.tagName === 'P' && !wrapper.textContent.trim() && !wrapper.children.length) {
          wrapper.remove();
        }
      }
      content.append(...cell.childNodes);
    });
  });

  const children = [];
  if (media.querySelector('picture')) {
    optimizeMedia(media);
    block.classList.add('hero-fullbleed-has-media');
    children.push(media);
  }

  groupActions(content);
  const inner = document.createElement('div');
  inner.className = 'hero-fullbleed-content-inner';
  inner.append(...content.childNodes);
  content.append(inner);
  children.push(content);

  block.replaceChildren(...children);
}
