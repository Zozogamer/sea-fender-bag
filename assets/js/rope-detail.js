const ropeProducts = {
  'cloud-strap': {
    name: 'Cloud Strap',
    price: 55,
    image: 'assets/images/cordes/cloud-strap.png'
  },
  'crepe-pocket-sling': {
    name: 'Crepe Pocket Sling',
    price: 55,
    image: 'assets/images/cordes/crepe-pocket-sling.png'
  },
  '10mm-rope': {
    name: '10mm Rope',
    price: 45,
    image: 'assets/images/cordes/10mm-rope.png'
  },
  'macrame-strap': {
    name: 'Macrame Strap',
    price: 75,
    image: 'assets/images/cordes/macrame-strap.png'
  },
  '8mm-rope': {
    name: '8.0mm Rope',
    price: 35,
    image: 'assets/images/cordes/8mm-rope.png'
  },
  '6mm-rope': {
    name: '6.0mm Rope',
    price: 29,
    image: 'assets/images/cordes/6mm-rope.png'
  },
  '8mm-braided-o-rope': {
    name: '8.0mm Braided O-Rope',
    price: 55,
    image: 'assets/images/cordes/8mm-braided-o-rope.png'
  },
  'bungee-strap': {
    name: 'Bungee Strap',
    price: 45,
    image: 'assets/images/cordes/bungee-strap.png'
  }
};

const ropeColors = [
  { name: 'Abysse', hex: '#073B4C' },
  { name: 'Port', hex: '#006D77' },
  { name: 'Lagon', hex: '#00A8D6' },
  { name: 'Écume', hex: '#4FDCC7' },
  { name: 'Sable', hex: '#F2E8CF' },
  { name: 'Corde', hex: '#F7C76C' },
  { name: 'Bouée', hex: '#FF8B18' },
  { name: 'Signal', hex: '#FF120E' },
  { name: 'Marine', hex: '#252A68' },
  { name: 'Chanvre', hex: '#8A6F4D' },
  { name: 'Gris pont', hex: '#C8C8C3' },
  { name: 'Voile', hex: '#F7F7F2' }
];

const params = new URLSearchParams(window.location.search);
const ropeId = params.get('id') || 'cloud-strap';
const product = ropeProducts[ropeId] || ropeProducts['cloud-strap'];

const ropeImage = document.getElementById('ropeImage');
const ropeName = document.getElementById('ropeName');
const ropePrice = document.getElementById('ropePrice');
const ropeColorName = document.getElementById('ropeColorName');
const ropePalette = document.getElementById('ropePalette');
const ropeAddButton = document.getElementById('ropeAddButton');
const ropeColorBackdrop = document.getElementById('ropeColorBackdrop');

function formatRopePrice(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
}

function setRopeColor(color) {
  ropeColorName.textContent = `${color.name} ${color.hex}`;
  ropeColorBackdrop.style.setProperty('--selected-rope-color', color.hex);
  ropeAddButton.dataset.option = `${color.name} ${color.hex}`;

  document.querySelectorAll('.rope-choice').forEach((choice) => {
    choice.classList.toggle('is-selected', choice.dataset.colorName === color.name);
  });
}

if (ropeImage && ropeName && ropePrice && ropePalette && ropeAddButton) {
  document.title = `${product.name} - Sea fender bag`;
  ropeImage.src = product.image;
  ropeImage.alt = product.name;
  ropeName.textContent = product.name;
  ropePrice.textContent = formatRopePrice(product.price);

  ropeAddButton.dataset.id = ropeId;
  ropeAddButton.dataset.name = product.name;
  ropeAddButton.dataset.category = 'Bout';
  ropeAddButton.dataset.price = String(product.price);
  ropeAddButton.dataset.image = product.image;
  ropeAddButton.textContent = `Ajouter au panier - ${formatRopePrice(product.price)}`;

  ropeColors.forEach((color, index) => {
    const button = document.createElement('button');
    button.className = 'rope-choice';
    button.type = 'button';
    button.dataset.colorName = color.name;
    button.style.setProperty('--tone', color.hex);
    button.innerHTML = `<span>${color.name}</span><small>${color.hex}</small>`;
    button.addEventListener('click', () => setRopeColor(color));
    ropePalette.appendChild(button);

    if (index === 0) setRopeColor(color);
  });
}
