let cart = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    updateCartUI();
    setupEventListeners();
});

function setupEventListeners() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            addToCart(name, price);
        });
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
}

function loadCartFromStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        try {
            cart = JSON.parse(storedCart);
        } catch (e) {
            console.error('Error parsing cart from storage:', e);
            cart = [];
        }
    }
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    saveCartToStorage();
    showToast(`Added ${name} to cart`);
}

function updateCartUI() {
    updateCartCount();
    
    // Only update cart items if we are on the cart page
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is currently empty.</p>';
        updateTotals();
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <span class="price-info">₹${item.price.toFixed(2)}</span>
            </div>
            <div class="item-controls">
                <button class="qty-btn decrease" onclick="changeQuantity(${index}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="qty-btn increase" onclick="changeQuantity(${index}, 1)">+</button>
                <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
    
    updateTotals();
}

function updateTotals() {
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (!subtotalElement || !totalElement) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    subtotalElement.textContent = total.toFixed(2);
    totalElement.textContent = total.toFixed(2);
}

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        countElement.textContent = count;
        
        // Animate badge
        countElement.classList.add('bump');
        setTimeout(() => countElement.classList.remove('bump'), 300);
    }
}

function changeQuantity(index, delta) {
    if (index < 0 || index >= cart.length) return;
    
    cart[index].quantity += delta;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    saveCartToStorage();
    updateCartUI();
}

function removeFromCart(index) {
    if (index < 0 || index >= cart.length) return;
    
    const removedItem = cart[index];
    cart.splice(index, 1);
    
    saveCartToStorage();
    updateCartUI();
    showToast(`Removed ${removedItem.name} from cart`);
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Checkout successful! Total: ₹${total.toFixed(2)}`);
    
    cart = [];
    saveCartToStorage();
    updateCartUI();
}

function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger reflow
    toast.offsetHeight;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Make functions available globally for onclick handlers
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;

// Review Carousel Logic
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.review-slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        setInterval(nextSlide, slideInterval);
    }
});
