// Generate a random order number
function generateOrderNumber() {
    return 'ORD' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

// Initialize cart and order history
let cart = [];
let orderHistory = [];
let orderNumber = generateOrderNumber();

// Update order number display
document.getElementById('orderNumber').textContent = orderNumber;

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const item = {
            name: this.dataset.name,
            price: parseInt(this.dataset.price),
            img: this.dataset.img,
            quantity: 1
        };
        
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
        
        if (existingItemIndex !== -1) {
            // If item exists, increase quantity
            cart[existingItemIndex].quantity += 1;
        } else {
            // If item doesn't exist, add to cart
            cart.push(item);
        }
        
        updateCart();
    });
});

// Update cart display
function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const totalItems = document.getElementById('totalItems');
    const totalAmount = document.getElementById('totalAmount');
    
    // Clear cart items
    cartItems.innerHTML = '';
    
    // Add items to cart
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                </div>
            </div>
            <button class="remove-item" data-index="${index}">×</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Update totals
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    totalItems.textContent = totalQuantity;
    totalAmount.textContent = totalPrice;
    
    // Add quantity button functionality
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            if (this.classList.contains('increase')) {
                cart[index].quantity += 1;
            } else if (this.classList.contains('decrease')) {
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
            }
            updateCart();
        });
    });
    
    // Add remove functionality
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cart.splice(index, 1);
            updateCart();
        });
    });
}

// Place order functionality
document.getElementById('placeOrder').addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Store cart in localStorage for the delivery page
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Redirect to delivery page
    window.location.href = 'delivery.html';
});

// Update order history display
function updateOrderHistory() {
    const orderList = document.querySelector('.order-list');
    orderList.innerHTML = '';
    
    orderHistory.forEach((order, index) => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-item';
        orderElement.innerHTML = `
            <div class="order-header">
                <div class="order-header-left">
                    <div class="order-number">Order #${order.orderNumber}</div>
                    <button class="delete-order" data-index="${index}" title="Delete Order">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <div class="order-date">${order.date}</div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item-detail">
                        <img src="${item.img}" alt="${item.name}">
                        <div class="order-item-info">
                            <div class="order-item-name">${item.name}</div>
                            <div class="order-item-quantity">Quantity: ${item.quantity}</div>
                        </div>
                        <div class="order-item-price">₹${item.price * item.quantity}</div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">Total: ₹${order.totalAmount}</div>
        `;
        orderList.appendChild(orderElement);
    });

    // Add delete functionality
    document.querySelectorAll('.delete-order').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            showDeleteConfirmation(index);
        });
    });
}

// Create confirmation dialog
function createConfirmationDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    dialog.innerHTML = `
        <h3>Delete Order</h3>
        <p>Are you sure you want to delete this order? This action cannot be undone.</p>
        <div class="confirm-dialog-buttons">
            <button class="confirm-dialog-btn cancel">Cancel</button>
            <button class="confirm-dialog-btn delete">Delete</button>
        </div>
    `;
    document.body.appendChild(dialog);

    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    document.body.appendChild(overlay);

    return { dialog, overlay };
}

// Show delete confirmation dialog
function showDeleteConfirmation(orderIndex) {
    const { dialog, overlay } = createConfirmationDialog();
    
    // Show dialog and overlay
    dialog.classList.add('show');
    overlay.classList.add('show');

    // Handle cancel button
    dialog.querySelector('.cancel').addEventListener('click', () => {
        closeDialog();
    });

    // Handle delete button
    dialog.querySelector('.delete').addEventListener('click', () => {
        // Remove order from history
        orderHistory.splice(orderIndex, 1);
        // Update display
        updateOrderHistory();
        // Close dialog
        closeDialog();
    });

    // Handle overlay click
    overlay.addEventListener('click', () => {
        closeDialog();
    });

    function closeDialog() {
        dialog.classList.remove('show');
        overlay.classList.remove('show');
        setTimeout(() => {
            dialog.remove();
            overlay.remove();
        }, 300);
    }
} 