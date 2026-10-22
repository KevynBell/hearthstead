/**
 * Hearthstead · Projects page, homepage preview, and project details.
 *
 * Data lives in data/projects.json so a project is authored once and reused.
 * Every project has a stable URL: project.html?slug=project-slug
 */
(() => {
  'use strict';
  const ui = window.HearthsteadData;
  const list = document.querySelector('[data-project-list]');
  const preview = document.querySelector('[data-projects-preview]');
  const detail = document.querySelector('[data-project-detail]');
  if (!list && !preview && !detail) return;

  const search = document.getElementById('project-search');
  const count = document.querySelector('[data-project-count]');
  const empty = document.querySelector('[data-project-empty]');
  const filterRoot = document.querySelector('[data-project-filters]');
  let projects = [];
  let currentFilter = 'all';

  function art(project) {
    const media = ui.element('div', 'project-card-art');
    // Artwork variants come from our own reviewed local JSON data.
    const allowed = new Set(['marpa', 'automation', 'website', 'village']);
    media.dataset.art = allowed.has(project.art) ? project.art : 'village';
    media.setAttribute('aria-hidden', 'true');
    media.append(ui.element('span', '', project.symbol));
    return media;
  }

  /** Shared card used on both the full directory and homepage preview. */
  function card(project) {
    const link = ui.element('a', 'project-card');
    link.href = `project.html?slug=${encodeURIComponent(project.slug)}`;
    const body = ui.element('div', 'project-card-copy');
    const meta = ui.element('div', 'project-meta');
    ui.append(meta, ui.element('span', '', project.phase), ui.element('span', '', '↗'));
    ui.append(body, meta, ui.element('h3', '', project.title), ui.paragraph(project.short), ui.tags(project.tags, 3), ui.element('span', 'text-link', 'See the story ↗'));
    ui.append(link, art(project), body);
    return link;
  }

  function renderDirectory() {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    const visible = projects.filter(project => {
      const typeMatches = currentFilter === 'all' || project.category.includes(currentFilter);
      const searchable = [project.title, project.subtitle, project.short, ...project.tags].join(' ').toLocaleLowerCase();
      return typeMatches && searchable.includes(query);
    });
    list.replaceChildren(...visible.map(card));
    if (count) count.textContent = `${visible.length} ${visible.length === 1 ? 'project' : 'projects'} found`;
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
  document.querySelector('[data-project-reset]')?.addEventListener('click', () => {
    if (search) search.value = '';
    filterRoot?.querySelector('[data-filter="all"]')?.click();
    search?.focus();
  });

  function renderDetail(project) {
    const hero = ui.element('div', 'project-detail-hero');
    const copy = ui.element('div');
    const heading = ui.element('h1', '', project.title);
    ui.append(copy, ui.element('div', 'eyebrow', project.phase.toUpperCase()), heading, ui.element('p', 'project-detail-subtitle', project.subtitle), ui.paragraph(project.short), ui.tags(project.tags));
    ui.append(hero, copy, art(project));

    const cols = ui.element('div', 'detail-columns');
    const narrative = ui.element('section');
    narrative.append(ui.element('h2', '', 'The story'));
    project.overview.forEach(text => narrative.append(ui.paragraph(text)));
    const aside = ui.element('aside', 'detail-box');
    const facts = ui.element('p');
    ui.append(facts, ui.element('strong', '', 'By '), document.createTextNode(project.owner));
    const bullets = ui.element('ul');
    project.highlights.forEach(highlight => bullets.append(ui.element('li', '', highlight)));
    ui.append(aside, ui.element('h3', '', 'At a glance'), facts, bullets);
    ui.append(cols, narrative, aside);
    detail.replaceChildren(hero, cols);
    document.title = `${project.title} · Project | Hearthstead`;
  }

  async function initialize() {
    try {
      projects = await ui.load('data/projects.json');
      if (list) renderDirectory();
      if (preview) preview.replaceChildren(...projects.slice(0, 2).map(card));
      if (detail) {
        const project = projects.find(item => item.slug === ui.getSlug());
        if (project) renderDetail(project);
        else detail.replaceChildren(ui.element('p', 'loading-message', 'That project does not exist. Browse all projects to keep exploring.'));
      }
    } catch (error) {
      console.error('Project data unavailable:', error);
      for (const target of [list, preview, detail]) {
        if (target) target.replaceChildren(ui.errorMessage());
      }
      if (count) count.textContent = 'Unable to load projects';
    }
  }
  initialize();
})();
