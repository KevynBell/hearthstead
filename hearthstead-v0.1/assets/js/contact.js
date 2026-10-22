/**
 * Hearthstead · Local-only contact draft builder.
 *
 * This is intentionally not a submission form: no back end exists yet.
 * Submitting validates the form and copies a formatted draft if the browser
 * allows clipboard access. The text never leaves the visitor's device.
 */
(() => {
  'use strict';
  const form = document.getElementById('inquiry-form');
  if (!form) return;
  const feedback = document.querySelector('[data-form-feedback]');

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const name = document.getElementById('inquiry-name').value.trim();
    const topic = document.getElementById('inquiry-topic').value;
    const message = document.getElementById('inquiry-message').value.trim();
    if (message.length < 10) {
      feedback.textContent = 'Please include at least 10 characters in your message.';
      return;
    }

    const draft = [
      'Hearthstead — inquiry draft',
      `Topic: ${topic}`,
      `From: ${name || '(not provided)'}`,
      '',
      message,
      '',
      '[Draft copied locally. No message has been sent.]'
    ].join('\n');

    try {
      await navigator.clipboard.writeText(draft);
      feedback.textContent = 'Draft copied! No message was sent. Paste it wherever you would like to keep it.';
    } catch (_) {
      // Clipboard APIs may be blocked by browser settings or insecure origins.
      feedback.textContent = 'Clipboard permission is unavailable. Select the prepared draft below and copy it manually.';
      let draftBox = document.getElementById('inquiry-fallback');
      if (!draftBox) {
        draftBox = document.createElement('textarea');
        draftBox.id = 'inquiry-fallback';
        draftBox.className = 'inquiry-fallback';
        draftBox.setAttribute('aria-label', 'Select and copy your inquiry draft');
        draftBox.readOnly = true;
        feedback.after(draftBox);
      }
      draftBox.value = draft;
      draftBox.focus();
      draftBox.select();
    }
  });
})();
