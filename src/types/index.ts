// Hero Bus State Types
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export type AutonomyState = 'autonomous' | 'manual' | 'stuck' | 'awaiting_guidance';

export type StuckReason = 
  | 'blocked_lane' 
  | 'construction' 
  | 'accident' 
  | 'unknown_obstacle'
  | null;

export interface HeroBusState {
  position: Vector3D;
  rotation: number; // Y-axis rotation in radians
  velocity: number; // m/s
  gear: 'P' | 'D' | 'R' | 'N';
  autonomyState: AutonomyState;
  stuckReason: StuckReason;
  batteryLevel: number; // percentage
}

// Path Types
export interface PathPoint {
  id: string;
  position: Vector3D;
  index: number;
}

export type PathStatus = 'draft' | 'submitted' | 'accepted' | 'rejected';

export interface PathSuggestion {
  id: string;
  points: PathPoint[];
  status: PathStatus;
  createdAt: number;
  submittedAt: number | null;
}

// Obstacle Types
export type ObstacleType = 'cone' | 'barrier' | 'debris' | 'vehicle';

export interface Obstacle {
  id: string;
  type: ObstacleType;
  position: Vector3D;
  rotation: number;
  scale?: number;
}

// Scene Layer Visibility
export interface SceneLayerToggles {
  pedestrians: boolean;
  traffic: boolean;
  foliage: boolean;
  obstacles: boolean;
  debug: boolean;
}

// Camera Mode
export type CameraMode = 'free' | 'follow' | 'overhead' | 'street';

// UI State
export interface UIState {
  selectedTab: string;
  cameraMode: CameraMode;
  sceneLayerToggles: SceneLayerToggles;
  isDrawingPath: boolean;
}

// Telemetry Update (from mock backend)
export interface TelemetryUpdate {
  timestamp: number;
  position?: Vector3D;
  velocity?: number;
  autonomyState?: AutonomyState;
  stuckReason?: StuckReason;
  batteryLevel?: number;
}

// Planner Response (from mock backend)
export interface PlannerResponse {
  pathId: string;
  status: 'accepted' | 'rejected';
  message: string;
  estimatedTime?: number; // seconds
}

