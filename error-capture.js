/**
 * Infrastructure Error Capture System
 * Professional error monitoring and reporting system
 * Version: 2.1.4
 * Last Updated: 2024-12-19
 */

class InfrastructureMonitor {
    constructor() {
        this.errorLog = [];
        this.systemMetrics = {};
        this.connectionAttempts = 0;
        this.maxRetries = 3;
        this.monitoringInterval = null;
        this.isCapturing = false;
    }

    // Initialize monitoring system
    async initialize() {
        console.log('[INFO] Initializing Infrastructure Monitor v2.1.4');
        console.log('[INFO] Connecting to monitoring endpoints...');
        
        try {
            await this.connectToMonitoringAPI();
            await this.initializeMetrics();
            this.startRealTimeMonitoring();
            console.log('[SUCCESS] Infrastructure Monitor initialized successfully');
        } catch (error) {
            console.error('[ERROR] Failed to initialize monitoring system:', error);
            throw error;
        }
    }

    // Simulate connection to monitoring API
    async connectToMonitoringAPI() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const success = Math.random() > 0.3; // 70% success rate
                if (success) {
                    console.log('[INFO] Connected to monitoring API');
                    resolve();
                } else {
                    reject(new Error('Monitoring API connection failed'));
                }
            }, 1000);
        });
    }

    // Initialize system metrics
    async initializeMetrics() {
        this.systemMetrics = {
            cpu: this.generateRandomMetric(85, 98),
            memory: this.generateRandomMetric(80, 95),
            disk: this.generateRandomMetric(60, 85),
            network: this.generateRandomMetric(90, 100),
            database: this.generateRandomMetric(0, 15), // Simulating DB failure
            responseTime: this.generateRandomMetric(12000, 20000),
            errorRate: this.generateRandomMetric(85, 100),
            uptime: this.generateRandomMetric(95, 99)
        };
    }

    // Generate realistic random metrics
    generateRandomMetric(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Start real-time monitoring
    startRealTimeMonitoring() {
        this.monitoringInterval = setInterval(() => {
            this.updateMetrics();
            this.checkSystemHealth();
        }, 5000);
    }

    // Update system metrics
    updateMetrics() {
        Object.keys(this.systemMetrics).forEach(key => {
            if (key === 'database') {
                // Simulate database issues
                this.systemMetrics[key] = this.generateRandomMetric(0, 20);
            } else if (key === 'responseTime') {
                // Simulate high response times
                this.systemMetrics[key] = this.generateRandomMetric(15000, 25000);
            } else {
                // Normal fluctuation
                const current = this.systemMetrics[key];
                const variation = Math.floor(Math.random() * 10) - 5;
                this.systemMetrics[key] = Math.max(0, Math.min(100, current + variation));
            }
        });
    }

    // Check system health and log issues
    checkSystemHealth() {
        const issues = [];
        
        if (this.systemMetrics.database < 20) {
            issues.push('Database connectivity critical');
        }
        if (this.systemMetrics.cpu > 90) {
            issues.push('CPU usage excessive');
        }
        if (this.systemMetrics.memory > 90) {
            issues.push('Memory usage critical');
        }
        if (this.systemMetrics.responseTime > 20000) {
            issues.push('Response time unacceptable');
        }

        if (issues.length > 0) {
            this.logError('SYSTEM_HEALTH_CHECK', issues.join(', '));
        }
    }

    // Capture error with detailed information
    async captureError(errorType, details = {}) {
        if (this.isCapturing) {
            console.warn('[WARN] Error capture already in progress');
            return;
        }

        this.isCapturing = true;
        console.log('[INFO] Starting error capture process...');

        try {
            const errorReport = {
                id: this.generateErrorId(),
                timestamp: new Date().toISOString(),
                type: errorType,
                details: details,
                systemMetrics: { ...this.systemMetrics },
                stackTrace: this.generateStackTrace(),
                environment: this.getEnvironmentInfo(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                sessionId: this.generateSessionId(),
                requestId: this.generateRequestId(),
                severity: this.calculateSeverity(errorType),
                impact: this.assessImpact(errorType),
                recommendations: this.generateRecommendations(errorType)
            };

            // Simulate API call to error reporting service
            await this.sendErrorReport(errorReport);
            
            // Store locally
            this.errorLog.push(errorReport);
            
            console.log('[SUCCESS] Error captured successfully:', errorReport.id);
            return errorReport;

        } catch (error) {
            console.error('[ERROR] Failed to capture error:', error);
            throw error;
        } finally {
            this.isCapturing = false;
        }
    }

    // Generate unique error ID
    generateErrorId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `ERR-${timestamp}-${random.toUpperCase()}`;
    }

    // Generate realistic stack trace
    generateStackTrace() {
        return [
            'at DatabaseConnection.connect() (db-connector.js:127)',
            'at QueryExecutor.execute() (query-executor.js:89)',
            'at RequestHandler.process() (request-handler.js:234)',
            'at Server.handleRequest() (server.js:156)',
            'at EventEmitter.emit() (events.js:315)',
            'at Server.emit() (net.js:673)'
        ];
    }

    // Get environment information
    getEnvironmentInfo() {
        return {
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: new Date().toISOString()
        };
    }

    // Generate session ID
    generateSessionId() {
        return 'sess-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // Generate request ID
    generateRequestId() {
        return 'req-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // Calculate error severity
    calculateSeverity(errorType) {
        const severityMap = {
            'DATABASE_CONNECTION': 'CRITICAL',
            'SYSTEM_HEALTH_CHECK': 'HIGH',
            'NETWORK_TIMEOUT': 'MEDIUM',
            'MEMORY_OVERFLOW': 'HIGH',
            'CPU_OVERLOAD': 'MEDIUM'
        };
        return severityMap[errorType] || 'LOW';
    }

    // Assess impact of error
    assessImpact(errorType) {
        const impactMap = {
            'DATABASE_CONNECTION': 'Service completely unavailable',
            'SYSTEM_HEALTH_CHECK': 'Degraded performance',
            'NETWORK_TIMEOUT': 'Slow response times',
            'MEMORY_OVERFLOW': 'System instability',
            'CPU_OVERLOAD': 'Reduced throughput'
        };
        return impactMap[errorType] || 'Minimal impact';
    }

    // Generate recommendations
    generateRecommendations(errorType) {
        const recommendations = {
            'DATABASE_CONNECTION': [
                'Check database server status',
                'Verify network connectivity',
                'Review connection pool settings',
                'Consider failover to secondary database'
            ],
            'SYSTEM_HEALTH_CHECK': [
                'Scale up server resources',
                'Optimize application code',
                'Implement caching strategies',
                'Review load balancing configuration'
            ]
        };
        return recommendations[errorType] || ['Monitor system closely', 'Check logs for additional errors'];
    }

    // Simulate sending error report to external service
    async sendErrorReport(errorReport) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const success = Math.random() > 0.1; // 90% success rate
                if (success) {
                    console.log('[INFO] Error report sent to monitoring service');
                    resolve();
                } else {
                    reject(new Error('Failed to send error report'));
                }
            }, 2000);
        });
    }

    // Log error internally
    logError(type, message) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type: type,
            message: message,
            metrics: { ...this.systemMetrics }
        };
        
        this.errorLog.push(logEntry);
        console.log(`[${type}] ${message}`);
    }

    // Get current system status
    getSystemStatus() {
        return {
            metrics: this.systemMetrics,
            errorCount: this.errorLog.length,
            uptime: this.calculateUptime(),
            health: this.calculateHealthScore()
        };
    }

    // Calculate system health score
    calculateHealthScore() {
        const weights = {
            database: 0.3,
            cpu: 0.2,
            memory: 0.2,
            responseTime: 0.15,
            network: 0.15
        };

        let score = 0;
        Object.keys(weights).forEach(metric => {
            if (metric === 'responseTime') {
                // Lower response time is better
                const normalized = Math.max(0, 100 - (this.systemMetrics[metric] / 100));
                score += normalized * weights[metric];
            } else if (metric === 'database') {
                // Higher database connectivity is better
                score += this.systemMetrics[metric] * weights[metric];
            } else {
                // Higher values are better for most metrics
                score += this.systemMetrics[metric] * weights[metric];
            }
        });

        return Math.round(score);
    }

    // Calculate uptime
    calculateUptime() {
        const startTime = new Date(Date.now() - Math.random() * 86400000); // Random start time within last 24h
        const uptime = Date.now() - startTime.getTime();
        return Math.floor(uptime / 1000);
    }

    // Generate comprehensive error report
    generateErrorReport() {
        const report = {
            summary: {
                totalErrors: this.errorLog.length,
                criticalErrors: this.errorLog.filter(e => e.severity === 'CRITICAL').length,
                systemHealth: this.calculateHealthScore(),
                uptime: this.calculateUptime()
            },
            metrics: this.systemMetrics,
            recentErrors: this.errorLog.slice(-10),
            recommendations: this.generateSystemRecommendations()
        };

        return report;
    }

    // Generate system-wide recommendations
    generateSystemRecommendations() {
        const recommendations = [];
        
        if (this.systemMetrics.database < 50) {
            recommendations.push('Immediate database connectivity investigation required');
        }
        if (this.systemMetrics.cpu > 85) {
            recommendations.push('Consider scaling up CPU resources');
        }
        if (this.systemMetrics.memory > 85) {
            recommendations.push('Memory optimization needed');
        }
        if (this.systemMetrics.responseTime > 15000) {
            recommendations.push('Performance optimization required');
        }

        return recommendations;
    }

    // Stop monitoring
    stop() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            console.log('[INFO] Infrastructure monitoring stopped');
        }
    }
}

// Global instance
const infrastructureMonitor = new InfrastructureMonitor();

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await infrastructureMonitor.initialize();
    } catch (error) {
        console.error('[ERROR] Failed to initialize infrastructure monitor:', error);
    }
});

// Global function for error capture
function captureError() {
    return infrastructureMonitor.captureError('DATABASE_CONNECTION', {
        connectionPool: 'exhausted',
        timeout: '15000ms',
        retries: 3,
        lastAttempt: new Date().toISOString()
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InfrastructureMonitor, infrastructureMonitor, captureError };
} 