// Actualiza el año en el footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Manejo del formulario vía FormSubmit
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

if (form && statusEl) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    statusEl.textContent = 'Enviando...';
    statusEl.classList.remove('success', 'error');

    try {
      const res = await fetch('https://formsubmit.co/ajax/merlipsicologa@gmail.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });

      if (!res.ok) throw new Error('Error en el envío');

      statusEl.textContent = 'Gracias por tu mensaje. Te responderé a la brevedad.';
      statusEl.classList.add('success');
      form.reset();
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'No se pudo enviar. Escríbeme a merlipsicologa@gmail.com o vía WhatsApp.';
      statusEl.classList.add('error');
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}
