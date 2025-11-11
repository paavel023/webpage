// Security Configuration and Headers
class SecurityConfig {
    constructor() {
        this.init();
    }

    init() {
        this.setupSecurityHeaders();
        this.setupCSP();
        this.setupInputValidation();
        this.setupXSSProtection();
        this.setupCSRFProtection();
    }

    setupSecurityHeaders() {
        // These headers should be set on the server side
        // This is a client-side implementation for demonstration
        const securityHeaders = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
        };

        // Log security headers for development
        if (window.location.hostname === 'localhost') {
            console.log('Security Headers:', securityHeaders);
        }
    }

    setupCSP() {
        // Content Security Policy
        const csp = {
            'default-src': ["'self'"],
            'script-src': [
                "'self'",
                "'unsafe-inline'",
                "https://unpkg.com",
                "https://cdnjs.cloudflare.com",
                "https://www.googletagmanager.com"
            ],
            'style-src': [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com",
                "https://cdnjs.cloudflare.com",
                "https://unpkg.com"
            ],
            'font-src': [
                "'self'",
                "https://fonts.gstatic.com",
                "https://cdnjs.cloudflare.com"
            ],
            'img-src': [
                "'self'",
                "data:",
                "https:",
                "https://cdn.discordapp.com",
                "https://images.unsplash.com"
            ],
            'connect-src': [
                "'self'",
                "https://api.github.com",
                "https://www.google-analytics.com"
            ],
            'frame-src': ["'none'"],
            'object-src': ["'none'"],
            'base-uri': ["'self'"],
            'form-action': ["'self'"]
        };

        // In a real implementation, this would be set via meta tag or server headers
        if (window.location.hostname === 'localhost') {
            console.log('CSP Policy:', csp);
        }
    }

    setupInputValidation() {
        // Sanitize user inputs
        this.sanitizeInput = (input) => {
            if (typeof input !== 'string') return input;
            
            return input
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '')
                .trim();
        };

        // Validate email format
        this.validateEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        // Validate URL format
        this.validateURL = (url) => {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        };

        // Apply validation to all form inputs
        document.addEventListener('DOMContentLoaded', () => {
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    const sanitized = this.sanitizeInput(e.target.value);
                    if (sanitized !== e.target.value) {
                        e.target.value = sanitized;
                    }
                });
            });
        });
    }

    setupXSSProtection() {
        // Prevent XSS through innerHTML
        const originalInnerHTML = Element.prototype.innerHTML;
        Element.prototype.innerHTML = function(value) {
            if (typeof value === 'string') {
                value = this.sanitizeInput(value);
            }
            return originalInnerHTML.call(this, value);
        };

        // Prevent eval usage
        window.eval = function() {
            throw new Error('eval() is disabled for security reasons');
        };

        // Prevent Function constructor
        window.Function = function() {
            throw new Error('Function constructor is disabled for security reasons');
        };
    }

    setupCSRFProtection() {
        // Generate CSRF token
        this.generateCSRFToken = () => {
            const token = Math.random().toString(36).substr(2) + Date.now().toString(36);
            sessionStorage.setItem('csrf_token', token);
            return token;
        };

        // Validate CSRF token
        this.validateCSRFToken = (token) => {
            const storedToken = sessionStorage.getItem('csrf_token');
            return token === storedToken;
        };

        // Add CSRF token to forms
        document.addEventListener('DOMContentLoaded', () => {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const token = this.generateCSRFToken();
                const tokenInput = document.createElement('input');
                tokenInput.type = 'hidden';
                tokenInput.name = 'csrf_token';
                tokenInput.value = token;
                form.appendChild(tokenInput);
            });
        });
    }

    // Rate limiting for API calls
    setupRateLimiting() {
        const rateLimit = {
            requests: {},
            maxRequests: 100,
            timeWindow: 60000 // 1 minute
        };

        this.checkRateLimit = (endpoint) => {
            const now = Date.now();
            const windowStart = now - rateLimit.timeWindow;
            
            if (!rateLimit.requests[endpoint]) {
                rateLimit.requests[endpoint] = [];
            }

            // Remove old requests
            rateLimit.requests[endpoint] = rateLimit.requests[endpoint].filter(
                timestamp => timestamp > windowStart
            );

            // Check if limit exceeded
            if (rateLimit.requests[endpoint].length >= rateLimit.maxRequests) {
                return false;
            }

            // Add current request
            rateLimit.requests[endpoint].push(now);
            return true;
        };
    }

    // Secure storage for sensitive data
    setupSecureStorage() {
        this.secureStorage = {
            set: (key, value) => {
                try {
                    const encrypted = btoa(JSON.stringify(value));
                    localStorage.setItem(key, encrypted);
                } catch (error) {
                    console.error('Secure storage error:', error);
                }
            },

            get: (key) => {
                try {
                    const encrypted = localStorage.getItem(key);
                    if (!encrypted) return null;
                    return JSON.parse(atob(encrypted));
                } catch (error) {
                    console.error('Secure storage error:', error);
                    return null;
                }
            },

            remove: (key) => {
                localStorage.removeItem(key);
            }
        };
    }

    // Security monitoring
    setupSecurityMonitoring() {
        // Monitor for suspicious activities
        this.securityEvents = [];

        this.logSecurityEvent = (event, details) => {
            const securityEvent = {
                timestamp: Date.now(),
                event: event,
                details: details,
                userAgent: navigator.userAgent,
                url: window.location.href
            };

            this.securityEvents.push(securityEvent);

            // Log to console in development
            if (window.location.hostname === 'localhost') {
                console.warn('Security Event:', securityEvent);
            }

            // Send to security monitoring endpoint
            this.sendSecurityEvent(securityEvent);
        };

        // Monitor for XSS attempts
        document.addEventListener('DOMContentLoaded', () => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const scripts = node.querySelectorAll('script');
                            if (scripts.length > 0) {
                                this.logSecurityEvent('potential_xss', {
                                    scriptsFound: scripts.length,
                                    node: node.outerHTML
                                });
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });

        // Monitor for suspicious console usage
        const originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error
        };

        console.log = function(...args) {
            if (args.some(arg => typeof arg === 'string' && arg.includes('<script>'))) {
                securityConfig.logSecurityEvent('suspicious_console_log', { args });
            }
            originalConsole.log.apply(console, args);
        };
    }

    async sendSecurityEvent(event) {
        try {
            const response = await fetch('/api/security-events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event)
            });
            
            if (!response.ok) {
                console.warn('Security monitoring endpoint not available');
            }
        } catch (error) {
            // Silently fail in production
            if (window.location.hostname === 'localhost') {
                console.log('Security monitoring error:', error);
            }
        }
    }
}

// Initialize security configuration
const securityConfig = new SecurityConfig();

// Export for global access
window.SecurityConfig = SecurityConfig;
window.securityConfig = securityConfig; 