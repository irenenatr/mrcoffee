document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', function() {
          navLinks.classList.toggle('show');
          
          // Change icon based on menu state
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
  
  // Category filtering
  const categoryTabs = document.querySelectorAll('.category-tab');
  const menuItems = document.querySelectorAll('.menu-item');
  
  categoryTabs.forEach(tab => {
      tab.addEventListener('click', function() {
          const category = this.getAttribute('data-category');
          
          // Remove active class from all tabs
          categoryTabs.forEach(t => t.classList.remove('active'));
          
          // Add active class to clicked tab
          this.classList.add('active');
          
          // Filter menu items
          filterMenuItems(category);
      });
  });
  
  function filterMenuItems(category) {
      menuItems.forEach((item, index) => {
          const itemCategory = item.getAttribute('data-category');
          
          if (itemCategory === category) {
              item.style.display = 'block';
              // Add staggered animation
              setTimeout(() => {
                  item.style.opacity = '1';
                  item.style.transform = 'translateY(0)';
              }, index * 100);
          } else {
              item.style.display = 'none';
              item.style.opacity = '0';
              item.style.transform = 'translateY(20px)';
          }
      });
  }
  
  // Shopping cart functionality
  let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cartNotification = document.getElementById('cart-notification');
  const notificationText = document.getElementById('notification-text');
  const closeNotification = document.getElementById('close-notification');
  
  // Add to cart event listeners
  addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
          const itemName = this.getAttribute('data-item');
          const itemPrice = parseInt(this.getAttribute('data-price'));
          
          // Add item to cart
          addToCart(itemName, itemPrice);
          
          // Show notification
          showCartNotification(`${itemName} added to cart!`);
          
          // Button animation
          this.style.transform = 'scale(0.8)';
          setTimeout(() => {
              this.style.transform = 'scale(1)';
          }, 150);
      });
  });
  
  function addToCart(name, price) {
      const existingItem = cart.find(item => item.name === name);
      
      if (existingItem) {
          existingItem.quantity += 1;
      } else {
          cart.push({
              name: name,
              price: price,
              quantity: 1
          });
      }
      
      // Save to localStorage
      localStorage.setItem('coffeeCart', JSON.stringify(cart));
      
      // Update cart count if there's a cart counter in the header
      updateCartCount();
  }
  
  function updateCartCount() {
      const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
      const cartCountElement = document.querySelector('.cart-count');
      
      if (cartCountElement) {
          cartCountElement.textContent = cartCount;
          
          if (cartCount > 0) {
              cartCountElement.style.display = 'block';
          }
      }
  }
  
  function showCartNotification(message) {
      notificationText.textContent = message;
      cartNotification.classList.add('show');
      
      // Auto hide after 3 seconds
      setTimeout(() => {
          cartNotification.classList.remove('show');
      }, 3000);
  }
  
  // Close notification manually
  closeNotification.addEventListener('click', function() {
      cartNotification.classList.remove('show');
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
              window.scrollTo({
                  top: targetElement.offsetTop - 80,
                  behavior: 'smooth'
              });
          }
      });
  });
  
  // Animation on scroll
  const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('animate');
          }
      });
  }, observerOptions);
  
  // Observe menu items for scroll animations
  menuItems.forEach(item => {
      observer.observe(item);
  });
  
  // Search functionality (if you want to add a search bar later)
  function searchMenu(query) {
      const searchTerm = query.toLowerCase();
      
      menuItems.forEach(item => {
          const itemName = item.querySelector('h3').textContent.toLowerCase();
          const itemDescription = item.querySelector('.description').textContent.toLowerCase();
          
          if (itemName.includes(searchTerm) || itemDescription.includes(searchTerm)) {
              item.style.display = 'block';
          } else {
              item.style.display = 'none';
          }
      });
  }
  
  // Price formatting function
  function formatPrice(price) {
      return `Rp ${price.toLocaleString('id-ID')}`;
  }
  
  updateCartCount();
  
  const coffeeItems = document.querySelectorAll('.coffee-item');
  
  coffeeItems.forEach((item, index) => {
      item.addEventListener('mouseenter', function() {
          this.style.animationPlayState = 'paused';
          this.style.transform = 'translateY(-15px) scale(1.1)';
      });
      
      item.addEventListener('mouseleave', function() {
          this.style.animationPlayState = 'running';
          this.style.transform = '';
      });
  });
  
  // Add loading effect for images
  const images = document.querySelectorAll('.item-image img');
  
  images.forEach(img => {
      img.addEventListener('load', function() {
          this.style.opacity = '1';
      });
      
      img.addEventListener('error', function() {
          this.src = 'https://via.placeholder.com/300x300/D2B48C/4A3520?text=Coffee';
      });
  });
  
  console.log('Menu page loaded successfully!');
  console.log(`Cart contains ${cart.length} unique items`);
});

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
  
  .menu-item.animate {
      opacity: 1 !important;
      transform: translateY(0) !important;
  }
  
  .item-image img {
      opacity: 0;
      transition: opacity 0.3s ease;
  }
  
  .cart-count {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: #B45309;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: none;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: bold;
  }
  
  .profile-icon {
      position: relative;
  }
`;
document.head.appendChild(style);