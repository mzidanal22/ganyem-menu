let cartItems = [];
let totalPrice = 0;

// Load cart items from localStorage when the page loads
function loadCart() {
  const storedCart = localStorage.getItem('cartItems');
  if (storedCart) {
    cartItems = JSON.parse(storedCart);
    cartItems.forEach(item => {
      totalPrice += item.price * item.quantity; // Calculate total price
    });
    updateCartUI();
  }
}

let cartCount = 0;

function addToCart(button) {
  const menuItem = button.parentElement;
  const itemName = menuItem.getAttribute('data-name');
  const itemPrice = parseInt(menuItem.getAttribute('data-price'));

  cartCount++;
  document.getElementById('cart-count').innerText = cartCount;

  alert(`${itemName} telah ditambahkan ke keranjang!`);
  const existingItem = cartItems.find(item => item.name === itemName);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ name: itemName, price: itemPrice, quantity: 1 });
  }

  totalPrice += itemPrice;

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateCartUI();
}

function updateCartUI() {
  const cartItemsList = document.getElementById('cart-items');
  cartItemsList.innerHTML = ''; // Clear existing items

  cartItems.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - Rp ${item.price} x ${item.quantity}`;
    
    const reduceButton = document.createElement('button');
    reduceButton.textContent = 'Kurangi';
    reduceButton.onclick = () => reduceItem(item.name);

    li.appendChild(reduceButton);
    cartItemsList.appendChild(li);
  });

  document.getElementById('total-price').textContent = `Total Harga: Rp ${totalPrice}`;
}

function reduceItem(itemName) {
  const existingItem = cartItems.find(item => item.name === itemName);
  if (existingItem) {
    if (existingItem.quantity > 1) {
      existingItem.quantity--;
      totalPrice -= existingItem.price; // Subtract the price of one item
    } else {
      removeItem(itemName); // If quantity is 1, remove the item
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Update localStorage
    updateCartUI(); // Update the UI
  }
}

function removeItem(itemName) {
  const itemIndex = cartItems.findIndex(item => item.name === itemName);
  if (itemIndex > -1) {
    totalPrice -= cartItems[itemIndex].price * cartItems[itemIndex].quantity; // Subtract total price of the item
    cartItems.splice(itemIndex, 1); // Remove item from cart
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Update localStorage
    updateCartUI(); // Update the UI
  }
}

function submitOrder(event) {
  event.preventDefault();
  // Handle order submission logic here
  alert('Pesanan telah dikirim!');
}

// New function to send order confirmation via WhatsApp
function sendWhatsApp() {
  const name = document.getElementById('name').value;
  const table = document.getElementById('table').value;
  const phone = document.getElementById('phone').value;
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  let orderDetails = `Pesanan dari ${name} (Tabel No: ${table}, Nomor HP: ${phone}):\n`;

  cartItems.forEach(item => {
    orderDetails += `${item.name} - Rp ${item.price} x ${item.quantity}\n`;
  });

  const totalPrice = document.getElementById('total-price').textContent;
  orderDetails += `Total Harga: ${totalPrice}\n`;

  const whatsappNumber = '6285770330546'; // Replace with the cashier's WhatsApp number
  const whatsappMessage = encodeURIComponent(orderDetails);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMessage}`;

  window.open(whatsappUrl, '_blank');
}

// Call loadCart when the page loads
window.onload = loadCart;