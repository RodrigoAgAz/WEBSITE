// Anna Healthcare AI - Main JavaScript File

// DOM Elements
const navbar = document.querySelector('.navbar');
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Demo Tab Functionality
const demoTabs = document.querySelectorAll('.demo-tab');
const demoScenarios = document.querySelectorAll('.demo-scenario');

demoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const demoType = tab.dataset.demo;
        
        // Update active tab
        demoTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding scenario
        demoScenarios.forEach(scenario => {
            scenario.classList.remove('active');
        });
        
        const activeScenario = document.getElementById(`${demoType}-demo`);
        if (activeScenario) {
            activeScenario.classList.add('active');
            
            // Animate chat messages
            const messages = activeScenario.querySelectorAll('.chat-message');
            messages.forEach((message, index) => {
                message.style.opacity = '0';
                message.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    message.style.transition = 'all 0.4s ease';
                    message.style.opacity = '1';
                    message.style.transform = 'translateY(0)';
                }, index * 300);
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add staggered animation to children
            const children = entry.target.querySelectorAll('.animate-child');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('visible');
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe elements with animation classes
document.querySelectorAll('.animate-fade-in, .animate-slide-left, .animate-slide-right').forEach(el => {
    observer.observe(el);
});

// Feature Cards Hover Effect
const featureCards = document.querySelectorAll('.feature-card, .use-case, .pilot-benefit');

featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Demo Preview Video Play Button
const demoPreview = document.querySelector('.demo-preview');
if (demoPreview) {
    demoPreview.addEventListener('click', () => {
        // In a real implementation, this would open a video modal
        alert('Video demo coming soon! For now, explore the interactive demos below.');
    });
}

// Process Timeline Animation
const processSteps = document.querySelectorAll('.process-step');
const processObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 200);
        }
    });
}, { threshold: 0.3 });

processSteps.forEach(step => {
    processObserver.observe(step);
});

// Active Navigation Highlighting
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize active section highlighting
highlightActiveSection();

// Add Chat Message Typing Effect
function typeMessage(element, text, callback) {
    let index = 0;
    element.textContent = '';
    
    const interval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
        } else {
            clearInterval(interval);
            if (callback) callback();
        }
    }, 20);
}

// Initialize first demo on page load
window.addEventListener('DOMContentLoaded', () => {
    const firstTab = document.querySelector('.demo-tab.active');
    if (firstTab) {
        firstTab.click();
    }
});

// Performance Optimization - Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-based functions
window.addEventListener('scroll', debounce(() => {
    // Navbar scroll effect
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 10));