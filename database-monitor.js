/**
 * Database Infrastructure Monitoring System
 * Professional database connection monitoring and health checks
 * Version: 3.2.1
 * Last Updated: 2024-12-19
 */

class DatabaseMonitor {
    constructor() {
        this.connections = {
            primary: { status: 'offline', latency: 0, lastCheck: null },
            secondary: { status: 'degraded', latency: 5000, lastCheck: null },
            replica1: { status: 'offline', latency: 0, lastCheck: null },
            replica2: { status: 'offline', latency: 0, lastCheck: null }
        };
        this.connectionPool = {
            maxConnections: 100,
            activeConnections: 0,
            availableConnections: 0,
            waitingConnections: 25
        };
        this.healthMetrics = {
            uptime: 0,
            totalQueries: 0,
            failedQueries: 0,
            averageResponseTime: 0,
            connectionErrors: 0
        };
        this.monitoringInterval = null;
        this.isMonitoring = false;
    }

    // Initialize database monitoring
    async initialize() {
        console.log('[DB-MONITOR] Initializing Database Monitor v3.2.1');
        console.log('[DB-MONITOR] Connecting to database clusters...');
        
        try {
            await this.connectToDatabases();
            this.startMonitoring();
            console.log('[DB-MONITOR] Database monitoring initialized successfully');
        } catch (error) {
            console.error('[DB-MONITOR] Failed to initialize database monitoring:', error);
            throw error;
        }
    }

    // Simulate connection to database clusters
    async connectToDatabases() {
        const databases = Object.keys(this.connections);
        
        for (const db of databases) {
            try {
                await this.testConnection(db);
            } catch (error) {
                console.error(`[DB-MONITOR] Failed to connect to ${db}:`, error.message);
            }
        }
    }

    // Test individual database connection
    async testConnection(dbName) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const success = Math.random() > 0.7; // 30% success rate for primary
                const latency = Math.random() * 10000 + 1000; // 1-11 seconds
                
