/**
 * Hearthstead · Workshop directory and profile detail.
 *
 * To add a member, edit data/members.json; no card HTML must be duplicated.
 * Every new member gets a stable URL: workshop.html?slug=member-slug
 */
(() => {
  'use strict';
  const ui = window.HearthsteadData;
  const list = document.querySelector('[data-workshop-list]');
  const detail = document.querySelector('[data-workshop-detail]');
  if (!list && !detail) return;

  const search = document.getElementById('workshop-search');
  const count = document.querySelector('[data-workshop-count]');
  const empty = document.querySelector('[data-workshop-empty]');
  const filterRoot = document.querySelector('[data-workshop-filters]');
  let members = [];
  let projects = [];
  let currentFilter = 'all';

  /** Render one directory card using DOM APIs to keep JSON content inert. */
  function card(member) {
    const article = ui.element('article', 'workshop-card');
    const media = ui.element('div', 'workshop-card-media');
    const badge = ui.element('span', 'mini-badge', member.status);
    const photo = ui.element('img');
    photo.src = member.portrait;
    photo.alt = ''; // Decorative artwork, not a real photograph.
    photo.loading = 'lazy';
    ui.append(media, badge, photo);

    const body = ui.element('div', 'workshop-card-copy');
    const heading = ui.element('h3', '', member.name);
    const role = ui.paragraph(member.shortTitle);
    const link = ui.element('a', 'text-link', 'Visit workshop ↗');
    link.href = `workshop.html?slug=${encodeURIComponent(member.slug)}`;
    ui.append(body, heading, role, ui.tags(member.skills, 4), link);
    ui.append(article, media, body);
    return article;
  }

  function renderDirectory() {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    const visible = members.filter(member => {
      const categoryMatches = currentFilter === 'all' || member.category.includes(currentFilter);
      const searchable = [member.name, member.shortTitle, member.intro, ...member.skills].join(' ').toLocaleLowerCase();
      return categoryMatches && searchable.includes(query);
    });
    list.replaceChildren(...visible.map(card));
    if (count) count.textContent = `${visible.length} ${visible.length === 1 ? 'workshop' : 'workshops'} found`;
    if (empty) empty.hidden = visible.length !== 0;
  }

  filterRoot?.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button || !filterRoot.contains(button)) return;
    currentFilter = button.dataset.filter;
    filterRoot.querySelectorAll('button[data-filter]').forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    renderDirectory();
  });
  search?.addEventListener('input', renderDirectory);
  document.querySelector('[data-workshop-reset]')?.addEventListener('click', () => {
    if (search) search.value = '';
    filterRoot?.querySelector('[data-filter="all"]')?.click();
    search?.focus();
  });

  function renderProfile(member) {
    const hero = ui.element('div', 'profile-hero');
    const picture = ui.element('div', 'profile-image');
    const photo = ui.element('img');
    photo.src = member.portrait;
    photo.alt = 'Decorative workshop illustration';
    picture.append(photo);
    const intro = ui.element('div', 'profile-intro');
    const eyebrow = ui.element('div', 'eyebrow', `WORKSHOP NO. ${member.number} / ${member.status.toUpperCase()}`);
    const h1 = ui.element('h1', '', member.name);
    const role = ui.element('p', 'profile-title', member.title);
    ui.append(intro, eyebrow, h1, role, ui.paragraph(member.intro), ui.tags(member.skills));
    ui.append(hero, picture, intro);

    const columns = ui.element('div', 'detail-columns');
    const biography = ui.element('section');
    ui.append(biography, ui.element('h2', '', 'Inside the workshop'));
    member.about.forEach(copy => biography.append(ui.paragraph(copy)));
    const sidebar = ui.element('aside', 'detail-box');
    const offers = ui.element('ul');
    member.offerings.forEach(item => offers.append(ui.element('li', '', item)));
    ui.append(sidebar, ui.element('h3', '', 'Areas of work'), offers, ui.paragraph(member.contactNote));
    ui.append(columns, biography, sidebar);

    const related = ui.element('section', 'profile-projects');
    related.append(ui.element('h2', '', 'Selected projects'));
    const grid = ui.element('div', 'project-grid');
    member.projectSlugs.forEach(slug => {
      const project = projects.find(item => item.slug === slug);
      if (!project) return; // Only link to project records that exist.
      const link = ui.element('a', 'project-card');
      link.href = `project.html?slug=${encodeURIComponent(project.slug)}`;
      const body = ui.element('div', 'project-card-copy');
      ui.append(
        body,
        ui.element('div', 'project-meta', project.phase),
        ui.element('h3', '', project.title),
        ui.paragraph(project.short),
        ui.tags(project.tags, 3),
        ui.element('span', 'text-link', 'Read project story ↗')
      );
      link.append(body);
      grid.append(link);
    });
    related.append(grid);
    detail.replaceChildren(hero, columns, related);
    document.title = `${member.name} · Workshop | Hearthstead`;
  }

  async function initialize() {
    try {
      // A profile also shows its related projects, so load both collections.
      [members, projects] = await Promise.all([
        ui.load('data/members.json'),
        ui.load('data/projects.json')
      ]);
      if (list) renderDirectory();
      if (detail) {
        const member = members.find(item => item.slug === ui.getSlug());
        if (member) renderProfile(member);
        else detail.replaceChildren(ui.element('p', 'loading-message', 'That workshop does not exist. Browse all workshops to find a place to start.'));
      }
    } catch (error) {
      console.error('Workshop data unavailable:', error);
      if (list) list.replaceChildren(ui.errorMessage());
      if (detail) detail.replaceChildren(ui.errorMessage());
      if (count) count.textContent = 'Unable to load workshops';
    }
  }
  initialize();
})();
