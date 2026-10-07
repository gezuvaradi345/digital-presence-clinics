const carousel = document.getElementById('carousel');
const cards = [...document.querySelectorAll('.concept-card')];
const dots = [...document.querySelectorAll('.concept-dots button')];
const previousButton = document.getElementById('prevConcept');
const nextButton = document.getElementById('nextConcept');
const currentNumber = document.getElementById('currentNumber');
const progressBar = document.getElementById('progressBar');
const stage = document.querySelector('.carousel-stage');

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('pageshow', () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));

let activeIndex = 0;
let rotationStep = 0;
let pointerStart = null;
let isDragging = false;

function renderCarousel() {
  carousel.style.setProperty('--rotation', `${rotationStep * -72}deg`);
  cards.forEach((card, index) => {
    const isActive = index === activeIndex;
    card.classList.toggle('is-active', isActive);
    card.setAttribute('aria-hidden', String(!isActive));
  });
  dots.forEach((dot, index) => {
    const isActive = index === activeIndex;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-selected', String(isActive));
  });
  currentNumber.textContent = String(activeIndex + 1).padStart(2, '0');
  progressBar.style.width = `${((activeIndex + 1) / cards.length) * 100}%`;
}

function move(direction) {
  closeAllMiniExperiences();
  rotationStep += direction;
  activeIndex = ((rotationStep % cards.length) + cards.length) % cards.length;
  renderCarousel();
}

function goTo(index) {
  closeAllMiniExperiences();
  const direct = index - activeIndex;
  const wrapped = direct > cards.length / 2 ? direct - cards.length : direct < -cards.length / 2 ? direct + cards.length : direct;
  rotationStep += wrapped;
  activeIndex = index;
  renderCarousel();
}

previousButton.addEventListener('click', () => move(-1));
nextButton.addEventListener('click', () => move(1));
dots.forEach((dot) => dot.addEventListener('click', () => goTo(Number(dot.dataset.slide))));

stage.addEventListener('pointerdown', (event) => {
  if (event.target.closest('button, a, .mini-layer, .experience-sheet')) return;
  pointerStart = event.clientX;
  isDragging = true;
  stage.setPointerCapture(event.pointerId);
});
stage.addEventListener('pointermove', (event) => {
  if (!isDragging || pointerStart === null) return;
  const movement = event.clientX - pointerStart;
  carousel.style.setProperty('--rotation', `${rotationStep * -72 + movement * 0.08}deg`);
});
stage.addEventListener('pointerup', (event) => {
  if (!isDragging || pointerStart === null) return;
  const movement = event.clientX - pointerStart;
  isDragging = false;
  pointerStart = null;
  if (Math.abs(movement) > 55) move(movement < 0 ? 1 : -1);
  else renderCarousel();
});
stage.addEventListener('pointercancel', () => {
  isDragging = false;
  pointerStart = null;
  renderCarousel();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') move(-1);
  if (event.key === 'ArrowRight') move(1);
});

renderCarousel();

/* Interactive webshop */
const products = {
  forma: {
    name: 'Váza Forma',
    label: 'HANDMADE OBJECT 01',
    price: 24900,
    description: 'Ručne tvarovaná keramická váza s prírodnou glazúrou. Každý kus je jedinečný.',
    theme: 'terracotta'
  },
  calma: {
    name: 'Lampa Calma',
    label: 'AMBIENT LIGHT 02',
    price: 39900,
    description: 'Stolová lampa s jemným rozptýleným svetlom, pevnou základňou a ručne tkaným ľanovým tienidlom.',
    theme: 'sand'
  },
  alba: {
    name: 'Šálka Alba',
    label: 'MORNING OBJECT 03',
    price: 8900,
    description: 'Porcelánová šálka s pohodlným úchopom a jemným matným povrchom. Navrhnutá pre ranné rituály.',
    theme: 'rose'
  }
};

const cart = new Map();
const productLayer = document.querySelector('[data-product-layer]');
const cartLayer = document.querySelector('[data-cart-layer]');
const productImage = document.querySelector('.mini-product-image');
const cartItems = document.querySelector('[data-cart-items]');
const cartEmpty = document.querySelector('[data-cart-empty]');
const cartTotal = document.querySelector('[data-cart-total]');
const cartCount = document.querySelector('[data-cart-count]');
const toast = document.querySelector('[data-shop-toast]');
let selectedProduct = 'forma';
let toastTimer;

function formatPrice(value) {
  return `${new Intl.NumberFormat('sk-SK').format(value)} Ft`;
}

function setLayer(layer, open) {
  layer.classList.toggle('open', open);
  layer.setAttribute('aria-hidden', String(!open));
}

function closeShopLayers() {
  setLayer(productLayer, false);
  setLayer(cartLayer, false);
}

