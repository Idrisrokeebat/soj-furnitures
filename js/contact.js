// Set year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Form submission simulation
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const alertBox = document.getElementById('formAlert');

  if (!name || !email || !message) {
    alertBox.textContent = "⚠️ Please fill in all fields.";
    alertBox.className = "error";
    return;
  }

  // Simulate success
  alertBox.textContent = "✅ Thank you for reaching out! We’ll get back to you soon.";
  alertBox.className = "success";

  // Clear form after 2s
  setTimeout(() => {
    document.getElementById('contactForm').reset();
    alertBox.textContent = "";
  }, 2000);
});
