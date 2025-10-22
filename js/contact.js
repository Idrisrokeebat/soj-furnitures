document.addEventListener('DOMContentLoaded', () => {
  // Set year in footer (guard element)
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Form submission simulation - guard for pages without the form
  const contactForm = document.getElementById('contactForm');
  const alertBox = document.getElementById('formAlert');
  if (contactForm && alertBox) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        // show inline, non-blocking feedback suitable for mobile
        alertBox.textContent = "⚠️ Please fill in all fields.";
        alertBox.className = "error";
        return;
      }

      // Simulate success - keep short message for small screens
      alertBox.textContent = "✅ Thank you — we'll be in touch!";
      alertBox.className = "success";

      // Clear form after 2s
      setTimeout(() => {
        contactForm.reset();
        alertBox.textContent = "";
        alertBox.className = "";
      }, 2000);
    });
  }
});
