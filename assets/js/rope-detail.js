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
const ropeCanvas = document.getElementById('ropeCanvas');
const ropeContext = ropeCanvas ? ropeCanvas.getContext('2d', { willReadFrequently: true }) : null;
const ropeName = document.getElementById('ropeName');
const ropePrice = document.getElementById('ropePrice');
const ropeColorName = document.getElementById('ropeColorName');
const ropePalette = document.getElementById('ropePalette');
const ropeAddButton = document.getElementById('ropeAddButton');
const ropeColorBackdrop = document.getElementById('ropeColorBackdrop');

let sourceImageData = null;
let currentColor = ropeColors[0];

function formatRopePrice(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
    if (max === gn) h = (bn - rn) / d + 2;
    if (max === bn) h = (rn - gn) / d + 4;
    h /= 6;
  }

  return { h, s, l };
}

function hueToRgb(p, q, t) {
  let tone = t;
  if (tone < 0) tone += 1;
  if (tone > 1) tone -= 1;
  if (tone < 1 / 6) return p + (q - p) * 6 * tone;
  if (tone < 1 / 2) return q;
  if (tone < 2 / 3) return p + (q - p) * (2 / 3 - tone) * 6;
  return p;
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const neutral = Math.round(l * 255);
    return { r: neutral, g: neutral, b: neutral };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, h) * 255),
    b: Math.round(hueToRgb(p, q, h - 1 / 3) * 255)
  };
}

function colorDistance(a, b) {
  return Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
}

function getAverageCornerColor(imageData) {
  const { data, width, height } = imageData;
  const sampleSize = Math.max(10, Math.floor(Math.min(width, height) * 0.035));
  const corners = [
    [0, 0],
    [width - sampleSize, 0],
    [0, height - sampleSize],
    [width - sampleSize, height - sampleSize]
  ];
  const total = { r: 0, g: 0, b: 0, count: 0 };

  corners.forEach(([startX, startY]) => {
    for (let y = startY; y < startY + sampleSize; y += 1) {
      for (let x = startX; x < startX + sampleSize; x += 1) {
        const index = (y * width + x) * 4;
        total.r += data[index];
        total.g += data[index + 1];
        total.b += data[index + 2];
        total.count += 1;
      }
    }
  });

  return {
    r: total.r / total.count,
    g: total.g / total.count,
    b: total.b / total.count
  };
}

function shouldRecolorPixel(pixel, background) {
  const hsl = rgbToHsl(pixel.r, pixel.g, pixel.b);
  const value = Math.max(pixel.r, pixel.g, pixel.b) / 255;
  const backgroundDistance = colorDistance(pixel, background);
  const isRedLabel = pixel.r > 120 && pixel.g < 95 && pixel.b < 85 && hsl.s > 0.35;
  const isDeepHardware = value < 0.16 && hsl.s < 0.28;
  const isBackground = backgroundDistance < 34 && hsl.s < 0.22;
  const isBrightMetal = hsl.s < 0.12 && value > 0.82 && backgroundDistance < 95;

  return pixel.a > 12 && !isBackground && !isRedLabel && !isDeepHardware && !isBrightMetal;
}

function recolorPixel(pixel, target) {
  const original = rgbToHsl(pixel.r, pixel.g, pixel.b);
  const targetHsl = rgbToHsl(target.r, target.g, target.b);
  const shadow = (original.l - 0.5) * 0.58;
  const lightness = clamp(targetHsl.l + shadow, 0.08, 0.94);
  const saturation = clamp(targetHsl.s * 0.92 + original.s * 0.1, 0.04, 0.96);

  return hslToRgb(targetHsl.h, saturation, lightness);
}

function renderRopePreview(color) {
  if (!sourceImageData || !ropeContext || !ropeCanvas) return;

  const target = hexToRgb(color.hex);
  const output = new ImageData(new Uint8ClampedArray(sourceImageData.data), sourceImageData.width, sourceImageData.height);
  const background = getAverageCornerColor(sourceImageData);

  for (let index = 0; index < output.data.length; index += 4) {
    const pixel = {
      r: output.data[index],
      g: output.data[index + 1],
      b: output.data[index + 2],
      a: output.data[index + 3]
    };

    if (shouldRecolorPixel(pixel, background)) {
      const next = recolorPixel(pixel, target);
      output.data[index] = next.r;
      output.data[index + 1] = next.g;
      output.data[index + 2] = next.b;
    }
  }

  ropeContext.putImageData(output, 0, 0);
  ropeCanvas.setAttribute('aria-label', `${product.name} ${color.name}`);
}

function setRopeColor(color) {
  currentColor = color;
  ropeColorName.textContent = `${color.name} ${color.hex}`;
  ropeColorBackdrop.style.setProperty('--selected-rope-color', color.hex);
  ropeAddButton.dataset.option = `${color.name} ${color.hex}`;

  document.querySelectorAll('.rope-choice').forEach((choice) => {
    choice.classList.toggle('is-selected', choice.dataset.colorName === color.name);
  });

  renderRopePreview(color);
}

function loadRopeImage() {
  if (!ropeCanvas || !ropeContext) return;

  const source = new Image();
  source.onload = () => {
    const maxRenderSize = 900;
    const scale = Math.min(1, maxRenderSize / Math.max(source.naturalWidth, source.naturalHeight));
    ropeCanvas.width = Math.round(source.naturalWidth * scale);
    ropeCanvas.height = Math.round(source.naturalHeight * scale);
    ropeContext.drawImage(source, 0, 0, ropeCanvas.width, ropeCanvas.height);
    sourceImageData = ropeContext.getImageData(0, 0, ropeCanvas.width, ropeCanvas.height);
    renderRopePreview(currentColor);
  };
  source.src = product.image;
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

  loadRopeImage();
}
