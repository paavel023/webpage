// Advanced Analytics System
class Analytics {
    constructor() {
        this.events = [];
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        // Read optional endpoint from window config (set window.ANALYTICS_ENDPOINT = 'https://your.endpoint')
        this.analyticsEndpoint = (window.ANALYTICS_ENDPOINT || (window.ANALYTICS_CONFIG && window.ANALYTICS_CONFIG.endpoint)) || null;
        this._lastEndpointError = 0; // timestamp to rate-limit console warnings
        // Verbose logging flag (set window.ANALYTICS_VERBOSE = true to see logs)
        this.verbose = !!(window.ANALYTICS_VERBOSE || (window.ANALYTICS_CONFIG && window.ANALYTICS_CONFIG.verbose));
        this.init();
    }

    init() {
        this.trackPageView();
        this.setupEventListeners();
        this.trackPerformance();
        this.trackUserBehavior();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    trackEvent(eventName, properties = {}) {
        const event = {
            event: eventName,
            properties: {
                ...properties,
                timestamp: Date.now(),
                sessionId: this.sessionId,
                url: window.location.href,
                userAgent: navigator.userAgent,
                screenResolution: `${screen.width}x${screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`
            }
        };

        this.events.push(event);
        this.sendToAnalytics(event);

        // Log to console in development only if verbose is enabled
        if (this.verbose) {
            console.log('Analytics Event:', event);
        }
    }

    trackPageView() {
        this.trackEvent('page_view', {
            page: window.location.pathname,
            title: document.title,
            referrer: document.referrer
        });
    }

    trackPerformance() {
        // Track Core Web Vitals
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.trackEvent('performance_metric', {
                        metric: entry.name,
                        value: entry.value,
                        rating: this.getPerformanceRating(entry.name, entry.value)
                    });
                }
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        }

        // Track page load time
        window.addEventListener('load', () => {
            const loadTime = Date.now() - this.startTime;
            this.trackEvent('page_load_time', {
                loadTime: loadTime,
                rating: this.getPerformanceRating('load_time', loadTime)
            });
        });
    }

    getPerformanceRating(metric, value) {
        const thresholds = {
            'largest-contentful-paint': { good: 2500, poor: 4000 },
            'first-input': { good: 100, poor: 300 },
            'layout-shift': { good: 0.1, poor: 0.25 },
            'load_time': { good: 2000, poor: 4000 }
        };

        const threshold = thresholds[metric];
        if (!threshold) return 'unknown';

        if (value <= threshold.good) return 'good';
        if (value <= threshold.poor) return 'needs_improvement';
        return 'poor';
    }

    trackUserBehavior() {
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track every 25%
                    this.trackEvent('scroll_depth', { depth: maxScroll });
                }
            }
        });

        // Track time on page
        setInterval(() => {
            const timeOnPage = Date.now() - this.startTime;
            if (timeOnPage % 30000 === 0) { // Track every 30 seconds
                this.trackEvent('time_on_page', { seconds: Math.round(timeOnPage / 1000) });
            }
        }, 1000);

        // Track clicks
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button, .clickable');
            if (target) {
                this.trackEvent('click', {
                    element: target.tagName,
                    text: target.textContent?.trim() || '',
                    href: target.href || null,
                    className: target.className,
                    id: target.id
                });
            }
        });

        // Track form interactions
        document.addEventListener('submit', (e) => {
            this.trackEvent('form_submit', {
                formId: e.target.id,
                formAction: e.target.action
            });
        });

        // Track focus events
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.trackEvent('form_field_focus', {
                    fieldType: e.target.type,
                    fieldName: e.target.name,
                    formId: e.target.form?.id
                });
            }
        });
    }

    setupEventListeners() {
        // Track navigation
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.startsWith('javascript:')) {
                this.trackEvent('link_click', {
                    href: link.href,
                    text: link.textContent?.trim() || '',
                    isExternal: link.hostname !== window.location.hostname
                });
            }
        });

        // Track theme changes
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                setTimeout(() => {
                    const currentTheme = document.documentElement.getAttribute('data-theme');
                    this.trackEvent('theme_change', { theme: currentTheme });
                }, 100);
            });
        }

        // Track search usage
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                this.trackEvent('search_shortcut_used');
            }
        });
    }

    sendToAnalytics(event) {
        // In a real implementation, this would send to Google Analytics, Mixpanel, etc.
        // For now, we'll store in localStorage and log to console
        
        // Store events in localStorage (limited to last 100 events)
        const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        storedEvents.push(event);
        
        // Keep only last 100 events
        if (storedEvents.length > 100) {
            storedEvents.splice(0, storedEvents.length - 100);
        }
        
        localStorage.setItem('analytics_events', JSON.stringify(storedEvents));

        // Send to external analytics service (example)
        if (window.gtag) {
            window.gtag('event', event.event, event.properties);
        }

        // Send to custom endpoint (only if configured)
        if (this.analyticsEndpoint) {
            this.sendToCustomEndpoint(event);
        } else {
            // In development, warn once if no endpoint configured and hostname is localhost
            if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !this._warnedNoEndpoint) {
                console.warn('Analytics endpoint not configured. Set window.ANALYTICS_ENDPOINT to enable sending events.');
                this._warnedNoEndpoint = true;
            }
        }
    }

    async sendToCustomEndpoint(event) {
        // Ensure endpoint is set
        const endpoint = this.analyticsEndpoint;
        if (!endpoint) return;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event)
            });

            if (!response.ok) {
                const now = Date.now();
                // Rate-limit console warnings to once every 10s to avoid spam
                if (now - this._lastEndpointError > 10000) {
                    console.warn(`Analytics endpoint returned status ${response.status} ${response.statusText}`);
                    this._lastEndpointError = now;
                }
            }
        } catch (error) {
            // Only log network errors in development, rate-limited
            const now = Date.now();
            if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (now - this._lastEndpointError > 10000)) {
                console.error('Analytics endpoint error:', error);
                this._lastEndpointError = now;
            }
        }
    }

    // Get analytics summary
    getAnalyticsSummary() {
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        const summary = {
            totalEvents: events.length,
            sessionDuration: Date.now() - this.startTime,
            pageViews: events.filter(e => e.event === 'page_view').length,
            clicks: events.filter(e => e.event === 'click').length,
            scrollDepth: Math.max(...events.filter(e => e.event === 'scroll_depth').map(e => e.properties.depth) || [0])
        };
        
        return summary;
    }

    // Export analytics data
    exportAnalytics() {
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        const dataStr = JSON.stringify(events, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `analytics_${Date.now()}.json`;
        link.click();
    }
}

// Initialize analytics
const analytics = new Analytics();

// Export for global access
window.Analytics = Analytics;
window.analytics = analytics; 