import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * Cards Gallery: image-only tiles in a 3-column grid. Each row is one tile: image in the
 * first cell, an optional (usually empty) text cell kept as a caption.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'cards-gallery-list';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-gallery-item';
    [...row.children].forEach((cell) => {
      const pic = cell.querySelector('picture');
      if (pic && cell.textContent.trim() === '') {
        const image = document.createElement('div');
        image.className = 'cards-gallery-item-image';
        image.append(...cell.querySelectorAll('picture'));
        li.append(image);
      } else if (cell.textContent.trim() || cell.children.length) {
        cell.className = 'cards-gallery-item-caption';
        li.append(cell);
      }
    });
    if (li.children.length) ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  block.replaceChildren(ul);
}
