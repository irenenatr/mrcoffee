// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', function() {
          navLinks.classList.toggle('show');
          
          const icon = this.querySelector('i');
          if (navLinks.classList.contains('show')) {
              icon.classList.remove('fa-bars');
              icon.classList.add('fa-times');
          } else {
              icon.classList.remove('fa-times');
              icon.classList.add('fa-bars');
          }
      });
  }
  
  // Order data and DOM elements
  let orderData = {
      items: [
          {
              id: 1,
              name: 'Latte',
              price: 27000,
              quantity: 1,
              description: 'Rich espresso with steamed milk'
          },
          {
              id: 2,
              name: 'Chocolate',
              price: 40000,
              quantity: 2,
              description: 'Premium hot chocolate'
          }
      ],
      deliveryFee: 10000,
      discount: 10000
  };
  
  // DOM elements
  const orderForm = document.getElementById('orderForm');
  const orderTypeInputs = document.querySelectorAll('input[name="orderType"]');
  const addressGroup = document.getElementById('addressGroup');
  const addressInput = document.getElementById('address');
  const orderItemsContainer = document.getElementById('orderItems');
  const itemCountSpan = document.getElementById('itemCount');
  const deliveryFeeSpan = document.getElementById('deliveryFee');
  const discountSpan = document.getElementById('discount');
  const finalTotalSpan = document.getElementById('finalTotal');
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  const confirmationModal = document.getElementById('confirmationModal');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const closeModal = document.querySelector('.close');
  const modalOk = document.getElementById('trackOrderBtn');
  
  // Initialize the page
  function init() {
      renderOrderItems();
      updateTotals();
      setupEventListeners();
      loadSavedData();
  }
  
  // Setup event listeners
  function setupEventListeners() {
      // Order type change
      orderTypeInputs.forEach(input => {
          input.addEventListener('change', handleOrderTypeChange);
      });
      
      // Form submission
      orderForm.addEventListener('submit', handleFormSubmit);
      
      // Modal events
      closeModal.addEventListener('click', hideModal);
      modalOk.addEventListener('click', hideModal);
      
      // Close modal when clicking outside
      window.addEventListener('click', function(event) {
          if (event.target === confirmationModal) {
              hideModal();
          }
      });
      
      // Form validation
      const inputs = orderForm.querySelectorAll('input[required]');
      inputs.forEach(input => {
          input.addEventListener('blur', validateField);
          input.addEventListener('input', clearFieldError);
      });
  }
  
  // Handle order type change
  function handleOrderTypeChange(event) {
      const orderType = event.target.value;
      
      if (orderType === 'delivery') {
          addressGroup.style.display = 'block';
          addressInput.required = true;
          orderData.deliveryFee = 10000;
      } else {
          addressGroup.style.display = 'none';
          addressInput.required = false;
          orderData.deliveryFee = orderType === 'pickup' ? 0 : 0;
      }
      
      updateTotals();
      saveOrderData();
  }
  
  // Render order items
  function renderOrderItems() {
      orderItemsContainer.innerHTML = '';
      
      orderData.items.forEach(item => {
          const itemElement = createOrderItemElement(item);
          orderItemsContainer.appendChild(itemElement);
      });
      
      updateItemCount();
  }
  
  // Create order item element
  function createOrderItemElement(item) {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'order-item';
      itemDiv.innerHTML = `
          <div class="item-info">
              <div class="quantity-controls">
                  <button type="button" class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                  <span class="quantity">${item.quantity}</span>
                  <button type="button" class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
              </div>
              <div class="item-details">
                  <h4>${item.name}</h4>
                  <p>${item.description}</p>
              </div>
          </div>
          <div class="item-price">Rp ${formatPrice(item.price * item.quantity)}</div>
      `;
      return itemDiv;
  }
  
  // Update item quantity
  window.updateQuantity = function(itemId, change) {
      const item = orderData.items.find(item => item.id === itemId);
      if (item) {
          item.quantity = Math.max(0, item.quantity + change);
          
          if (item.quantity === 0) {
              orderData.items = orderData.items.filter(item => item.id !== itemId);
          }
          
          renderOrderItems();
          updateTotals();
          saveOrderData();
      }
  };
  
  // Update item count
  function updateItemCount() {
      const totalItems = orderData.items.reduce((sum, item) => sum + item.quantity, 0);
      itemCountSpan.textContent = totalItems;
  }
  
  // Update totals
  function updateTotals() {
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const total = subtotal + orderData.deliveryFee - orderData.discount;
      
      deliveryFeeSpan.textContent = `Rp ${formatPrice(orderData.deliveryFee)}`;
      discountSpan.textContent = `Rp ${formatPrice(orderData.discount)}`;
      finalTotalSpan.textContent = `Rp ${formatPrice(total)}`;
      
      // Update modal total
      const modalTotal = document.getElementById('modalTotal');
      if (modalTotal) {
          modalTotal.textContent = `Rp ${formatPrice(total)}`;
      }
  }
  
  // Format price
  function formatPrice(price) {
      return price.toLocaleString('id-ID');
  }
  
  // Form validation
  function validateField(event) {
      const field = event.target;
      const value = field.value.trim();
      
      clearFieldError(event);
      
      if (field.required && !value) {
          showFieldError(field, 'This field is required');
          return false;
      }
      
      if (field.type === 'email' && value && !isValidEmail(value)) {
          showFieldError(field, 'Please enter a valid email address');
          return false;
      }
      
      if (field.type === 'tel' && value && !isValidPhone(value)) {
          showFieldError(field, 'Please enter a valid phone number');
          return false;
      }
      
      return true;
  }
  
  // Show field error
  function showFieldError(field, message) {
      field.style.borderColor = '#f44336';
      
      let errorElement = field.parentNode.querySelector('.field-error');
      if (!errorElement) {
          errorElement = document.createElement('span');
          errorElement.className = 'field-error';
          errorElement.style.color = '#f44336';
          errorElement.style.fontSize = '0.8rem';
          errorElement.style.marginTop = '5px';
          field.parentNode.appendChild(errorElement);
      }
      errorElement.textContent = message;
  }
  
  // Clear field error
  function clearFieldError(event) {
      const field = event.target;
      field.style.borderColor = '#E0D4A3';
      
      const errorElement = field.parentNode.querySelector('.field-error');
      if (errorElement) {
          errorElement.remove();
      }
  }
  
  // Validate email
  function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  }
  
  // Validate phone
  function isValidPhone(phone) {
      const phoneRegex = /^[\+]?[0-9\s\-$$$$]{10,}$/;
      return phoneRegex.test(phone);
  }
  
  // Handle form submission
  function handleFormSubmit(event) {
      event.preventDefault();
      
      // Validate all required fields
      const requiredFields = orderForm.querySelectorAll('input[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
          if (!validateField({ target: field })) {
              isValid = false;
          }
      });
      
      if (!isValid) {
          showNotification('Please fill in all required fields correctly', 'error');
          return;
      }
      
      if (orderData.items.length === 0) {
          showNotification('Please add items to your order', 'error');
          return;
      }
      
      // Show loading
      showLoading();
      
      // Simulate API call
      setTimeout(() => {
          hideLoading();
          processOrder();
      }, 2000);
  }
  
  // Process order
  function processOrder() {
      const formData = new FormData(orderForm);
      const orderDetails = {
          orderType: formData.get('orderType'),
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          address: formData.get('address'),
          notes: formData.get('notes'),
          items: orderData.items,
          total: calculateTotal()
      };
      
      // Generate order ID
      const orderId = '#' + Math.random().toString(36).substr(2, 9).toUpperCase();
      document.getElementById('orderId').textContent = orderId;
      
      // Set estimated time based on order type
      const estimatedTimes = {
          dineIn: '10-15 minutes',
          delivery: '30-35 minutes',
          pickup: '20-25 minutes'
      };
      document.getElementById('estimatedTime').textContent = estimatedTimes[orderDetails.orderType];
      
      // Save order to localStorage
      saveCompletedOrder(orderId, orderDetails);
      
      // Show confirmation modal
      showModal();
      
      // Clear form and reset order
      resetOrder();
      
      // Show success notification
      showNotification('Order placed successfully!', 'success');
  }
  
  // Calculate total
  function calculateTotal() {
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return subtotal + orderData.deliveryFee - orderData.discount;
  }
  
  // Show/hide modal
  function showModal() {
      confirmationModal.style.display = 'block';
  }
  
  function hideModal() {
      confirmationModal.style.display = 'none';
  }
  
  // Show/hide loading
  function showLoading() {
      loadingOverlay.style.display = 'flex';
      placeOrderBtn.disabled = true;
  }
  
  function hideLoading() {
      loadingOverlay.style.display = 'none';
      placeOrderBtn.disabled = false;
  }
  
  // Show notification
  function showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 20px;
          border-radius: 10px;
          color: white;
          font-weight: 500;
          z-index: 10000;
          transform: translateX(100%);
          transition: transform 0.3s ease;
      `;
      
      switch (type) {
          case 'success':
              notification.style.backgroundColor = '#4CAF50';
              break;
          case 'error':
              notification.style.backgroundColor = '#f44336';
              break;
          default:
              notification.style.backgroundColor = '#2196F3';
      }
      
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => {
          notification.style.transform = 'translateX(0)';
      }, 100);
      
      setTimeout(() => {
          notification.style.transform = 'translateX(100%)';
          setTimeout(() => {
              notification.remove();
          }, 300);
      }, 3000);
  }
  
  // Reset order
  function resetOrder() {
      orderForm.reset();
      orderData.items = [];
      orderData.deliveryFee = 0;
      addressGroup.style.display = 'none';
      renderOrderItems();
      updateTotals();
      localStorage.removeItem('currentOrder');
  }
  
  // Save order data
  function saveOrderData() {
      localStorage.setItem('currentOrder', JSON.stringify(orderData));
  }
  
  // Load saved data
  function loadSavedData() {
      const savedOrder = localStorage.getItem('currentOrder');
      if (savedOrder) {
          orderData = { ...orderData, ...JSON.parse(savedOrder) };
          renderOrderItems();
          updateTotals();
      }
      
      // Load cart from menu page if available
      const cart = localStorage.getItem('coffeeCart');
      if (cart) {
          const cartItems = JSON.parse(cart);
          if (cartItems.length > 0) {
              orderData.items = cartItems.map((item, index) => ({
                  id: index + 1,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  description: `Delicious ${item.name.toLowerCase()}`
              }));
              renderOrderItems();
              updateTotals();
              saveOrderData();
          }
      }
  }
  
  // Save completed order
  function saveCompletedOrder(orderId, orderDetails) {
      const completedOrders = JSON.parse(localStorage.getItem('completedOrders') || '[]');
      completedOrders.push({
          id: orderId,
          date: new Date().toISOString(),
          ...orderDetails
      });
      localStorage.setItem('completedOrders', JSON.stringify(completedOrders));
  }
  
  // Add items to order (for external use)
  window.addToOrder = function(item) {
      const existingItem = orderData.items.find(orderItem => orderItem.name === item.name);
      
      if (existingItem) {
          existingItem.quantity += item.quantity || 1;
      } else {
          orderData.items.push({
              id: Date.now(),
              name: item.name,
              price: item.price,
              quantity: item.quantity || 1,
              description: item.description || `Delicious ${item.name.toLowerCase()}`
          });
      }
      
      renderOrderItems();
      updateTotals();
      saveOrderData();
  };
  
  // Initialize the page
  init();
  
  console.log('Order page loaded successfully!');
  console.log('Current order:', orderData);
});

// Add mobile menu styles
const style = document.createElement('style');
style.textContent = `
  .nav-links.show {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      background-color: white;
      padding: 20px;
      box-shadow: 0 5px 10px rgba(0,0,0,0.1);
      z-index: 99;
  }
  
  .field-error {
      display: block;
      margin-top: 5px;
  }
`;
document.head.appendChild(style);