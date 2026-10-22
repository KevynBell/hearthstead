"""Dependency-free structural checks for the Hearthstead static prototype.

Run from the project root:
    python -m unittest discover -s tests -v

These are sanity checks; manual browser and accessibility QA are still required.
"""
from __future__ import annotations

import json
import re
import unittest
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    'index.html', 'about.html', 'workshops.html', 'workshop.html',
    'projects.html', 'project.html', 'contact.html',
]


class HearthsteadSmokeTests(unittest.TestCase):
    """Validate pages, content collections, and basic navigation integrity."""

    def test_expected_pages_exist(self):
        for name in PAGES:
            with self.subTest(page=name):
                self.assertTrue((ROOT / name).is_file())

    def test_html_pages_have_landmarks_and_scripts(self):
        for name in PAGES:
            with self.subTest(page=name):
                html = (ROOT / name).read_text(encoding='utf-8')
                self.assertIn('id="main"', html)
                self.assertIn('aria-label="Primary navigation"', html)
                self.assertIn('data-theme-toggle', html)
                self.assertIn('assets/js/main.js', html)
                self.assertIn('assets/css/styles.css', html)

    def test_local_page_and_asset_links_exist(self):
        # Only static href/src references in HTML; dynamic links are checked below.
        refs = re.compile(r'(?:href|src)="([^"]+)"')
        for name in PAGES:
            html = (ROOT / name).read_text(encoding='utf-8')
            for raw in refs.findall(html):
                if raw.startswith(('http:', 'https:', 'mailto:', 'tel:', '#')):
                    continue
                path = urlsplit(raw).path
                with self.subTest(page=name, target=path):
                    self.assertTrue((ROOT / path).exists(), f'Broken link {raw} in {name}')

    def test_member_schema_and_project_references(self):
        members = json.loads((ROOT / 'data/members.json').read_text(encoding='utf-8'))
        projects = json.loads((ROOT / 'data/projects.json').read_text(encoding='utf-8'))
        self.assertGreaterEqual(len(members), 1)
        self.assertGreaterEqual(len(projects), 1)
        project_slugs = {p['slug'] for p in projects}
        self.assertEqual(len(project_slugs), len(projects), 'Duplicate project slug')
        member_slugs = {m['slug'] for m in members}
        self.assertEqual(len(member_slugs), len(members), 'Duplicate member slug')
        for member in members:
            for field in ('name', 'status', 'intro', 'skills', 'offerings', 'category'):
                self.assertIn(field, member)
            for project in member['projectSlugs']:
                self.assertIn(project, project_slugs)
            self.assertTrue((ROOT / member['portrait']).exists())
        for project in projects:
            for field in ('title', 'phase', 'overview', 'highlights', 'category', 'tags'):
                self.assertIn(field, project)
            self.assertIn(project['art'], ('marpa', 'automation', 'website', 'village'))

    def test_theme_and_a11y_features_are_present(self):
        css = (ROOT / 'assets/css/styles.css').read_text(encoding='utf-8')
        js = (ROOT / 'assets/js/main.js').read_text(encoding='utf-8')
        self.assertIn('prefers-color-scheme: dark', css)
        self.assertIn("data-theme='dark'", css)
        self.assertIn('prefers-reduced-motion: reduce', css)
        self.assertIn('aria-expanded', js)
        self.assertIn('hearthstead-theme', js)


if __name__ == '__main__':
    unittest.main()
