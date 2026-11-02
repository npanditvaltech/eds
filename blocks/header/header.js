/* breakpoint-exception: source header switches to its desktop layout at 1025px */
const isDesktop = window.matchMedia('(width >= 1025px)');
const CLOSE_DELAY = 150;

/**
 * Fetches the nav fragment: /content first (local preview), then root (DA/EDS).
 * Image paths are resolved against the fragment URL.
 * @returns {Promise<HTMLElement|null>} container holding the fragment sections
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const container = document.createElement('div');
  container.innerHTML = await resp.text();
  container.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), resp.url).href;
  });
  return container;
}

/**
 * Turns a list item (link paragraph + description paragraphs) into a card link.
 * @param {HTMLLIElement} li source list item
 * @returns {HTMLElement} card link (or plain text when the item has no link)
 */
function buildCard(li) {
  const source = li.querySelector('a');
  if (!source) {
    const text = document.createElement('span');
    text.className = 'nav-card';
    text.textContent = li.textContent.trim();
    return text;
  }
  const card = document.createElement('a');
  card.className = 'nav-card';
  card.href = source.getAttribute('href');
  const title = document.createElement('span');
  title.className = 'nav-card-title';
  title.textContent = source.textContent.trim();
  card.append(title);
  const desc = [...li.querySelectorAll(':scope > p')]
    .filter((p) => !p.contains(source))
    .map((p) => p.textContent.trim())
    .filter(Boolean)
    .join(' ');
  if (desc) {
    const descEl = document.createElement('span');
    descEl.className = 'nav-card-desc';
    descEl.textContent = desc;
    card.append(descEl);
  }
  return card;
}

/**
 * Builds a megamenu panel from the children of a top-level nav item.
 * Each <ul> becomes a group; a <p> before a <ul> becomes that group's label.
 * @param {Element[]} nodes child nodes after the trigger label
 * @param {string} id panel id
 * @returns {HTMLDivElement} panel
 */
function buildPanel(nodes, id) {
  const panel = document.createElement('div');
  panel.className = 'nav-panel';
  panel.id = id;
  const inner = document.createElement('div');
  inner.className = 'nav-panel-inner';
  let label = null;
  nodes.forEach((node) => {
    if (node.tagName === 'P') {
      label = node.textContent.trim();
    } else if (node.tagName === 'UL') {
      const group = document.createElement('div');
      group.className = 'nav-panel-group';
      if (label) {
        group.classList.add('nav-panel-group-labeled');
        const labelEl = document.createElement('p');
        labelEl.className = 'nav-panel-label';
        labelEl.textContent = label;
        group.append(labelEl);
        label = null;
      }
      const list = document.createElement('div');
      list.className = 'nav-panel-list';
      [...node.children].forEach((li) => list.append(buildCard(li)));
      group.append(list);
      inner.append(group);
    }
  });
  inner.classList.add(inner.children.length > 1 ? 'nav-panel-inner-split' : 'nav-panel-inner-grid');
  panel.append(inner);
  return panel;
}

/**
 * Sets the open state of a nav drop item and closes the others.
 * @param {Element} nav nav element
 * @param {Element|null} item nav drop item to open, or null to close all
 */
function setOpenItem(nav, item) {
  nav.querySelectorAll('.nav-drop').forEach((drop) => {
    const open = drop === item;
    drop.classList.toggle('is-open', open);
    drop.querySelector('.nav-drop-trigger').setAttribute('aria-expanded', open);
  });
}

/**
 * Opens or closes the mobile menu.
 * @param {Element} nav nav element
 * @param {boolean} [force] desired state; toggles when omitted
 */
function toggleMenu(nav, force) {
  const open = force ?? nav.getAttribute('aria-expanded') !== 'true';
  nav.setAttribute('aria-expanded', open);
  const button = nav.querySelector('.nav-hamburger button');
  button.setAttribute('aria-expanded', open);
  button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  if (!open) setOpenItem(nav, null);
}

/**
 * Builds the main navigation list with megamenu triggers.
 * @param {Element} section nav fragment section holding the top-level list
 * @param {Element} nav nav element
 * @returns {HTMLElement} nav landmark holding the main menu
 */
