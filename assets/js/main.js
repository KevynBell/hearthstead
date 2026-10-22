/**
 * Hearthstead · Shared interactions (v0.1)
 *
 * Responsibilities:
 *  - Theme preference: follows the OS unless a visitor explicitly chooses.
 *  - Accessible mobile navigation.
 *  - Current year in the site footer.
 *
 * No frameworks, remote services, analytics, or tracking cookies are used.
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'hearthstead-theme';
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const themeLabel = document.querySelector('[data-theme-label]');
  const themeIcon = document.querySelector('[data-theme-icon]');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

  /** Resolve the effective theme (manual choice overrides OS preference). */
  function getTheme() {
    if (root.dataset.theme === 'dark' || root.dataset.theme === 'light') {
      return root.dataset.theme;
    }
    return systemTheme.matches ? 'dark' : 'light';
  }

  /** Show the action that clicking the button will take, not the current theme. */
  function renderThemeButton() {
    const dark = getTheme() === 'dark';
    const next = dark ? 'light' : 'dark';
    if (themeLabel) themeLabel.textContent = dark ? 'Light mode' : 'Dark mode';
    if (themeIcon) themeIcon.textContent = dark ? '☀' : '☾';
    if (themeButton) {
      themeButton.setAttribute('aria-label', `Switch to ${next} mode`);
      themeButton.title = `Switch to ${next} mode`;
    }
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = dark ? '#101E30' : '#F7F2E8';
  }

  themeButton?.addEventListener('click', () => {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    // Browsers with disabled storage still allow a working session toggle.
    try { localStorage.setItem(STORAGE_KEY, next); } catch (_) { /* Fine. */ }
    renderThemeButton();
  });
  systemTheme.addEventListener?.('change', renderThemeButton);
  renderThemeButton();

  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.getElementById('primary-navigation');

  /** One function controls both visual state and the ARIA expanded state. */
  function setMenuOpen(isOpen) {
    if (!menuButton || !nav) return;
    nav.classList.toggle('is-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  }

  menuButton?.addEventListener('click', () => {
    setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  nav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenuOpen(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) setMenuOpen(false);
  });

  document.querySelectorAll('[data-current-year]').forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });
})();
