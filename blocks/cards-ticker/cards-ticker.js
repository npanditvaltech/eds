/*
 * Cards Ticker: text-only items rendered as a continuously scrolling horizontal strip.
 * Each row is one label (any image cell is ignored). Items are authored once; the block
 * duplicates the list (hidden from assistive tech) so the marquee loops seamlessly.
 */
export default function decorate(block) {
  const labels = [...block.children]
    .map((row) => {
      const cells = [...row.children].filter((cell) => cell.textContent.trim());
      return cells.length ? cells[cells.length - 1].textContent.trim() : '';
    })
    .filter(Boolean);

  const buildList = (hidden) => {
    const ul = document.createElement('ul');
    ul.className = 'cards-ticker-list';
    if (hidden) ul.setAttribute('aria-hidden', 'true');
    labels.forEach((label) => {
      const li = document.createElement('li');
      li.className = 'cards-ticker-item';
      li.textContent = label;
      ul.append(li);
    });
    return ul;
  };

  const track = document.createElement('div');
  track.className = 'cards-ticker-track';
  track.append(buildList(false));
  if (labels.length) track.append(buildList(true));

  block.replaceChildren(track);
}
