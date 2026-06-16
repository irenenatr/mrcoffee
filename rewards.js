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
    
    // User points system
    let userPoints = parseInt(localStorage.getItem('userPoints')) || 250;
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // DOM elements
    const joinBtn = document.getElementById('joinBtn');
    const modal = document.getElementById('notification-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalOk = document.getElementById('modal-ok');
    const closeModal = document.querySelector('.close');
    const pointsDisplay = document.getElementById('points-display');
    const userPointsSpan = document.getElementById('user-points');
    const redeemButtons = document.querySelectorAll('.redeem-btn');
    
    // Initialize points display
    function updatePointsDisplay() {
        if (userPointsSpan) {
            userPointsSpan.textContent = userPoints;
        }
        
        if (isLoggedIn && pointsDisplay) {
            pointsDisplay.style.display = 'block';
        }
        
        // Update redeem button states
        redeemButtons.forEach(button => {
            if (!button.disabled) {
                const requiredPoints = parseInt(button.closest('.reward-card-item').dataset.points);
                if (userPoints < requiredPoints) {
                    button.style.opacity = '0.5';
                    button.style.cursor = 'not-allowed';
                } else {
                    button.style.opacity = '1';
                    button.style.cursor = 'pointer';
                }
            }
        });
    }
    
    // Show modal function
    function showModal(title, message, type = 'success') {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        
        const icon = modal.querySelector('.modal-body i');
        if (type === 'success') {
            icon.className = 'fas fa-check-circle';
            icon.style.color = '#4CAF50';
        } else if (type === 'error') {
            icon.className = 'fas fa-exclamation-circle';
            icon.style.color = '#f44336';
        } else if (type === 'info') {
            icon.className = 'fas fa-info-circle';
            icon.style.color = '#2196F3';
        }
        
        modal.style.display = 'block';
    }
    
    // Hide modal function
    function hideModal() {
        modal.style.display = 'none';
    }
    
    // Join rewards program
    joinBtn.addEventListener('click', function() {
        if (!isLoggedIn) {
            isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userPoints', userPoints.toString());
            
            showModal(
                'Welcome to Our Rewards Program!',
                `Congratulations! You've successfully joined our loyalty program. You start with ${userPoints} bonus points!`,
                'success'
            );
            
            // Show points display after joining
            setTimeout(() => {
                updatePointsDisplay();
            }, 1000);
            
            // Update button text
            joinBtn.textContent = 'Already a Member';
            joinBtn.style.backgroundColor = '#4CAF50';
        } else {
            showModal(
                'Already a Member!',
                'You are already part of our rewards program. Keep earning points with every purchase!',
                'info'
            );
        }
    });
    
    // Redeem rewards
    redeemButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.disabled) return;
            
            const rewardName = this.dataset.reward;
            const requiredPoints = parseInt(this.closest('.reward-card-item').dataset.points);
            
            if (!isLoggedIn) {
                showModal(
                    'Join Required',
                    'Please join our rewards program first to redeem rewards!',
                    'info'
                );
                return;
            }
            
            if (requiredPoints === 0) {
                showModal(
                    'Special Reward',
                    `${rewardName} is automatically applied to your account!`,
                    'success'
                );
                return;
            }
            
            if (userPoints >= requiredPoints) {
                userPoints -= requiredPoints;
                localStorage.setItem('userPoints', userPoints.toString());
                
                showModal(
                    'Reward Redeemed!',
                    `Congratulations! You've successfully redeemed "${rewardName}". Your reward will be applied to your next visit.`,
                    'success'
                );
                
                updatePointsDisplay();
                
                // Add redeemed effect
                this.style.backgroundColor = '#4CAF50';
                this.textContent = 'Redeemed';
                this.disabled = true;
                
                // Add confetti effect
                createConfetti();
                
            } else {
                const pointsNeeded = requiredPoints - userPoints;
                showModal(
                    'Insufficient Points',
                    `You need ${pointsNeeded} more points to redeem this reward. Keep purchasing to earn more points!`,
                    'error'
                );
            }
        });
    });
    
    // Modal close events
    closeModal.addEventListener('click', hideModal);
    modalOk.addEventListener('click', hideModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            hideModal();
        }
    });
    
    // Confetti effect
    function createConfetti() {
        const colors = ['#FFE082', '#B45309', '#4A3520', '#D2B48C', '#4CAF50'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            // Animate confetti
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(720deg)`, opacity: 0 }
            ], {
                duration: 3000 + Math.random() * 2000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            animation.onfinish = () => {
                confetti.remove();
            };
        }
    }
    
    // Simulate earning points (for demo purposes)
    function earnPoints(amount) {
        if (isLoggedIn) {
            userPoints += amount;
            localStorage.setItem('userPoints', userPoints.toString());
            updatePointsDisplay();
            
            // Show points earned notification
            const notification = document.createElement('div');
            notification.style.position = 'fixed';
            notification.style.top = '120px';
            notification.style.right = '20px';
            notification.style.backgroundColor = '#4CAF50';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '25px';
            notification.style.zIndex = '1000';
            notification.style.transform = 'translateX(100%)';
            notification.style.transition = 'transform 0.3s ease';
            notification.textContent = `+${amount} points earned!`;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 2000);
        }
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
    
    // Observe reward cards
    const rewardCards = document.querySelectorAll('.reward-card-item');
    rewardCards.forEach(card => {
        observer.observe(card);
    });
    
    // Initialize the page
    updatePointsDisplay();
    
    // Update join button if already logged in
    if (isLoggedIn) {
        joinBtn.textContent = 'Already a Member';
        joinBtn.style.backgroundColor = '#4CAF50';
    }
    
    // Demo: Simulate earning points every 30 seconds (remove in production)
    setInterval(() => {
        if (isLoggedIn && Math.random() > 0.7) {
            earnPoints(Math.floor(Math.random() * 20) + 5);
        }
    }, 30000);
    
    // Add hover effects to reward cards
    rewardCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    console.log('Rewards page loaded successfully!');
    console.log(`User points: ${userPoints}`);
    console.log(`Logged in: ${isLoggedIn}`);
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
    
    .reward-card-item.animate {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);