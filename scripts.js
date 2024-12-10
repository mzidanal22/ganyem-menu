// Initialize cart array and cart count
let cart = [];
let cartCount = 0;

// Function to add items to the cart
function addToCart(button) {
    // Get the menu item details from the button's parent element
    const menuItem = button.parentElement;
    const itemName = menuItem.getAttribute('data-name');
    const itemPrice = parseInt(menuItem.getAttribute('data-price'));

    // Create an item object
    const item = {
        name: itemName,
        price: itemPrice,
        quantity: 1 // Initialize quantity
    };

    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.name === itemName);
    if (existingItemIndex > -1) {
        // If it exists, increase the quantity
        cart[existingItemIndex].quantity++;
    } else {
        // If it doesn't exist, add it to the cart
        cart.push(item);
    }
    cartCount++;

    // Save the cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart count display
    updateCartCount();

    // Optionally, show an alert message
    showAlert(`${itemName} telah ditambahkan ke keranjang!`);
}

// Function to show alert messages
function showAlert(message) {
    const alertMessage = document.createElement('div');
    alertMessage.className = 'alert-message';
    alertMessage.innerText = message;
    document.body.appendChild(alertMessage);

    // Fade in the alert
    setTimeout(() => {
        alertMessage.style.opacity = 1;
    }, 10);

    // Fade out and remove the alert after 3 seconds
    setTimeout(() => {
        alertMessage.style.opacity = 0;
        setTimeout(() => {
            document.body.removeChild(alertMessage);
        }, 500);
    }, 3000);
}

// Function to load cart items
function loadCart() {
    // Retrieve cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsList = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    let totalPrice = 0;


    // Loop through the cart items and display them
    cartItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${item.name} - Rp ${item.price} x ${item.quantity} 
            <button onclick="increaseQuantity('${item.name}')">+</button>
            <button onclick="decreaseQuantity('${item.name}')">-</button>
        `;
        cartItemsList.appendChild(listItem);
        totalPrice += item.price * item.quantity; // Calculate total price
    });

    // Update total price display
    totalPriceElement.innerText = `Total Harga: Rp ${totalPrice}`;
}

// Function to increase item quantity
function increaseQuantity(itemName) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.name === itemName);
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity++;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

// Function to decrease item quantity
function decreaseQuantity(itemName) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.name === itemName);
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity--;
        if (cart[existingItemIndex].quantity === 0) {
            cart.splice(existingItemIndex, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

// Function to send order via WhatsApp
function sendWhatsApp() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const name = document.getElementById('name').value; // Get the name from the form
    const table = document.getElementById('table').value; // Get the table number from the form
    let message = `Atas nama ${name} di tabel ${table} dengan pesanan:\n`;

    // Loop through the cart items to create the message
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ${item.quantity} pcs\n`; // Add each item to the message
    });

    // Calculate total price
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    message += `Total harga: Rp ${totalPrice}`;

    const phone = '6285770330546'; // ganti nomor kasir
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Clear the cart after sending the order
    localStorage.removeItem('cart');
    
    // Redirect to index.html after a short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000); // Redirect after 2 seconds (2000 milliseconds)
}

// Function to update the cart count display
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
}

// Function to initialize cart count on page load
function initializeCartCount() {
    updateCartCount();
}

// Call initializeCartCount when the page loads
window.onload = function() {
    loadCart();
    initializeCartCount();
};
