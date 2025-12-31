# Autonomous Bus Remote Operator Guidance Tool

A desktop web application for remote operators to monitor and guide autonomous buses when they encounter obstacles or get stuck.

## Features

### Core Functionality
- **3D City Visualization**: Stylized city environment with roads, buildings, pedestrians, and traffic
- **Hero Bus Monitoring**: Real-time telemetry display (position, velocity, battery, autonomy state)
- **Interactive Path Drawing**: Click-and-draw interface to suggest driving paths
- **Path Submission**: Submit path suggestions to the planning service
- **Demo Scenario**: Pre-configured "blocked lane" scenario for testing

### Camera Controls
- **Free Mode**: Manual OrbitControls navigation
- **Follow Mode**: Camera automatically tracks the hero bus
- **Overhead Mode**: Top-down bird's eye view
- **Street Mode**: Ground-level perspective

### Scene Layers (Toggle visibility)
- Pedestrians
- Traffic vehicles
- Foliage (trees)
- Obstacles (cones, barriers)
- Debug overlays

## Tech Stack

- **React 18** + **TypeScript**
- **React Three Fiber (R3F)** - 3D rendering
- **@react-three/drei** - R3F helpers
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Project Structure

```
src/
  scene/              # 3D scene components
    CityScene.tsx     # Main scene container
    RoadNetwork.tsx   # Roads, lanes, sidewalks
    HeroBus.tsx       # Hero autonomous bus
    Obstacles.tsx     # Cones, barriers, debris
    Buildings.tsx     # City buildings
    Environment.tsx   # Trees and foliage
    TrafficVehicles.tsx   # Other vehicles
    Pedestrians.tsx   # Animated pedestrians
    PathDrawing.tsx   # Interactive path creation
    PathVisualization.tsx  # Path rendering
    
  store/              # Zustand state management
    useOperatorStore.ts   # Main operator store
    
  services/           # Mock backend services
    telemetryService.ts   # Hero bus telemetry updates
    plannerService.ts     # Path submission responses
    
  types/              # TypeScript definitions
    index.ts          # All type definitions
    
  components/         # UI components
    SceneCanvas.tsx   # R3F Canvas wrapper
    Header.tsx        # Top navigation
    LeftPanel.tsx     # Camera & layer controls
    RightPanel.tsx    # Bus status & path controls
    ui/               # Radix UI components
```

## Running the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to `http://localhost:3001` (or the port shown in terminal)

## Usage Guide

### Drawing a Path

1. Click the **"Draw Path"** button in the right panel
2. Click on the ground plane in the 3D scene to place waypoints
3. Continue clicking to add more points (minimum 3 recommended)
4. Use **"Undo"** to remove the last point
5. Use **"Clear"** to start over
6. Click **"Submit Path"** when ready

### Path Execution

Once a path is submitted and accepted:
1. The vehicle will **automatically start moving** along the path after a brief delay
2. Watch the bus smoothly follow the waypoints you placed
3. The bus will rotate to face the direction of movement
4. Progress is shown with "Executing Path" indicator
5. The bus stops at the end of the path
6. You can also click **"Execute Path Manually"** if auto-execution was disabled

### Path Statuses

- **Draft** - Path is being created (blue)
- **Submitted** - Sent to planner (orange)
- **Accepted** - Path approved, bus will execute (green)
- **Rejected** - Path rejected, needs revision (red)

### Demo Scenario

Click **"Blocked Lane"** in the left panel to load a pre-configured stuck scenario:
- Hero bus positioned at blocked lane
- Multiple traffic cones blocking the path
- Construction barriers on sides
- Bus state: STUCK with reason "blocked_lane"

### Camera Tips

- **Free Mode**: Drag to orbit, scroll to zoom
- **Follow Mode**: Camera automatically tracks bus
- **Overhead Mode**: Perfect for path planning
- Use scene layer toggles to reduce visual clutter

## Mock Services

The application includes mock backend services that simulate real-world behavior:

### Telemetry Service
- Updates every 2 seconds for basic telemetry
- Provides bus position, rotation, velocity, battery level
- Simulates smooth bus movement along accepted paths
- Updates position/rotation 60 times per second during path execution
- Calculates realistic heading based on movement direction

### Planner Service  
- Validates path submissions
- Returns acceptance/rejection with messages
- Simulates network delay (1.5s)

### Future Integration
Both services provide clean interfaces for replacing mocks with real WebSocket or HTTP connections.

## Development Notes

- All 3D objects are created procedurally (no external assets required)
- Camera controls use standard OrbitControls with follow mode override
- Path drawing uses raycasting to ground plane
- State management via Zustand for clean separation
- TypeScript types ensure type safety throughout

## Browser Compatibility

- Modern browsers with WebGL 2 support
- Tested on Chrome, Firefox, Safari, Edge
- Desktop-first design (responsive mobile not prioritized)

## Original Project

This project was refactored from a generative world builder. Original Figma design: https://www.figma.com/design/NZqjqM1Yan4Bggs2aKC2RH/Robobus-App
  