                if (success) {
                    this.connections[dbName].status = 'online';
                    this.connections[dbName].latency = latency;
                    this.connections[dbName].lastCheck = new Date();
                    console.log(`[DB-MONITOR] ${dbName} connection successful (${latency.toFixed(0)}ms)`);
                    resolve();
                } else {
                    this.connections[dbName].status = 'offline';
                    this.connections[dbName].latency = 0;
                    this.connections[dbName].lastCheck = new Date();
                    reject(new Error(`${dbName} connection failed`));
                }
            }, 1000);
        });
    }

    // Start continuous monitoring
    startMonitoring() {
        this.isMonitoring = true;
        this.monitoringInterval = setInterval(() => {
            this.updateHealthMetrics();
            this.checkConnectionPool();
            this.logHealthStatus();
        }, 3000);
    }

    // Update health metrics
    updateHealthMetrics() {
        this.healthMetrics.uptime += 3;
        this.healthMetrics.totalQueries += Math.floor(Math.random() * 50) + 10;
        this.healthMetrics.failedQueries += Math.floor(Math.random() * 20) + 5;
        this.healthMetrics.averageResponseTime = this.calculateAverageResponseTime();
        this.healthMetrics.connectionErrors += Math.floor(Math.random() * 5) + 1;
    }

    // Calculate average response time
    calculateAverageResponseTime() {
        const onlineConnections = Object.values(this.connections)
            .filter(conn => conn.status === 'online' || conn.status === 'degraded');
        
        if (onlineConnections.length === 0) return 0;
        
        const totalLatency = onlineConnections.reduce((sum, conn) => sum + conn.latency, 0);
        return totalLatency / onlineConnections.length;
    }

    // Check connection pool status
    checkConnectionPool() {
        const totalConnections = this.connectionPool.activeConnections + this.connectionPool.availableConnections;
        const utilization = (totalConnections / this.connectionPool.maxConnections) * 100;
        
        if (utilization > 90) {
            console.warn('[DB-MONITOR] Connection pool utilization critical:', utilization.toFixed(1) + '%');
        }
        
        // Simulate connection pool dynamics
        this.connectionPool.activeConnections = Math.min(
            this.connectionPool.maxConnections,
            this.connectionPool.activeConnections + Math.floor(Math.random() * 10) - 5
        );
        
        this.connectionPool.availableConnections = Math.max(
            0,
            this.connectionPool.maxConnections - this.connectionPool.activeConnections
        );
    }

    // Log health status
    logHealthStatus() {
        const onlineCount = Object.values(this.connections)
            .filter(conn => conn.status === 'online').length;
        
        const errorRate = (this.healthMetrics.failedQueries / this.healthMetrics.totalQueries) * 100;
        
        if (onlineCount === 0) {
            console.error('[DB-MONITOR] All database connections offline');
        } else if (errorRate > 20) {
            console.warn('[DB-MONITOR] High error rate detected:', errorRate.toFixed(1) + '%');
        }
    }

    // Get database status summary
    getDatabaseStatus() {
        const status = {
            connections: this.connections,
            connectionPool: this.connectionPool,
            healthMetrics: this.healthMetrics,
            overallStatus: this.calculateOverallStatus(),
            recommendations: this.generateRecommendations()
        };
        
        return status;
    }

    // Calculate overall database status
    calculateOverallStatus() {
        const onlineConnections = Object.values(this.connections)
            .filter(conn => conn.status === 'online').length;
        const totalConnections = Object.keys(this.connections).length;
        
        if (onlineConnections === 0) return 'CRITICAL';
        if (onlineConnections < totalConnections / 2) return 'DEGRADED';
        if (onlineConnections < totalConnections) return 'WARNING';
        return 'HEALTHY';
    }

    // Generate recommendations based on current status
    generateRecommendations() {
        const recommendations = [];
        const status = this.calculateOverallStatus();
        
        switch (status) {
            case 'CRITICAL':
                recommendations.push('Immediate database server investigation required');
                recommendations.push('Check network connectivity to database clusters');
                recommendations.push('Verify database server hardware status');
                recommendations.push('Consider emergency failover procedures');
                break;
            case 'DEGRADED':
                recommendations.push('Investigate secondary database connectivity');
                recommendations.push('Review connection pool configuration');
                recommendations.push('Monitor database server resources');
                break;
            case 'WARNING':
                recommendations.push('Monitor database performance closely');
                recommendations.push('Review connection pool settings');
                break;
            default:
                recommendations.push('Continue monitoring for any issues');
        }
        
        return recommendations;
    }

    // Simulate database query
    async executeQuery(query, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            setTimeout(() => {
                const executionTime = Date.now() - startTime;
                const success = Math.random() > 0.3; // 70% success rate
                
                if (success) {
                    this.healthMetrics.totalQueries++;
                    resolve({
                        success: true,
                        executionTime: executionTime,
                        result: this.generateQueryResult(query)
                    });
                } else {
                    this.healthMetrics.failedQueries++;
                    reject(new Error('Query execution failed'));
                }
            }, Math.random() * timeout + 1000);
        });
    }

    // Generate mock query result
    generateQueryResult(query) {
        const results = {
            'SELECT * FROM users': { count: Math.floor(Math.random() * 1000) + 100 },
            'SELECT * FROM orders': { count: Math.floor(Math.random() * 5000) + 500 },
            'SELECT * FROM products': { count: Math.floor(Math.random() * 100) + 10 }
        };
        
        return results[query] || { count: Math.floor(Math.random() * 100) };
    }

    // Get detailed connection information
    getConnectionDetails() {
        const details = {};
        
        Object.keys(this.connections).forEach(dbName => {
            const conn = this.connections[dbName];
            details[dbName] = {
                status: conn.status,
                latency: conn.latency,
                lastCheck: conn.lastCheck,
                uptime: conn.lastCheck ? Math.floor((Date.now() - conn.lastCheck.getTime()) / 1000) : 0
            };
        });
        
        return details;
    }

    // Generate comprehensive database report
    generateDatabaseReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                overallStatus: this.calculateOverallStatus(),
                onlineConnections: Object.values(this.connections).filter(c => c.status === 'online').length,
                totalConnections: Object.keys(this.connections).length,
                connectionPoolUtilization: ((this.connectionPool.activeConnections / this.connectionPool.maxConnections) * 100).toFixed(1) + '%'
            },
            connections: this.getConnectionDetails(),
            connectionPool: this.connectionPool,
            healthMetrics: this.healthMetrics,
            recommendations: this.generateRecommendations(),
            alerts: this.generateAlerts()
        };
        
        return report;
    }

    // Generate alerts based on current status
    generateAlerts() {
        const alerts = [];
        
        if (this.calculateOverallStatus() === 'CRITICAL') {
            alerts.push({
                level: 'CRITICAL',
                message: 'All database connections offline',
                timestamp: new Date().toISOString()
            });
        }
        
        if (this.healthMetrics.failedQueries / this.healthMetrics.totalQueries > 0.2) {
            alerts.push({
                level: 'WARNING',
                message: 'High query failure rate detected',
                timestamp: new Date().toISOString()
            });
        }
        
        if (this.connectionPool.activeConnections / this.connectionPool.maxConnections > 0.9) {
            alerts.push({
                level: 'WARNING',
                message: 'Connection pool utilization critical',
                timestamp: new Date().toISOString()
            });
        }
        
        return alerts;
    }

    // Stop monitoring
    stop() {
        this.isMonitoring = false;
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            console.log('[DB-MONITOR] Database monitoring stopped');
        }
    }
}

// Global instance
const databaseMonitor = new DatabaseMonitor();

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await databaseMonitor.initialize();
    } catch (error) {
        console.error('[DB-MONITOR] Failed to initialize database monitor:', error);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DatabaseMonitor, databaseMonitor };
} 