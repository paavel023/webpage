// Enhanced Portfolio Script with Advanced Features
class PortfolioApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.notifications = [];
        this.chatMessages = [];
        this.isTyping = false;
        this.init();
        // Expose instance for debugging in devtools: window.portfolioApp
        try { window.portfolioApp = this; } catch (e) { /* ignore */ }
    }

                        init() {
        console.log('Initializing PortfolioApp');
        this.setupTheme();
        this.setupNavigation();
        this.setupAnimations();
        this.setupTypingEffect();
        this.setupParticles();
        this.setupNotifications();
        this.setupLiveChat();
        this.setupFormValidation();
        this.setupLazyLoading();
        this.setupKeyboardNavigation();
        this.setupAnalytics();
        this.setupPerformanceMonitoring();
        this.setupProjectFilters();
        this.setupProjectPreviews();
        this.setupBlogInteractions();
        this.setupTestimonialAnimations();
        console.log('PortfolioApp initialized');
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }



    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Active navigation highlighting
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) navLink.classList.add('active');
                }
            });
        });
    }

    setupAnimations() {
        // Initialize AOS
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });

        // Custom scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        // Skill bars animation
        this.setupSkillBars();
        
        // Stats animation
        this.setupStatsAnimation();
        
        // Timeline animation
        this.setupTimelineAnimation();
    }

    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar');
        console.log('Setting up skill bars:', skillBars.length);
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Skill bar intersecting:', entry.target);
                    const skillFill = entry.target.querySelector('.skill-fill');
                    const percentage = entry.target.querySelector('.skill-info span:last-child');
                    
                    if (skillFill && percentage) {
                        const targetWidth = percentage.textContent;
                        console.log('Animating skill bar to:', targetWidth);
                        skillFill.style.width = '0%';
                        
                        setTimeout(() => {
                            skillFill.style.width = targetWidth;
                        }, 200);
                    }
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => {
            skillObserver.observe(bar);
        });
    }

    setupStatsAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number[data-target]');
        console.log('Setting up stats animation:', statNumbers.length);
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Stat intersecting:', entry.target);
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const animate = () => {
                        current += increment;
                        if (current < target) {
                            entry.target.textContent = Math.floor(current);
                            requestAnimationFrame(animate);
                        } else {
                            entry.target.textContent = target;
                        }
                    };
                    
                    animate();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => {
            statsObserver.observe(stat);
        });
    }

    setupTimelineAnimation() {
        const timeline = document.querySelector('.timeline');
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        console.log('Setting up timeline animation:', timelineItems.length);
        
        if (!timeline || timelineItems.length === 0) return;
        
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Timeline intersecting');
                    // Add animation class to timeline
                    timeline.classList.add('animate');
                    
                    // Animate timeline items with delay
                    timelineItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 200); // 200ms delay between each item
                    });
                    
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        timelineObserver.observe(timeline);
    }

    setupTypingEffect() {
        const typingText = document.getElementById('typing-text');
        if (!typingText) return;

        const roles = [
            'Developer',
            'CEO',
            'Project Manager',
            'Security Expert',
            'eSports Director'
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeWriter = () => {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typingText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = 100;

            if (isDeleting) {
                typeSpeed /= 2;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before typing next
            }

            setTimeout(typeWriter, typeSpeed);
        };

        typeWriter();
    }

    setupParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        // Create particle system
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    setupNotifications() {
        // Create notification system
        this.showNotification = (message, type = 'info', duration = 5000) => {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                    <span>${message}</span>
                </div>
                <button class="notification-close">&times;</button>
            `;

            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => notification.classList.add('show'), 100);

            // Auto remove
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, duration);

            // Manual close
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            });
        };

        // Request notification permission
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    setupLiveChat() {
        // Create live chat widget
        const chatWidget = document.createElement('div');
        chatWidget.className = 'chat-widget';
        chatWidget.innerHTML = `
            <div class="chat-toggle">
                <i class="fas fa-comments"></i>
                <span class="chat-badge">1</span>
            </div>
            <div class="chat-container">
                <div class="chat-header">
                    <h3>Live Chat</h3>
                    <button class="chat-close">&times;</button>
                </div>
                <div class="chat-messages"></div>
                <div class="chat-input">
                    <input type="text" placeholder="Type your message..." />
                    <button class="chat-send">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(chatWidget);

        // Chat functionality
        const chatToggle = chatWidget.querySelector('.chat-toggle');
        const chatContainer = chatWidget.querySelector('.chat-container');
        const chatInput = chatWidget.querySelector('.chat-input input');
        const chatSend = chatWidget.querySelector('.chat-send');
        const chatMessages = chatWidget.querySelector('.chat-messages');

        chatToggle.addEventListener('click', () => {
            chatContainer.classList.toggle('active');
        });

        // Add event listener for chat close button
        const chatClose = chatWidget.querySelector('.chat-close');
        chatClose.addEventListener('click', () => {
            chatContainer.classList.remove('active');
        });

        chatSend.addEventListener('click', () => this.sendChatMessage(chatInput.value));
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage(chatInput.value);
            }
        });

        // Auto responses
        this.chatResponses = {
            // English
            'hello': 'Hi! How can I help you today?',
            'help': 'I can help you with project inquiries, collaboration opportunities, or technical questions.',
            'contact': 'You can reach me at contact@kachitodev.com or through the contact form.',
            'project': 'I have experience in FiveM development, game development, and security solutions. What specific area interests you?',
            // Spanish variants
            'hola': '¡Hola! ¿En qué puedo ayudarte?',
            'buenas': '¡Hola! ¿Cómo puedo ayudarte hoy?',
            'ayuda': 'Puedo ayudarte con consultas sobre proyectos, colaboraciones o preguntas técnicas.',
            'contacto': 'Puedes contactarme en contact@kachitodev.com o mediante el formulario de contacto.',
            'proyecto': 'Tengo experiencia en FiveM, desarrollo de juegos y soluciones de seguridad. ¿Qué área te interesa?'
        };
    }

    sendChatMessage(message) {
        // Make this async-friendly so we can call remote AI backends if configured
        (async () => {
            if (!message || !message.trim()) return;

            const input = document.querySelector('.chat-input input');

            // Add user message
            this.addChatMessage(message, 'user');
            if (input) input.value = '';

            // Show typing indicator while generating
            this.showTypingIndicator();

            try {
                const response = await this.getAutoResponse(message);
                // small randomized delay to emulate natural typing
                await new Promise(r => setTimeout(r, 400 + Math.random() * 1200));
                this.hideTypingIndicator();
                this.addChatMessage(response, 'bot');
            } catch (err) {
                this.hideTypingIndicator();
                console.error('AI response error:', err);
                this.addChatMessage("Lo siento, no puedo generar una respuesta ahora mismo.", 'bot');
            }
        })();
    }

    addChatMessage(message, sender) {
        const chatMessages = document.querySelector('.chat-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message chat-message-${sender}`;
        messageEl.textContent = message;
        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        // Persist in-memory chat history for context (limit size)
        try {
            if (!this.chatMessages) this.chatMessages = [];
            this.chatMessages.push({ sender, message, timestamp: Date.now() });
            if (this.chatMessages.length > 200) this.chatMessages.splice(0, this.chatMessages.length - 200);
        } catch (e) {
            console.warn('Failed to push chat message to history', e);
        }
    }

    showTypingIndicator() {
        const chatMessages = document.querySelector('.chat-messages');
        const typingEl = document.createElement('div');
        typingEl.className = 'chat-message chat-message-bot typing-indicator';
        typingEl.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Async auto-response generator. If window.AI_CONFIG.endpoint is set, it will try to POST to that
    // endpoint with { message, history } and expect { reply } in JSON. Otherwise it falls back to
    // a lightweight local natural-ish generator.
    async getAutoResponse(message) {
        const text = (message || '').toString();

        // If a remote AI endpoint is configured, call it (user must provide a safe backend).
        try {
            const cfg = window.AI_CONFIG || JSON.parse(localStorage.getItem('AI_CONFIG') || 'null');
            if (cfg && cfg.endpoint) {
                const payload = {
                    message: text,
                    history: this.chatMessages.slice(-12) // send recent context
                };

                const headers = { 'Content-Type': 'application/json' };
                if (cfg.key) headers['Authorization'] = `Bearer ${cfg.key}`;

                const resp = await fetch(cfg.endpoint, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                });

                if (resp.ok) {
                    const data = await resp.json();
                    if (data && data.reply) return data.reply;
                } else {
                    console.warn('AI endpoint returned', resp.status);
                }
            }
        } catch (e) {
            console.warn('Remote AI call failed, falling back to local generator', e);
        }

        // Local, template-based response generator for natural-feeling replies
        return this.localGenerateResponse(text);
    }

    localGenerateResponse(message) {
        const normalized = (message || '').toLowerCase();

        // Try keyword-based quick matches first
        for (const [key, response] of Object.entries(this.chatResponses)) {
            if (normalized.includes(key)) {
                // vary phrasing
                const variants = [response, `Sure — ${response}`, `${response} 😊`];
                return variants[Math.floor(Math.random() * variants.length)];
            }
        }

        // If message is a question (contains '?'), answer courteously
    const questionWords = ['how', 'what', 'why', 'when', 'where', 'can', 'do', 'does'];
    const questionWordsEs = ['cómo', 'como', 'qué', 'que', 'por qué', 'por que', 'cuando', 'dónde', 'donde', 'puedes', 'puedo', 'cómo estás', 'cómo estas'];
    const startsWithQuestion = questionWords.some(w => normalized.startsWith(w + ' ')) || questionWordsEs.some(w => normalized.startsWith(w + ' '));
    const isQuestion = message.trim().endsWith('?') || startsWithQuestion || questionWordsEs.some(w => normalized.includes(w));
        if (isQuestion) {
            const qResponses = [
                "Buena pregunta — puedo investigar eso y volver con una respuesta más precisa.",
                "Interesante — ¿puedes darme un poco más de contexto?",
                "Puedo ayudar con eso. ¿Quieres que te explique en detalle o con un resumen?"
            ];
            return qResponses[Math.floor(Math.random() * qResponses.length)];
        }

        // For short messages, be concise
        if (message.trim().length < 20) {
            const shortReplies = [
                "¡Perfecto! Cuéntame más.",
                "Entendido.",
                "Genial — ¿qué necesitas exactamente?"
            ];
            return shortReplies[Math.floor(Math.random() * shortReplies.length)];
        }

        // Default friendly fallback
        const fallbacks = [
            "Gracias por el mensaje — lo revisaré y te respondo pronto.",
            "¡Gracias! Si quieres, dame más detalles para poder ayudar mejor.",
            "Interesante. Puedo ayudar con eso: ¿te gustaría una guía paso a paso o un resumen rápido?"
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    setupFormValidation() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm(contactForm)) {
                this.submitForm(contactForm);
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.classList.add('error');
        const errorEl = document.createElement('div');
        errorEl.className = 'field-error';
        errorEl.textContent = message;
        field.parentNode.appendChild(errorEl);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorEl = field.parentNode.querySelector('.field-error');
        if (errorEl) {
            errorEl.remove();
        }
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key closes modals/chat
            if (e.key === 'Escape') {
                const chatContainer = document.querySelector('.chat-container');
                if (chatContainer && chatContainer.classList.contains('active')) {
                    chatContainer.classList.remove('active');
                }
            }

            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
        });
    }

    openSearch() {
        // Create search modal
        const searchModal = document.createElement('div');
        searchModal.className = 'search-modal';
        searchModal.innerHTML = `
            <div class="search-overlay"></div>
            <div class="search-container">
                <div class="search-header">
                    <input type="text" placeholder="Search projects, skills, or content..." class="search-input" />
                    <button class="search-close">&times;</button>
                </div>
                <div class="search-results"></div>
            </div>
        `;

        document.body.appendChild(searchModal);
        
        const searchInput = searchModal.querySelector('.search-input');
        const searchOverlay = searchModal.querySelector('.search-overlay');
        const searchClose = searchModal.querySelector('.search-close');

        searchInput.focus();

        const closeSearch = () => {
            searchModal.remove();
        };

        searchOverlay.addEventListener('click', closeSearch);
        searchClose.addEventListener('click', closeSearch);

        searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });
    }

    performSearch(query) {
        const resultsContainer = document.querySelector('.search-results');
        if (!query.trim()) {
            resultsContainer.innerHTML = '';
            return;
        }

        // Simple search implementation
        const searchableContent = [
            { title: 'Kyxel Security', type: 'project', url: 'projects/kyxel-security.html' },
            { title: 'Coimoi eSports', type: 'project', url: 'projects/coimoi-esports.html' },
            { title: 'FiveM Development', type: 'skill', section: 'experience' },
            { title: 'Game Development', type: 'skill', section: 'about' },
            { title: 'Security Solutions', type: 'skill', section: 'projects' }
        ];

        const results = searchableContent.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase())
        );

        resultsContainer.innerHTML = results.map(result => `
            <div class="search-result" onclick="window.location.href='${result.url || '#' + result.section}'">
                <i class="fas fa-${result.type === 'project' ? 'folder' : 'star'}"></i>
                <span>${result.title}</span>
                <small>${result.type}</small>
            </div>
        `).join('');
    }

    setupAnalytics() {
        // Simple analytics tracking
        this.trackEvent = (eventName, properties = {}) => {
            console.log('Analytics Event:', eventName, properties);
            // In a real implementation, this would send to Google Analytics or similar
        };

        // Track page views
        this.trackEvent('page_view', {
            page: window.location.pathname,
            title: document.title
        });

        // Track interactions
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button');
            if (target) {
                this.trackEvent('click', {
                    element: target.tagName,
                    text: target.textContent.trim(),
                    href: target.href || null
                });
            }
        });
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log('Performance Metric:', entry.name, entry.value);
                }
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        }

        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                console.log('Memory Usage:', {
                    used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
                    total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB'
                });
            }, 30000);
        }
    }

    setupProjectFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter projects
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    setupProjectPreviews() {
        const previewBtns = document.querySelectorAll('.project-preview');
        
        previewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const project = btn.getAttribute('data-project');
                this.showProjectPreview(project);
            });
        });
    }

    showProjectPreview(project) {
        const previews = {
            kyxel: {
                title: 'Kyxel Security Platform',
                video: 'https://www.youtube.com/embed/demo-kyxel',
                description: 'Comprehensive cybersecurity platform demonstration showing DDoS protection, threat detection, and real-time monitoring capabilities.'
            },
            coimoi: {
                title: 'Coimoi eSports Management',
                video: 'https://www.youtube.com/embed/demo-coimoi',
                description: 'Tournament management system and eSports platform showcasing team management, live streaming, and community features.'
            },
            fivem: {
                title: 'FiveM Roleplay Server',
                video: 'https://www.youtube.com/embed/demo-fivem',
                description: 'Custom roleplay server walkthrough featuring economy systems, job mechanics, and immersive gameplay features.'
            }
        };

        const preview = previews[project];
        if (!preview) return;

        const modal = document.createElement('div');
        modal.className = 'project-preview-modal';
        modal.innerHTML = `
            <div class="preview-overlay"></div>
            <div class="preview-container">
                <div class="preview-header">
                    <h3>${preview.title}</h3>
                    <button class="preview-close">&times;</button>
                </div>
                <div class="preview-content">
                    <div class="preview-video">
                        <iframe src="${preview.video}" frameborder="0" allowfullscreen></iframe>
                    </div>
                    <div class="preview-description">
                        <p>${preview.description}</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close functionality
        const closeBtn = modal.querySelector('.preview-close');
        const overlay = modal.querySelector('.preview-overlay');
        
        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }



    setupBlogInteractions() {
        const blogCards = document.querySelectorAll('.blog-card');
        
        blogCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on links
                if (e.target.closest('.blog-link')) return;
                
                // In a real implementation, this would navigate to the blog post
                this.showNotification('Blog post coming soon!', 'info');
            });
        });
    }

    setupTestimonialAnimations() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        testimonialCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.classList.add('animate-on-scroll');
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Export for global access
window.PortfolioApp = PortfolioApp; 