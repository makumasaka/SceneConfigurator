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

    // Clear any existing movement simulation
    if (this.movementIntervalId) {
      clearInterval(this.movementIntervalId);
    }

    // Set gear to Drive and autonomy to autonomous
    this.notifyCallbacks({
      timestamp: Date.now(),
      autonomyState: 'autonomous',
      stuckReason: null,
    });

    this.movementIntervalId = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(this.movementIntervalId!);
        this.movementIntervalId = null;
        
        // Stop at end of path
        this.notifyCallbacks({
          timestamp: Date.now(),
          velocity: 0,
          autonomyState: 'autonomous',
        });
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
        y: 0.75, // Keep bus at road level
        z: start.z + (end.z - start.z) * segmentProgress,
      };

      // Calculate rotation based on direction of movement
      const dx = end.x - start.x;
      const dz = end.z - start.z;
      const rotation = Math.atan2(dx, dz);

      const update: TelemetryUpdate = {
        timestamp: Date.now(),
        position,
        rotation,
        velocity: 2.5, // m/s
        autonomyState: 'autonomous',
        stuckReason: null,
      };

      this.notifyCallbacks(update);
      currentStep++;
    }, movementInterval);
  }

  // Stop any ongoing movement
  stopMovement() {
    if (this.movementIntervalId) {
      clearInterval(this.movementIntervalId);
      this.movementIntervalId = null;
    }
  }

  private movementIntervalId: NodeJS.Timeout | null = null;
}

export const telemetryService = new TelemetryService();

