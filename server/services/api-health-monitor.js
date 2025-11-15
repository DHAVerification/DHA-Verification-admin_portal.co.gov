
export class APIHealthMonitor {
  constructor() {
    this.endpointHealth = new Map();
    this.lastCheck = null;
  }

  recordAttempt(endpoint, success) {
    if (!this.endpointHealth.has(endpoint)) {
      this.endpointHealth.set(endpoint, {
        totalAttempts: 0,
        successfulAttempts: 0,
        lastSuccess: null,
        lastFailure: null
      });
    }

    const health = this.endpointHealth.get(endpoint);
    health.totalAttempts++;
    
    if (success) {
      health.successfulAttempts++;
      health.lastSuccess = new Date();
    } else {
      health.lastFailure = new Date();
    }

    this.lastCheck = new Date();
  }

  getHealthReport() {
    const report = {
      timestamp: this.lastCheck,
      endpoints: []
    };

    this.endpointHealth.forEach((health, endpoint) => {
      const successRate = health.totalAttempts > 0 
        ? (health.successfulAttempts / health.totalAttempts * 100).toFixed(1)
        : 0;

      report.endpoints.push({
        endpoint,
        successRate: `${successRate}%`,
        totalAttempts: health.totalAttempts,
        successfulAttempts: health.successfulAttempts,
        lastSuccess: health.lastSuccess,
        lastFailure: health.lastFailure,
        status: successRate > 0 ? 'OPERATIONAL' : 'OFFLINE'
      });
    });

    return report;
  }

  isHealthy() {
    let anySuccess = false;
    this.endpointHealth.forEach(health => {
      if (health.successfulAttempts > 0) {
        anySuccess = true;
      }
    });
    return anySuccess;
  }
}

export const apiHealthMonitor = new APIHealthMonitor();
