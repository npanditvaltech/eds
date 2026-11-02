/**
 * Fetches the footer fragment: /content first (local preview), then root (DA/EDS).
 * Image paths are resolved against the fragment URL.
 * @returns {Promise<HTMLElement|null>} container holding the fragment sections
 */
async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const container = document.createElement('div');
  container.innerHTML = await resp.text();
  container.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), resp.url).href;
  });
  return container;
}

/**
 * Builds the brand column: first paragraph is the logo (mark + text), the rest is copy.
 * @param {Element} section fragment section
 * @returns {HTMLDivElement} brand column
 */
function buildBrand(section) {
  const brand = document.createElement('div');
  brand.className = 'footer-brand';
  const [logoPara, ...rest] = section.querySelectorAll(':scope > p');
  if (logoPara) {
    const logo = document.createElement('div');
    logo.className = 'footer-logo';
    const img = logoPara.querySelector('img');
    if (img) {
      img.width = 32;
      img.height = 32;
      const mark = document.createElement('span');
      mark.className = 'footer-logo-icon';
      mark.append(img);
      logo.append(mark);
    }
    const text = document.createElement('span');
    text.className = 'footer-logo-text';
    text.append(...logoPara.childNodes);
    logo.append(text);
    brand.append(logo);
  }
  rest.forEach((p) => {
    p.className = 'footer-tagline';
    brand.append(p);
  });
  return brand;
}

/**
 * Splits a section into link columns: each heading starts a column with the list after it.
 * @param {Element} section fragment section
 * @returns {HTMLDivElement[]} link columns
 */
function buildLinkColumns(section) {
  const columns = [];
  let current = null;
  [...section.children].forEach((child) => {
    if (/^H[1-6]$/.test(child.tagName) || !current) {
      current = document.createElement('div');
      current.className = 'footer-col';
      columns.push(current);
    }
    if (/^H[1-6]$/.test(child.tagName)) {
      const heading = document.createElement('h2');
      heading.className = 'footer-col-heading';
      heading.textContent = child.textContent.trim();
      current.append(heading);
    } else {
      if (child.tagName === 'UL') {
        child.className = 'footer-links';
        child.querySelectorAll('a').forEach((a) => { a.className = 'footer-link'; });
      }
      current.append(child);
    }
  });
  return columns;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooter();
  block.textContent = '';
  if (!fragment) return;

  const [brandSection, linksSection, bottomSection] = fragment.children;
  const inner = document.createElement('div');
  inner.className = 'footer-inner';

  const top = document.createElement('div');
  top.className = 'footer-top';
  if (brandSection) top.append(buildBrand(brandSection));
  if (linksSection) top.append(...buildLinkColumns(linksSection));
  inner.append(top);

  if (bottomSection) {
    const bottom = document.createElement('div');
    bottom.className = 'footer-bottom';
    bottomSection.querySelectorAll(':scope > p').forEach((p) => {
      p.className = 'footer-tagline';
      bottom.append(p);
    });
    inner.append(bottom);
  }

  block.append(inner);
}
