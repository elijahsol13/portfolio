'use strict';

// The screenshot gallery only reads local, already anonymized demo images.
const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const preview = lightbox.querySelector('img');
  const close = lightbox.querySelector('.lightbox-close');
  let trigger = null;

  document.querySelectorAll('[data-full]').forEach((button) => {
    button.addEventListener('click', () => {
      trigger = button;
      const src = button.getAttribute('data-full');
      if (!/^assets\/(?:homeasy-0[1-3]-(?:feed|filters|detail)|crm-demo-0[1-3]-(?:board|order|calendar))\.png$/.test(src)) return;
      preview.src = src;
      preview.alt = button.getAttribute('data-alt') || 'Демонстрационный скриншот';
      lightbox.showModal();
      close.focus();
    });
  });

  function dismiss() {
    lightbox.close();
    trigger?.focus();
  }

  close.addEventListener('click', dismiss);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) dismiss();
  });
  lightbox.addEventListener('close', () => trigger?.focus());
}