function openProduct(productId) {
  selectedProduct = productId;
  const product = products[productId];
  document.querySelector('[data-product-label]').textContent = product.label;
  document.querySelector('[data-product-name]').textContent = product.name;
  document.querySelector('[data-product-description]').textContent = product.description;
  document.querySelector('[data-product-price]').textContent = formatPrice(product.price);
  productImage.dataset.theme = product.theme;
  setLayer(cartLayer, false);
  setLayer(productLayer, true);
}

function showToast(message = 'Produkt v košíku ✓') {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function renderCart() {
  const entries = [...cart.entries()];
  const totalQuantity = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const totalPrice = entries.reduce((sum, [id, quantity]) => sum + products[id].price * quantity, 0);
  cartCount.textContent = totalQuantity;
  cartTotal.textContent = formatPrice(totalPrice);
  cartEmpty.classList.toggle('hidden', entries.length > 0);
  cartItems.innerHTML = entries.map(([id, quantity]) => {
    const product = products[id];
    return `<div class="cart-item"><span class="cart-item__image cart-item__image--${product.theme}"></span><div><h4>${product.name}</h4><p>${formatPrice(product.price)}</p></div><div class="cart-item__controls"><button data-cart-change="${id}" data-delta="-1" aria-label="${product.name} znížiť množstvo">−</button><span>${quantity}</span><button data-cart-change="${id}" data-delta="1" aria-label="${product.name} zvýšiť množstvo">+</button></div></div>`;
  }).join('');
}

function addToCart(productId) {
  cart.set(productId, (cart.get(productId) || 0) + 1);
  renderCart();
  closeShopLayers();
  showToast();
}

document.querySelectorAll('[data-product]').forEach((button) => button.addEventListener('click', () => openProduct(button.dataset.product)));
document.querySelector('[data-add-product]').addEventListener('click', () => addToCart(selectedProduct));
document.querySelector('[data-cart-open]').addEventListener('click', () => {
  setLayer(productLayer, false);
  setLayer(cartLayer, true);
});
document.querySelectorAll('[data-mini-close]').forEach((button) => button.addEventListener('click', closeShopLayers));
document.querySelector('[data-shop-collection]').addEventListener('click', () => openProduct('forma'));
document.querySelector('[data-shop-new]').addEventListener('click', () => openProduct('calma'));
document.querySelector('[data-demo-checkout]').addEventListener('click', () => showToast(cart.size ? 'Ste v ukážkovej pokladni ✓' : 'Najprv vyberte produkt'));
cartItems.addEventListener('click', (event) => {
  const button = event.target.closest('[data-cart-change]');
  if (!button) return;
  const id = button.dataset.cartChange;
  const nextQuantity = (cart.get(id) || 0) + Number(button.dataset.delta);
  if (nextQuantity <= 0) cart.delete(id);
  else cart.set(id, nextQuantity);
  renderCart();
});

/* Other miniature websites */
function closeAllMiniExperiences() {
  closeShopLayers();
  document.querySelectorAll('[data-experience-sheet]').forEach((sheet) => {
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
  });
}

document.querySelectorAll('[data-experience-open]').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.concept-card');
    const sheet = card.querySelector(`[data-experience-sheet="${button.dataset.experienceOpen}"]`);
    if (!sheet) return;
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
  });
});
document.querySelectorAll('[data-experience-close]').forEach((button) => button.addEventListener('click', () => {
  const sheet = button.closest('[data-experience-sheet]');
  sheet.classList.remove('open');
  sheet.setAttribute('aria-hidden', 'true');
}));

let projectChoice = '';
document.querySelectorAll('[data-project-choice]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-project-choice]').forEach((option) => option.classList.remove('selected'));
  button.classList.add('selected');
  projectChoice = button.childNodes[0].textContent.trim();
}));
document.querySelector('[data-project-submit]').addEventListener('click', () => {
  document.querySelector('[data-sheet-feedback]').textContent = projectChoice ? `${projectChoice}: skvelý začiatok. Pokračujme v rozhovore!` : 'Najprv vyberte typ projektu.';
});

let bookingChoice = '';
document.querySelectorAll('[data-booking-choice]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-booking-choice]').forEach((option) => option.classList.remove('selected'));
  button.classList.add('selected');
  bookingChoice = button.dataset.bookingChoice;
}));
document.querySelector('[data-booking-submit]').addEventListener('click', () => {
  document.querySelector('[data-booking-feedback]').textContent = bookingChoice ? `${bookingChoice} : v ďalšom kroku by ste si vybrali termín.` : 'Najprv vyberte počet hostí.';
});
document.querySelector('[data-contact-demo]').addEventListener('click', () => {
  document.querySelector('[data-contact-feedback]').textContent = 'Toto je ukážkový kontaktný bod.';
});

renderCart();
