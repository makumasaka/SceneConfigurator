import { create } from 'zustand';
import type {
  HeroBusState,
  PathSuggestion,
  PathPoint,
  Obstacle,
  CameraMode,
  SceneLayerToggles,
  PathStatus,
} from '../types';

interface OperatorStore {
  // Hero Bus State
  heroBus: HeroBusState;
  setHeroBus: (updates: Partial<HeroBusState>) => void;
  
  // Path Suggestion State
  currentPath: PathSuggestion | null;
  pathHistory: PathSuggestion[];
  addPathPoint: (point: PathPoint) => void;
  updatePathPoint: (pointId: string, position: { x: number; y: number; z: number }) => void;
  removeLastPathPoint: () => void;
  clearPath: () => void;
  submitPath: () => void;
  setPathStatus: (status: PathStatus) => void;
  
  // Obstacles
  obstacles: Obstacle[];
  addObstacle: (obstacle: Obstacle) => void;
  removeObstacle: (id: string) => void;
  
  // UI State
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;
  sceneLayerToggles: SceneLayerToggles;
  toggleSceneLayer: (layer: keyof SceneLayerToggles) => void;
  isDrawingPath: boolean;
  setIsDrawingPath: (value: boolean) => void;
  
  // Demo Scenario
  loadStuckScenario: () => void;
}

const initialHeroBusState: HeroBusState = {
  position: { x: 0, y: 0.75, z: 0 },
  rotation: 0,
  velocity: 0,
  gear: 'P',
  autonomyState: 'autonomous',
  stuckReason: null,
  batteryLevel: 85,
};

export const useOperatorStore = create<OperatorStore>((set, get) => ({
  // Hero Bus State
  heroBus: initialHeroBusState,
  setHeroBus: (updates) =>
    set((state) => ({
      heroBus: { ...state.heroBus, ...updates },
    })),
  
  // Path Suggestion State
  currentPath: null,
  pathHistory: [],
  
  addPathPoint: (point) =>
    set((state) => {
      if (!state.currentPath) {
        // Create new path
        const newPath: PathSuggestion = {
          id: `path-${Date.now()}`,
          points: [point],
          status: 'draft',
          createdAt: Date.now(),
          submittedAt: null,
        };
        return { currentPath: newPath };
      } else {
        // Add to existing path
        return {
          currentPath: {
            ...state.currentPath,
            points: [...state.currentPath.points, point],
          },
        };
      }
    }),
  
  updatePathPoint: (pointId, position) =>
    set((state) => {
      if (!state.currentPath) return state;
      return {
        currentPath: {
          ...state.currentPath,
          points: state.currentPath.points.map((p) =>
            p.id === pointId ? { ...p, position } : p
          ),
        },
      };
    }),
  
  removeLastPathPoint: () =>
    set((state) => {
      if (!state.currentPath || state.currentPath.points.length === 0) {
        return { currentPath: null };
      }
      const newPoints = state.currentPath.points.slice(0, -1);
      if (newPoints.length === 0) {
        return { currentPath: null };
      }
      return {
        currentPath: {
          ...state.currentPath,
          points: newPoints,
        },
      };
    }),
  
  clearPath: () =>
    set(() => ({
      currentPath: null,
    })),
  
  submitPath: () =>
    set((state) => {
      if (!state.currentPath) return state;
      const submittedPath = {
        ...state.currentPath,
        status: 'submitted' as PathStatus,
        submittedAt: Date.now(),
      };
      return {
        currentPath: submittedPath,
        pathHistory: [...state.pathHistory, submittedPath],
      };
    }),
  
  setPathStatus: (status) =>
    set((state) => {
      if (!state.currentPath) return state;
      return {
        currentPath: {
          ...state.currentPath,
          status,
        },
      };
    }),
  
  // Obstacles
  obstacles: [],
  
  addObstacle: (obstacle) =>
    set((state) => ({
      obstacles: [...state.obstacles, obstacle],
    })),
  
  removeObstacle: (id) =>
    set((state) => ({
      obstacles: state.obstacles.filter((o) => o.id !== id),
    })),
  
  // UI State
  cameraMode: 'free',
  setCameraMode: (mode) => set({ cameraMode: mode }),
  
  sceneLayerToggles: {
    pedestrians: true,
    traffic: true,
    foliage: true,
    obstacles: true,
    debug: false,
  },
  
  toggleSceneLayer: (layer) =>
    set((state) => ({
      sceneLayerToggles: {
        ...state.sceneLayerToggles,
        [layer]: !state.sceneLayerToggles[layer],
      },
    })),
  
  isDrawingPath: false,
  setIsDrawingPath: (value) => set({ isDrawingPath: value }),
  
  // Demo Scenario
  loadStuckScenario: () =>
    set(() => ({
      heroBus: {
        position: { x: 0, y: 0.75, z: -5 },
        rotation: 0,
        velocity: 0,
        gear: 'P',
        autonomyState: 'stuck',
        stuckReason: 'blocked_lane',
        batteryLevel: 85,
      },
      obstacles: [
        {
          id: 'obstacle-1',
          type: 'cone',
          position: { x: -1, y: 0, z: 2 },
          rotation: 0,
          scale: 1,
        },
        {
          id: 'obstacle-2',
          type: 'cone',
          position: { x: 0, y: 0, z: 2 },
          rotation: 0,
          scale: 1,
        },
        {
          id: 'obstacle-3',
          type: 'cone',
          position: { x: 1, y: 0, z: 2 },
          rotation: 0,
          scale: 1,
        },
        {
          id: 'obstacle-4',
          type: 'barrier',
          position: { x: -1.5, y: 0, z: 5 },
          rotation: Math.PI / 2,
          scale: 1,
        },
        {
          id: 'obstacle-5',
          type: 'barrier',
          position: { x: 1.5, y: 0, z: 5 },
          rotation: Math.PI / 2,
          scale: 1,
        },
      ],
      currentPath: null,
    })),
}));

