const CART_KEY = 'sea-fender-cart';

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartCount();
}

function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
}

function getCartCount() {
  return readCart().reduce((total, item) => total + item.quantity, 0);
}

function updateCartCount() {
  const count = getCartCount();
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = count;
  });
}

function addFloatingCart() {
  if (document.querySelector('.cart-float')) return;

  const link = document.createElement('a');
  link.className = 'cart-float';
  link.href = 'panier.html';
  link.innerHTML = '<span>Panier</span><strong data-cart-count>0</strong>';
  document.body.appendChild(link);
}

function showCartToast(message) {
  let toast = document.querySelector('.cart-toast');
  if (!toast) {
    toast = document.createElement('p');
    toast.className = 'cart-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showCartToast.timer);
  showCartToast.timer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 1800);
}

function addToCart(product) {
  const items = readCart();
  const key = `${product.id}-${product.option || 'standard'}`;
  const existing = items.find((item) => item.key === key);

  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({ ...product, key, quantity: 1 });
  }

  writeCart(items);
  showCartToast(`${product.name} ajouté au panier`);
}

function getButtonProduct(button) {
  const preview = document.getElementById('bagColorPreview');
  const colorName = document.getElementById('bagColorName');
  const option = button.dataset.cartDynamic === 'color' && colorName ? colorName.textContent.trim() : button.dataset.option;

  return {
    id: button.dataset.id,
    name: button.dataset.name,
    category: button.dataset.category || 'Produit',
    price: Number(button.dataset.price || 0),
    option: option || '',
    image: preview ? preview.getAttribute('src') : button.dataset.image || ''
  };
}

function bindCartButtons() {
  document.querySelectorAll('.cart-add').forEach((button) => {
    button.addEventListener('click', () => addToCart(getButtonProduct(button)));
  });
}

function renderCartPage() {
  const list = document.getElementById('cartItems');
  const empty = document.getElementById('cartEmpty');
  const totalEl = document.getElementById('cartTotal');
  const clearButton = document.getElementById('cartClear');
  const checkout = document.getElementById('cartCheckout');
  if (!list || !empty || !totalEl) return;

  const items = readCart();
  list.innerHTML = '';
  empty.hidden = items.length > 0;

  items.forEach((item) => {
    const row = document.createElement('article');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${item.image}" alt="">
      <div>
        <span>${item.category}</span>
        <h2>${item.name}</h2>
        ${item.option ? `<p>${item.option}</p>` : ''}
      </div>
      <div class="cart-item__qty">
        <button type="button" data-cart-minus="${item.key}">-</button>
        <strong>${item.quantity}</strong>
        <button type="button" data-cart-plus="${item.key}">+</button>
      </div>
      <strong>${formatPrice(item.price * item.quantity)}</strong>
    `;
    list.appendChild(row);
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalEl.textContent = formatPrice(total);

  if (checkout) {
    const lines = items.map((item) => {
      const option = item.option ? ` - ${item.option}` : '';
      return `${item.quantity} x ${item.name}${option} : ${formatPrice(item.price * item.quantity)}`;
    });
    const body = [`Bonjour, je souhaite commander :`, '', ...lines, '', `Total : ${formatPrice(total)}`].join('\n');
    checkout.href = `mailto:hello@seabumpers.fr?subject=${encodeURIComponent('Commande Sea fender bag')}&body=${encodeURIComponent(body)}`;
  }

  list.querySelectorAll('[data-cart-minus]').forEach((button) => {
    button.addEventListener('click', () => {
      const next = readCart().map((item) => {
        if (item.key === button.dataset.cartMinus) item.quantity -= 1;
        return item;
      }).filter((item) => item.quantity > 0);
      writeCart(next);
      renderCartPage();
    });
  });

  list.querySelectorAll('[data-cart-plus]').forEach((button) => {
    button.addEventListener('click', () => {
      const next = readCart().map((item) => {
        if (item.key === button.dataset.cartPlus) item.quantity += 1;
        return item;
      });
      writeCart(next);
      renderCartPage();
    });
  });

  if (clearButton) {
    clearButton.onclick = () => {
      writeCart([]);
      renderCartPage();
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  addFloatingCart();
  bindCartButtons();
  renderCartPage();
  updateCartCount();
});
