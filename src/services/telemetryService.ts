import type { TelemetryUpdate } from '../types';

type TelemetryCallback = (update: TelemetryUpdate) => void;

class TelemetryService {
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: Set<TelemetryCallback> = new Set();
  private isRunning = false;

  // Start mock telemetry updates
  start(updateIntervalMs: number = 1000) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      const update: TelemetryUpdate = {
        timestamp: Date.now(),
        // Mock: slight variations in telemetry
        batteryLevel: 85 - Math.random() * 0.1,
      };
      
      this.notifyCallbacks(update);
    }, updateIntervalMs);
  }

  // Stop telemetry updates
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  // Subscribe to telemetry updates
  subscribe(callback: TelemetryCallback) {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  // Notify all subscribers
  private notifyCallbacks(update: TelemetryUpdate) {
    this.callbacks.forEach((callback) => callback(update));
  }

  // Mock: Simulate bus moving along a path
  simulateMovement(path: Array<{ x: number; y: number; z: number }>, durationMs: number) {
    if (path.length < 2) return;

    const steps = 60; // Number of interpolation steps
    let currentStep = 0;

    const movementInterval = durationMs / steps;

    const intervalId = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(intervalId);
        return;
      }

      const progress = currentStep / steps;
      const segmentIndex = Math.floor(progress * (path.length - 1));
      const nextIndex = Math.min(segmentIndex + 1, path.length - 1);
      const segmentProgress = (progress * (path.length - 1)) - segmentIndex;

      const start = path[segmentIndex];
      const end = path[nextIndex];

      const position = {
        x: start.x + (end.x - start.x) * segmentProgress,
        y: start.y + (end.y - start.y) * segmentProgress,
        z: start.z + (end.z - start.z) * segmentProgress,
      };

      const update: TelemetryUpdate = {
        timestamp: Date.now(),
        position,
        velocity: 2.5, // m/s
        autonomyState: 'autonomous',
        stuckReason: null,
      };

      this.notifyCallbacks(update);
      currentStep++;
    }, movementInterval);
  }
}

export const telemetryService = new TelemetryService();

