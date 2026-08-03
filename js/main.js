document.addEventListener('DOMContentLoaded', () => {
  // Año en footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Carga dinámica de contenidos desde content.json
  loadContent();

  // Carga de Talleres
  loadWorkshops();
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

async function loadWorkshops() {
  const talleresList = document.getElementById('talleres-list');
  const galleryGrid = document.getElementById('gallery-grid');

  if (!talleresList && !galleryGrid) return;

  try {
    const res = await fetch('data/talleres.json');
    if (!res.ok) throw new Error('No se pudo cargar data/talleres.json');
    const talleres = await res.json();

    if (talleresList) {
      renderWorkshopsList(talleres, talleresList);
    }

    if (galleryGrid) {
      renderWorkshopGallery(talleres, galleryGrid);
    }
  } catch (err) {
    console.error('Error cargando talleres:', err);
  }
}

function renderWorkshopsList(talleres, container) {
  container.innerHTML = '';
  talleres.forEach(taller => {
    const card = document.createElement('article');
    card.className = 'card';
    card.style.cursor = 'pointer';
    card.onclick = (e) => {
      if (e.target.tagName !== 'A') {
        window.location.href = `talleres.html?id=${taller.id}`;
      }
    };

    // Image Container
    const imgDiv = document.createElement('div');
    imgDiv.style.height = '200px';
    imgDiv.style.borderRadius = '8px';
    imgDiv.style.overflow = 'hidden';
    imgDiv.style.marginBottom = '16px';

    // Cover Image
    const img = document.createElement('img');
    img.src = `${taller.folder}/${taller.cover}`;
    img.alt = taller.title;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.transition = 'transform 0.3s ease';
    imgDiv.appendChild(img);

    // Hover effect
    card.onmouseenter = () => img.style.transform = 'scale(1.05)';
    card.onmouseleave = () => img.style.transform = 'scale(1)';

    const h3 = document.createElement('h3');
    h3.textContent = taller.title;
    h3.style.marginBottom = '8px';

    const p = document.createElement('p');
    p.textContent = taller.description;
    p.style.marginBottom = '16px';

    const link = document.createElement('a');
    link.href = `talleres.html?id=${taller.id}`;
    link.textContent = 'Ver todas las fotos →';
    link.style.color = 'var(--primary)';
    link.style.textDecoration = 'none';
    link.style.fontWeight = '600';
    link.style.display = 'inline-block';

    card.append(imgDiv, h3, p, link);
    container.appendChild(card);
  });
}

function renderWorkshopGallery(talleres, container) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const taller = talleres.find(t => t.id === id);

  if (!taller) {
    const loadingEl = document.getElementById('gallery-loading');
    if (loadingEl) loadingEl.textContent = 'Taller no encontrado o ID inválido.';
    return;
  }

  setText('gallery-title', taller.title);
  setText('gallery-description', taller.description);
  setText('gallery-location', taller.location);

  const loadingEl = document.getElementById('gallery-loading');
  if (loadingEl) loadingEl.style.display = 'none';

  const contentEl = document.getElementById('gallery-content');
  if (contentEl) contentEl.style.display = 'block';

  container.innerHTML = '';
  taller.images.forEach(image => {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = `${taller.folder}/${image}`;
    img.alt = `${taller.title} - Foto`;
    img.loading = 'lazy';

    item.appendChild(img);
    container.appendChild(item);
  });
}
