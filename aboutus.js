// Wait for the DOM to be fully loaded
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
    
    // Scroll animations
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
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.vision-card, .value-card, .team-member, .story-text, .story-image');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add animation classes
    const style = document.createElement('style');
    style.textContent = `
        .vision-card, .value-card, .team-member, .story-text, .story-image {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .vision-card.animate, .value-card.animate, .team-member.animate, .story-text.animate, .story-image.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .vision-card:nth-child(1), .value-card:nth-child(1), .team-member:nth-child(1) {
            transition-delay: 0.1s;
        }
        
        .vision-card:nth-child(2), .value-card:nth-child(2), .team-member:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .vision-card:nth-child(3), .value-card:nth-child(3), .team-member:nth-child(3) {
            transition-delay: 0.3s;
        }
        
        .value-card:nth-child(4) {
            transition-delay: 0.4s;
        }
        
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
    `;
    document.head.appendChild(style);
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    const coffeeItems = document.querySelectorAll('.coffee-item');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        if (heroSection && scrollPosition < heroSection.offsetHeight) {
            coffeeItems.forEach((item, index) => {
                const speed = 0.1 * (index + 1);
                item.style.transform = `translateY(${scrollPosition * speed}px)`;
            });
        }
    });
    
    // Interactive elements
    const visionCards = document.querySelectorAll('.vision-card');
    const valueCards = document.querySelectorAll('.value-card');
    const teamMembers = document.querySelectorAll('.team-member');
    
    // Add hover effects
    function addHoverEffects(elements) {
        elements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
    }
    
    addHoverEffects(visionCards);
    addHoverEffects(valueCards);
    
    // Team member hover effect
    teamMembers.forEach(member => {
        const image = member.querySelector('.member-image');
        
        member.addEventListener('mouseenter', function() {
            image.style.transform = 'translateY(-15px) scale(1.05)';
            image.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        });
        
        member.addEventListener('mouseleave', function() {
            image.style.transform = '';
            image.style.boxShadow = '';
        });
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
    
    // Add year to copyright
    const yearSpan = document.querySelector('.copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    console.log('About page loaded successfully!');
});