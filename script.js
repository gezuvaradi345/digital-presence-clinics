const siteLanguage = document.documentElement.lang;
const uiCopy = {
  hu: { open: 'Menü megnyitása', close: 'Menü bezárása', required: 'Kérjük, töltse ki az összes mezőt.', sending: 'Küldés folyamatban...', success: 'Köszönjük, az üzenet megérkezett. Hamarosan jelentkezünk.', error: 'Most nem sikerült elküldeni. Kérjük, próbálja újra később, vagy írjon közvetlenül emailben.' },
  sk: { open: 'Otvoriť menu', close: 'Zavrieť menu', required: 'Vyplňte všetky polia.', sending: 'Odosiela sa...', success: 'Ďakujeme, vaša správa bola doručená. Čoskoro sa vám ozveme.', error: 'Správu sa nepodarilo odoslať. Skúste to neskôr alebo nám napíšte priamo e-mailom.' },
  en: { open: 'Open menu', close: 'Close menu', required: 'Please complete all fields.', sending: 'Sending...', success: 'Thank you, your message has been received. We will be in touch soon.', error: 'Your message could not be sent. Please try again later or email us directly.' }
}[siteLanguage] || { open: 'Open menu', close: 'Close menu' };

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const SUPABASE_URL = 'https://jzhcsuemxipzccbzdllr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aGNzdWVteGlwemNjYnpkbGxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyODMzMjEsImV4cCI6MjA5OTg1OTMyMX0.NDobZ2KkhrWUF1N2EmIRghNhROq24bymULAJ6WVuXDg';

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? uiCopy.open : uiCopy.close);
    nav.classList.toggle('open', !isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', uiCopy.open);
      nav.classList.remove('open');
    });
  });
}

const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');

const setContactStatus = (message, type = '') => {
  if (!contactStatus) return;
  contactStatus.textContent = message;
  contactStatus.classList.toggle('is-success', type === 'success');
  contactStatus.classList.toggle('is-error', type === 'error');
};

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      interest: String(formData.get('interest') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      source: 'vg-digital-solutions-website'
    };

    if (!payload.name || !payload.email || !payload.interest || !payload.message) {
      setContactStatus(uiCopy.required, 'error');
      return;
    }

    submitButton.disabled = true;
    setContactStatus(uiCopy.sending);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_requests`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Supabase response: ${response.status}`);
      }

      contactForm.reset();
      setContactStatus(uiCopy.success, 'success');
    } catch (error) {
      console.error(error);
      setContactStatus(uiCopy.error, 'error');
    } finally {
      submitButton.disabled = false;
    }
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.13, rootMargin: '0px 0px -25px' });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const heroMain = document.querySelector('.hero__main');
  if (heroMain) {
    heroMain.addEventListener('pointermove', (event) => {
      const bounds = heroMain.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      heroMain.style.setProperty('--field-x', `${Math.max(8, Math.min(92, x))}%`);
      heroMain.style.setProperty('--field-y', `${Math.max(8, Math.min(92, y))}%`);
    });

    heroMain.addEventListener('pointerleave', () => {
      heroMain.style.setProperty('--field-x', '72%');
      heroMain.style.setProperty('--field-y', '28%');
    });
  }

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty('--rx', `${-y * 2.8}deg`);
      card.style.setProperty('--ry', `${x * 2.8}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  document.querySelectorAll('.magnetic').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const bounds = button.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;
      button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px) translateY(-2px)`;
    });
    button.addEventListener('pointerleave', () => {
      button.style.transform = '';
    });
  });
}

const servicesTrigger = document.querySelector('.services-trigger');
const servicesMenu = document.querySelector('.services-menu');
if (servicesTrigger && servicesMenu) {
  const closeServices = (restoreFocus = false) => {
    servicesTrigger.setAttribute('aria-expanded', 'false');
    servicesMenu.hidden = true;
    if (restoreFocus) servicesTrigger.focus();
  };
  servicesTrigger.addEventListener('click', () => {
    const expanded = servicesTrigger.getAttribute('aria-expanded') === 'true';
    servicesTrigger.setAttribute('aria-expanded', String(!expanded));
    servicesMenu.hidden = expanded;
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.services-dropdown')) closeServices();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !servicesMenu.hidden) closeServices(true);
  });
  document.querySelector('.services-dropdown').addEventListener('focusout', (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) closeServices();
  });
  servicesMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeServices()));
  if (menuButton) menuButton.addEventListener('click', () => closeServices());
}

// Carry the selected service into the existing enquiry form.
const requestedService = new URLSearchParams(window.location.search).get('service');
if (contactForm && requestedService && /^[mo]-(web|social|ads|care|content|shop|landing|brand|audit)$/.test(requestedService)) {
  const [plan, serviceId] = requestedService.split('-');
  const selectedLink = document.querySelector(`.services-menu a[href="${plan === 'm' ? 'havi' : 'egyszeri'}-szolgaltatasok.html#${serviceId}"]`);
  if (selectedLink && ['m', 'o'].includes(plan)) {
    const select = contactForm.querySelector('select[name="interest"]');
    const label = `${selectedLink.closest('section').querySelector('h2').textContent} — ${selectedLink.textContent.replace('↗', '').trim()}`;
    select.add(new Option(label, label, true, true));
  }
}

const languagePicker = document.querySelector('.language-picker');
if (languagePicker) {
  const trigger = languagePicker.querySelector('.language-trigger');
  const options = languagePicker.querySelector('.language-options');
  const closeLanguagePicker = (restoreFocus = false) => {
    languagePicker.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    options.inert = true;
    if (restoreFocus) trigger.focus();
  };
  trigger.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') !== 'true';
    languagePicker.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', String(open));
    options.inert = !open;
    if (open && servicesTrigger && servicesMenu) {
      servicesTrigger.setAttribute('aria-expanded', 'false');
      servicesMenu.hidden = true;
    }
  });
  document.addEventListener('click', (event) => {
    if (!languagePicker.contains(event.target)) closeLanguagePicker();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && languagePicker.classList.contains('is-open')) closeLanguagePicker(true);
  });
  languagePicker.addEventListener('focusout', (event) => {
    if (!languagePicker.contains(event.relatedTarget)) closeLanguagePicker();
  });
}
