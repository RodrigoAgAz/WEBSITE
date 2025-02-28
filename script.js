// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Form validation for the demo request form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate required fields
            const requiredFields = contactForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                const errorElement = document.getElementById(`${field.id}-error`);
                
                // Check if field is empty
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'This field is required';
                    }
                } else {
                    field.classList.remove('error');
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                }
                
                // Email validation
                if (field.type === 'email' && field.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const isWorkEmail = /@gmail\.com$|@yahoo\.com$|@hotmail\.com$|@outlook\.com$|@aol\.com$/i.test(field.value) === false;
                    
                    if (!emailPattern.test(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                        if (errorElement) {
                            errorElement.textContent = 'Please enter a valid email address';
                        }
                    } else if (!isWorkEmail) {
                        isValid = false;
                        field.classList.add('error');
                        if (errorElement) {
                            errorElement.textContent = 'Please use your work email';
                        }
                    }
                }
            });
            
            // If form is valid, submit it (here we just show a success message)
            if (isValid) {
                // Replace form with success message
                contactForm.innerHTML = `
                    <div class="form-success">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>Thank You!</h3>
                        <p>Your demo request has been submitted successfully. A member of our team will contact you within 24 hours to schedule your personalized demo.</p>
                    </div>
                `;
                
                // You would typically send the form data to a server here
                // fetch('/api/submit-form', {
                //     method: 'POST',
                //     body: new FormData(contactForm)
                // })
            }
        });
    }
    
    // Interactive Chat Demo
    const chatOptions = document.querySelectorAll('.chat-option');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (chatOptions && chatMessages) {
        chatOptions.forEach(option => {
            option.addEventListener('click', function() {
                const response = this.getAttribute('data-response');
                
                // Add user message
                const userMessage = document.createElement('div');
                userMessage.className = 'chat-message user';
                userMessage.innerHTML = `
                    <div class="message-content">
                        <span class="message-text">${response}</span>
                    </div>
                    <div class="message-time">${getCurrentTime()}</div>
                `;
                chatMessages.appendChild(userMessage);
                
                // Remove options
                document.querySelector('.chat-options').style.display = 'none';
                
                // Wait and show Anna's response
                setTimeout(() => {
                    let annaResponse = "";
                    
                    // Different responses based on user selection
                    if (response.includes("Yes")) {
                        annaResponse = "Great! I have availability on Tuesday at 2 PM or Thursday at 10 AM. Which works better for you?";
                    } else if (response.includes("What's included")) {
                        annaResponse = "Your annual wellness visit includes a health risk assessment, review of medical history, and preventive screenings. It's covered 100% by your Medicare Advantage plan.";
                    } else {
                        annaResponse = "No problem! I'll check back with you next week. Remember, your annual wellness visit is fully covered by your plan and helps catch health issues early.";
                    }
                    
                    // Add Anna's response
                    const systemMessage = document.createElement('div');
                    systemMessage.className = 'chat-message system';
                    systemMessage.innerHTML = `
                        <div class="message-content">
                            <span class="message-text">${annaResponse}</span>
                        </div>
                        <div class="message-time">${getCurrentTime()}</div>
                    `;
                    chatMessages.appendChild(systemMessage);
                    
                    // Show more options for second level interaction
                    const newOptions = document.createElement('div');
                    newOptions.className = 'chat-options';
                    
                    if (response.includes("Yes")) {
                        newOptions.innerHTML = `
                            <button class="chat-option" data-response="Tuesday at 2 PM works for me.">Tuesday 2 PM</button>
                            <button class="chat-option" data-response="Thursday at 10 AM is better.">Thursday 10 AM</button>
                            <button class="chat-option" data-response="Neither works. Do you have other times?">Other times?</button>
                        `;
                    } else if (response.includes("What's included")) {
                        newOptions.innerHTML = `
                            <button class="chat-option" data-response="I'd like to schedule it now.">Schedule now</button>
                            <button class="chat-option" data-response="How long does it take?">How long?</button>
                            <button class="chat-option" data-response="I'll think about it, thanks.">I'll think about it</button>
                        `;
                    } else {
                        newOptions.innerHTML = `
                            <button class="chat-option" data-response="Actually, I'd like to schedule now.">Schedule now</button>
                            <button class="chat-option" data-response="Can you remind me about other preventive services?">Other services?</button>
                            <button class="chat-option" data-response="Thanks for the information.">Thanks</button>
                        `;
                    }
                    
                    chatMessages.appendChild(newOptions);
                    
                    // Scroll to bottom of chat
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // Add event listeners to new options
                    const newChatOptions = newOptions.querySelectorAll('.chat-option');
                    newChatOptions.forEach(option => {
                        option.addEventListener('click', function() {
                            const finalResponse = this.getAttribute('data-response');
                            
                            // Add user message
                            const finalUserMessage = document.createElement('div');
                            finalUserMessage.className = 'chat-message user';
                            finalUserMessage.innerHTML = `
                                <div class="message-content">
                                    <span class="message-text">${finalResponse}</span>
                                </div>
                                <div class="message-time">${getCurrentTime()}</div>
                            `;
                            chatMessages.appendChild(finalUserMessage);
                            
                            // Remove options
                            newOptions.style.display = 'none';
                            
                            // Show final message from Anna
                            setTimeout(() => {
                                const finalAnnaMessage = document.createElement('div');
                                finalAnnaMessage.className = 'chat-message system';
                                finalAnnaMessage.innerHTML = `
                                    <div class="message-content">
                                        <span class="message-text">Thanks for trying our interactive demo! In a real conversation, Anna would continue to assist you with your healthcare needs. Would you like to schedule a full product demo to see more?</span>
                                    </div>
                                    <div class="message-time">${getCurrentTime()}</div>
                                `;
                                chatMessages.appendChild(finalAnnaMessage);
                                
                                // Add demo CTA
                                const demoCta = document.createElement('div');
                                demoCta.className = 'chat-demo-cta';
                                demoCta.innerHTML = `
                                    <a href="#demo" class="chat-demo-button">Schedule Full Demo</a>
                                `;
                                chatMessages.appendChild(demoCta);
                                
                                // Scroll to bottom of chat
                                chatMessages.scrollTop = chatMessages.scrollHeight;
                            }, 1000);
                        });
                    });
                }, 1000);
            });
        });
    }
    
    // Scroll to sections smoothly when clicking on navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add fixed header on scroll
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('fixed');
            } else {
                header.classList.remove('fixed');
            }
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', 
                menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
    }
    
    // Helper function to get current time in HH:MM format
    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        
        return `${hours}:${minutes} ${ampm}`;
    }
    
    // Add fade-in animation for elements as they come into view
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if ('IntersectionObserver' in window) {
        const appearOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -100px 0px"
        };
        
        const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            });
        }, appearOptions);
        
        fadeElements.forEach(element => {
            appearOnScroll.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        fadeElements.forEach(element => {
            element.classList.add('appear');
        });
    }
});

// Add some CSS styling for the chat demo CTA and form success
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .chat-demo-cta {
            text-align: center;
            margin-top: 15px;
        }
        
        .chat-demo-button {
            display: inline-block;
            background-color: #1a73e8;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .chat-demo-button:hover {
            background-color: #0d47a1;
            transform: translateY(-2px);
        }
        
        .form-success {
            text-align: center;
            padding: 30px 20px;
        }
        
        .success-icon {
            font-size: 3rem;
            color: #2ecc71;
            margin-bottom: 20px;
        }
        
        .form-success h3 {
            font-size: 1.8rem;
            margin-bottom: 15px;
            color: #202124;
        }
        
        .form-success p {
            font-size: 1.1rem;
            color: #5f6368;
            line-height: 1.6;
        }
        
        input.error, textarea.error {
            border-color: #e74c3c !important;
        }
    </style>
`); 