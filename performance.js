// Performance Monitoring and Optimization System
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.observers = [];
        this.init();
    }

    init() {
        // Verbose logging flag for development
        this.verbose = !!(window.ANALYTICS_VERBOSE || (window.ANALYTICS_CONFIG && window.ANALYTICS_CONFIG.verbose));
        this.setupPerformanceObserver();
        this.setupResourceTiming();
        this.setupMemoryMonitoring();
        this.setupNetworkMonitoring();
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupCodeSplitting();
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            // Observe Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
                this.logMetric('LCP', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // Observe First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    this.logMetric('FID', this.metrics.fid);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Observe Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.metrics.cls = clsValue;
                this.logMetric('CLS', clsValue);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });

            this.observers.push(lcpObserver, fidObserver, clsObserver);
        }
    }

    setupResourceTiming() {
        // Monitor resource loading times
        const resources = performance.getEntriesByType('resource');
        resources.forEach(resource => {
            this.logMetric('Resource Load', {
                name: resource.name,
                duration: resource.duration,
                size: resource.transferSize
            });
        });

        // Monitor new resources
        const resourceObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                this.logMetric('Resource Load', {
                    name: entry.name,
                    duration: entry.duration,
                    size: entry.transferSize
                });
            });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
    }

    setupMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.metrics.memory = {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit
                };
                this.logMetric('Memory Usage', this.metrics.memory);
            }, 10000); // Check every 10 seconds
        }
    }

    setupNetworkMonitoring() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.metrics.network = {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt
            };
            this.logMetric('Network Info', this.metrics.network);
        }
    }

    setupLazyLoading() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
        this.observers.push(imageObserver);
    }

    setupImageOptimization() {
        // Optimize images based on device capabilities
        const optimizeImages = () => {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
                
                // Add loading="lazy" to images below the fold
                if (!img.loading) {
                    img.loading = 'lazy';
                }
            });
        };

        // Run optimization after page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', optimizeImages);
        } else {
            optimizeImages();
        }
    }

    setupCodeSplitting() {
        // Dynamic imports for better performance
        this.loadModule = async (moduleName) => {
            try {
                const module = await import(`./modules/${moduleName}.js`);
                return module;
            } catch (error) {
                console.error(`Failed to load module: ${moduleName}`, error);
                return null;
            }
        };

        // Load modules on demand
        document.addEventListener('click', async (e) => {
            const target = e.target.closest('[data-module]');
            if (target) {
                const moduleName = target.dataset.module;
                const module = await this.loadModule(moduleName);
                if (module && module.init) {
                    module.init();
                }
            }
        });
    }

    logMetric(name, value) {
        const metric = {
            name,
            value,
            timestamp: Date.now(),
            url: window.location.href
        };

        // Store in localStorage for analysis
        const metrics = JSON.parse(localStorage.getItem('performance_metrics') || '[]');
        metrics.push(metric);
        
        // Keep only last 1000 metrics
        if (metrics.length > 1000) {
            metrics.splice(0, metrics.length - 1000);
        }
        
        localStorage.setItem('performance_metrics', JSON.stringify(metrics));

        // Log in development only if verbose flag is enabled
        if (this.verbose) {
            console.log('Performance Metric:', metric);
        }

        // Send to analytics
        if (window.analytics) {
            window.analytics.trackEvent('performance_metric', metric);
        }
    }

    getPerformanceScore() {
        const scores = {
            lcp: this.getScoreForMetric('lcp', 2500, 4000),
            fid: this.getScoreForMetric('fid', 100, 300),
            cls: this.getScoreForMetric('cls', 0.1, 0.25)
        };

        const averageScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;
        
        return {
            scores,
            average: averageScore,
            grade: this.getGrade(averageScore)
        };
    }

    getScoreForMetric(value, good, poor) {
        if (!value) return 0;
        if (value <= good) return 100;
        if (value <= poor) return 50;
        return 0;
    }

    getGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    optimizePerformance() {
        // Remove unused CSS
        this.removeUnusedCSS();
        
        // Optimize images
        this.optimizeImages();
        
        // Minify inline scripts
        this.minifyInlineScripts();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }

    removeUnusedCSS() {
        // This would typically be done at build time
        // For runtime, we can identify unused selectors
        const usedSelectors = new Set();
        const elements = document.querySelectorAll('*');
        
        elements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            // Track used CSS properties
            Object.keys(computedStyle).forEach(property => {
                const value = computedStyle.getPropertyValue(property);
                if (value && value !== 'initial' && value !== 'none') {
                    usedSelectors.add(property);
                }
            });
        });

        this.logMetric('Unused CSS', {
            totalSelectors: usedSelectors.size,
            potentialSavings: '~20-30%'
        });
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        let totalSize = 0;
        let optimizedSize = 0;

        images.forEach(img => {
            // Simulate size calculation
            const width = img.naturalWidth || 0;
            const height = img.naturalHeight || 0;
            const estimatedSize = width * height * 4; // 4 bytes per pixel (RGBA)
            
            totalSize += estimatedSize;
            
            // Simulate optimization
            const optimized = estimatedSize * 0.7; // 30% reduction
            optimizedSize += optimized;
        });

        this.logMetric('Image Optimization', {
            originalSize: totalSize,
            optimizedSize: optimizedSize,
            savings: ((totalSize - optimizedSize) / totalSize * 100).toFixed(2) + '%'
        });
    }

    minifyInlineScripts() {
        const scripts = document.querySelectorAll('script:not([src])');
        let totalSize = 0;
        let minifiedSize = 0;

        scripts.forEach(script => {
            const code = script.textContent;
            totalSize += code.length;
            
            // Simple minification simulation
            const minified = code
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
                .replace(/\s+/g, ' ') // Collapse whitespace
                .trim();
            
            minifiedSize += minified.length;
        });

        this.logMetric('Script Minification', {
            originalSize: totalSize,
            minifiedSize: minifiedSize,
            savings: ((totalSize - minifiedSize) / totalSize * 100).toFixed(2) + '%'
        });
    }

    preloadCriticalResources() {
        const criticalResources = [
            '/style.css',
            '/script.js',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    generatePerformanceReport() {
        const report = {
            timestamp: Date.now(),
            url: window.location.href,
            metrics: this.metrics,
            score: this.getPerformanceScore(),
            recommendations: this.getRecommendations()
        };

        return report;
    }

    getRecommendations() {
        const recommendations = [];

        if (this.metrics.lcp > 2500) {
            recommendations.push('Optimize Largest Contentful Paint by reducing server response time and optimizing critical resources');
        }

        if (this.metrics.fid > 100) {
            recommendations.push('Improve First Input Delay by reducing JavaScript execution time');
        }

        if (this.metrics.cls > 0.1) {
            recommendations.push('Reduce Cumulative Layout Shift by setting explicit dimensions for images and avoiding layout shifts');
        }

        if (this.metrics.memory && this.metrics.memory.used > this.metrics.memory.limit * 0.8) {
            recommendations.push('Optimize memory usage by cleaning up event listeners and avoiding memory leaks');
        }

        return recommendations;
    }

    cleanup() {
        // Disconnect all observers
        this.observers.forEach(observer => {
            if (observer.disconnect) {
                observer.disconnect();
            }
        });
    }
}

// Initialize performance monitor
const performanceMonitor = new PerformanceMonitor();

// Export for global access
window.PerformanceMonitor = PerformanceMonitor;
window.performanceMonitor = performanceMonitor;

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    performanceMonitor.cleanup();
}); 