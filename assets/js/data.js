/**
 * Hearthstead · Small, safe utilities for JSON-backed pages.
 *
 * Fetching JSON requires a local HTTP server. See README.md for two
 * one-command options. Dynamic content is built with textContent rather
 * than injecting untrusted data into HTML markup.
 */
window.HearthsteadData = (() => {
  'use strict';

  async function load(path) {
    const response = await fetch(path, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Could not load ${path} (HTTP ${response.status})`);
    const items = await response.json();
    if (!Array.isArray(items)) throw new TypeError(`${path} must contain an array`);
    return items;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function append(parent, ...children) {
    parent.append(...children.filter(Boolean));
    return parent;
  }

  function tags(items, limit) {
    const wrapper = element('div', 'tag-list');
    (limit ? items.slice(0, limit) : items).forEach(tag => {
      wrapper.append(element('span', '', tag));
    });
    return wrapper;
  }

  function paragraph(text) { return element('p', '', text); }

  /**
   * User-facing errors include a server tip for people opening HTML via file://.
   * They never print raw exception text to the page.
   */
  function errorMessage() {
    return element('p', 'loading-message', 'Content could not load. Start the local web server (see README.md), then refresh this page.');
  }

  /** Read a URL slug without interpreting its value as markup. */
  function getSlug() {
    return new URLSearchParams(window.location.search).get('slug') || '';
  }

  return { load, element, append, tags, paragraph, errorMessage, getSlug };
})();