function buildSections(section, nav) {
  const sections = document.createElement('nav');
  sections.className = 'nav-sections';
  sections.setAttribute('aria-label', 'Main');
  const list = document.createElement('ul');
  list.className = 'nav-menu';
  const topList = section.querySelector('ul');
  if (!topList) return sections;

  [...topList.children].forEach((li, index) => {
    const item = document.createElement('li');
    item.className = 'nav-item';
    const labelNode = li.querySelector(':scope > p, :scope > a') || li.firstChild;
    const rest = [...li.children].filter((child) => child !== labelNode);
    const hasPanel = rest.some((child) => child.tagName === 'UL');

    if (!hasPanel) {
      const link = labelNode && (labelNode.tagName === 'A' ? labelNode : labelNode.querySelector('a'));
      if (link) item.append(link);
      else item.textContent = li.textContent.trim();
      list.append(item);
      return;
    }

    item.classList.add('nav-drop');
    const panelId = `nav-panel-${index}`;
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'nav-drop-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', panelId);
    const label = document.createElement('span');
    label.textContent = labelNode.textContent.trim();
    const caret = document.createElement('span');
    caret.className = 'nav-caret';
    caret.setAttribute('aria-hidden', 'true');
    trigger.append(label, caret);
    item.append(trigger, buildPanel(rest, panelId));

    let closeTimer;
    item.addEventListener('pointerenter', (e) => {
      if (!isDesktop.matches || e.pointerType === 'touch') return;
      clearTimeout(closeTimer);
      setOpenItem(nav, item);
    });
    // desktop: open on hover or focus (like :hover / :focus-within), close when both are gone
    item.addEventListener('pointerleave', (e) => {
      if (!isDesktop.matches || e.pointerType === 'touch') return;
      closeTimer = setTimeout(() => {
        if (item.classList.contains('is-open') && !item.contains(document.activeElement)) {
          setOpenItem(nav, null);
        }
      }, CLOSE_DELAY);
    });
    item.addEventListener('focusout', (e) => {
      if (isDesktop.matches && !item.contains(e.relatedTarget) && !item.matches(':hover')) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
    trigger.addEventListener('click', () => {
      clearTimeout(closeTimer);
      if (isDesktop.matches) {
        setOpenItem(nav, item);
      } else {
        // mobile accordion: sections expand independently
        const open = !item.classList.contains('is-open');
        item.classList.toggle('is-open', open);
        trigger.setAttribute('aria-expanded', open);
      }
    });
    list.append(item);
  });

  sections.append(list);
  return sections;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';
  if (!fragment) return;

  const [brandSection, menuSection, toolsSection] = fragment.children;
  // bar container; the <nav> landmark wraps only the main menu (as on the source)
  const nav = document.createElement('div');
  nav.className = 'nav-bar';
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const brandLink = brandSection && brandSection.querySelector('a');
  if (brandLink) {
    brandLink.className = 'nav-logo';
    const img = brandLink.querySelector('img');
    if (img) {
      img.width = 32;
      img.height = 32;
      img.alt = '';
    }
    // wrap the logo text so it can be styled independently of the mark
    const text = document.createElement('span');
    text.className = 'nav-logo-text';
    [...brandLink.childNodes].filter((n) => n !== img).forEach((n) => text.append(n));
    brandLink.append(text);
    brandLink.setAttribute('aria-label', text.textContent.replace(/\s+/g, ' ').trim());
    brand.append(brandLink);
  }

  const sections = menuSection ? buildSections(menuSection, nav) : document.createElement('div');

  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  if (toolsSection) {
    toolsSection.querySelectorAll('a').forEach((a) => {
      const cta = document.createElement('a');
      cta.href = a.getAttribute('href');
      cta.textContent = a.textContent.trim();
      cta.className = a.closest('strong') ? 'nav-cta' : 'nav-tool-link';
      tools.append(cta);
    });
  }

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-expanded="false" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.querySelector('button').addEventListener('click', () => toggleMenu(nav));

  nav.append(brand, sections, tools, hamburger);

  // close panels on Escape and on outside click
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = nav.querySelector('.nav-drop.is-open');
    if (open) {
      setOpenItem(nav, null);
      open.querySelector('.nav-drop-trigger').focus();
    } else if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
      toggleMenu(nav, false);
      hamburger.querySelector('button').focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !nav.contains(e.target)) setOpenItem(nav, null);
  });

  // reset state when crossing the desktop/mobile breakpoint
  isDesktop.addEventListener('change', () => {
    setOpenItem(nav, null);
    toggleMenu(nav, false);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
