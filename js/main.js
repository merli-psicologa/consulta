document.addEventListener('DOMContentLoaded', () => {
  // Año en footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Carga dinámica de contenidos desde content.json
  loadContent();

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
});

async function loadContent() {
  try {
    const res = await fetch('content.json');
    if (!res.ok) throw new Error('No se pudo cargar content.json');
    const data = await res.json();
    renderContent(data);
  } catch (err) {
    console.warn('Contenido por defecto (no se cargó content.json)', err);
  }
}

function renderContent(data) {
  setText('hero-eyebrow', data.hero?.eyebrow);
  setText('hero-title', data.hero?.title);
  setText('hero-lead', data.hero?.lead);
  renderList('hero-pills', data.hero?.pills, (item) => {
    const span = document.createElement('span');
    span.className = 'pill';
    span.textContent = item;
    return span;
  });
  setText('hero-cta-primary', data.hero?.ctaPrimary);
  setText('hero-cta-secondary', data.hero?.ctaSecondary);

  renderList('metrics', data.metrics, (item) => {
    const div = document.createElement('div');
    div.className = 'stat';
    const h = document.createElement('h3');
    h.textContent = item.value;
    const s = document.createElement('span');
    s.textContent = item.label;
    div.append(h, s);
    return div;
  });

  renderList('services-list', data.services, (item) => {
    const art = document.createElement('article');
    art.className = 'card';
    const h = document.createElement('h3');
    h.textContent = item.title;
    const p = document.createElement('p');
    p.textContent = item.desc;
    art.append(h, p);
    return art;
  });

  renderList('programs-list', data.programs, (item) => {
    const div = document.createElement('div');
    div.className = 'program';
    const strong = document.createElement('strong');
    strong.textContent = item.title;
    const p = document.createElement('p');
    p.textContent = item.desc;
    div.append(strong, p);
    return div;
  });

  setText('about-title', data.about?.title);
  const aboutContainer = document.getElementById('about-paragraphs');
  if (aboutContainer && Array.isArray(data.about?.paragraphs)) {
    aboutContainer.innerHTML = '';
    data.about.paragraphs.forEach((t) => {
      const p = document.createElement('p');
      p.textContent = t;
      aboutContainer.appendChild(p);
    });
  }
  setText('about-quote', data.about?.quote);

  renderList('testimonials-list', data.testimonials, (item) => {
    const div = document.createElement('div');
    div.className = 'testimonial';
    div.textContent = `“${item.text}”`;
    const span = document.createElement('span');
    span.textContent = item.author;
    div.appendChild(span);
    return div;
  });

  renderList('resources-list', data.resources, (item) => {
    const div = document.createElement('div');
    const h = document.createElement('h3');
    h.textContent = item.title;
    const p = document.createElement('p');
    p.textContent = item.desc;
    div.append(h, p);
    return div;
  });

  renderList('blog-list', data.blog, (item) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = item.tag;
    li.append(span, document.createTextNode(item.title));
    return li;
  });

  setText('cta-title', data.cta?.title);
  setText('cta-desc', data.cta?.desc);
  setText('cta-button', data.cta?.button);

  setText('contact-title', data.contact?.title);
  setText('contact-desc', data.contact?.desc);

  const emailEl = document.getElementById('contact-email');
  if (emailEl && data.contact?.email) {
    emailEl.textContent = data.contact.email;
    emailEl.href = `mailto:${data.contact.email}`;
  }

  const waEl = document.getElementById('contact-whatsapp');
  if (waEl && data.contact?.whatsapp && data.contact?.whatsappLink) {
    waEl.textContent = data.contact.whatsapp;
    waEl.href = data.contact.whatsappLink;
  }

  setText('contact-location', data.contact?.location);

  const igEl = document.getElementById('contact-instagram');
  if (igEl && data.contact?.instagram && data.contact?.instagramLink) {
    igEl.textContent = data.contact.instagram;
    igEl.href = data.contact.instagramLink;
  }
}

function renderList(containerId, items, renderItem) {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(items)) return;
  container.innerHTML = '';
  items.forEach((item) => {
    const node = renderItem(item);
    if (node) container.appendChild(node);
  });
}

function setText(id, text) {
  if (!text) return;
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
