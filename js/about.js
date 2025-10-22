document.addEventListener('DOMContentLoaded', () => {
  // Set year in footer (guard element in case script is loaded on pages without #year)
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Smooth scroll: only attach where anchor exists and the target is present.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      // ignore plain '#' links
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        // use start to support mobile browsers (keeps header visible)
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
