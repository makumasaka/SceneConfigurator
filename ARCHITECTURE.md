# Architecture Overview

## State Management (Zustand)

The application uses a single Zustand store (`useOperatorStore`) that manages:

### Hero Bus State
```typescript
heroBus: {
  position: Vector3D
  rotation: number
  velocity: number
  gear: 'P' | 'D' | 'R' | 'N'
  autonomyState: 'autonomous' | 'manual' | 'stuck' | 'awaiting_guidance'
  stuckReason: string | null
  batteryLevel: number
}
```

### Path Management
```typescript
currentPath: {
  id: string
  points: PathPoint[]
  status: 'draft' | 'submitted' | 'accepted' | 'rejected'
  createdAt: number
  submittedAt: number | null
}
```

### UI State
```typescript
cameraMode: 'free' | 'follow' | 'overhead' | 'street'
sceneLayerToggles: {
  pedestrians: boolean
  traffic: boolean
  foliage: boolean
  obstacles: boolean
  debug: boolean
}
isDrawingPath: boolean
```

### Store Actions
- `setHeroBus(updates)` - Update bus state
- `addPathPoint(point)` - Add waypoint to path
- `updatePathPoint(id, position)` - Drag control point
- `removeLastPathPoint()` - Undo last point
- `clearPath()` - Remove entire path
- `submitPath()` - Submit to planner
- `toggleSceneLayer(layer)` - Toggle visibility
- `setCameraMode(mode)` - Change camera
- `loadStuckScenario()` - Load demo

## Scene Component Hierarchy

```
<SceneCanvas>
  <CityScene>
    <RoadNetwork />           // Ground, roads, lane markings, sidewalks
    <Buildings />             // Procedural city buildings (16 total)
    <Environment />           // Trees and foliage (24 total)
    <TrafficVehicles />       // 6 animated vehicles in lanes
    <Pedestrians />           // 10 animated pedestrians on sidewalks
    <Obstacles />             // Cones, barriers, debris from store
    <HeroBus />               // Hero autonomous bus
    <PathVisualization />     // Render suggested path with control points
    <PathDrawing />           // Invisible clickable plane for path creation
  </CityScene>
</SceneCanvas>
```

## Data Flow

### Telemetry Updates
```
telemetryService (mock)
  -> subscribe callback
  -> setHeroBus(update)
  -> store updates
  -> HeroBus component re-renders
  -> RightPanel displays new data
```

### Path Creation Flow
```
1. User clicks "Draw Path" button
   -> setIsDrawingPath(true)

2. User clicks in 3D scene
   -> PathDrawing raycasts to ground plane
   -> addPathPoint({ id, position, index })
   -> Store creates/updates currentPath

3. PathVisualization reads currentPath
   -> Renders Line component with points
   -> Renders control point spheres
   -> Shows start/end markers

4. User clicks "Submit"
   -> submitPath() in store (marks as submitted)
   -> plannerService.submitPath(path)
   -> Response updates path status
   -> UI reflects new status
```

### Camera Follow Mode
```
1. User selects "Follow" camera mode
   -> setCameraMode('follow')

2. HeroBus component useFrame hook
   -> Reads bus position
   -> Smoothly interpolates camera position
   -> Camera.lookAt(bus.position)

3. OrbitControls disabled in follow mode
   -> enabled={cameraMode !== 'follow'}
```

## Mock Services

### TelemetryService
- **Purpose**: Simulate real-time bus updates
- **Methods**:
  - `start(intervalMs)` - Begin updates
  - `stop()` - End updates
  - `subscribe(callback)` - Listen for updates
  - `simulateMovement(path, duration)` - Animate bus along path
- **Integration Point**: Replace with WebSocket connection to real vehicle

### PlannerService  
- **Purpose**: Simulate path validation and acceptance
- **Methods**:
  - `submitPath(path)` - Validate and respond
  - `cancelPath(pathId)` - Cancel submitted path
- **Integration Point**: Replace with HTTP API or WebSocket to planning service

## Key Design Decisions

### Why Zustand?
- Minimal boilerplate vs Redux
- Direct state access without Context
- Easy to use with TypeScript
- Good DevTools support

### Why Modular Scene Components?
- Easier to maintain and debug
- Can toggle layers independently
- Clearer file organization
- Performance optimization opportunities (memoization, culling)

### Why Mock Services?
- Clean separation of concerns
- Easy to test UI without backend
- Simple to swap with real services
- Consistent interface definition

### Path Drawing Approach
- Raycasting to ground plane for accurate 3D positioning
- Control points as draggable spheres
- Line component from drei for smooth rendering
- Separate component for drawing vs visualization

## Performance Considerations

### Instancing Opportunities
Currently not implemented but could be added for:
- Traffic vehicles (6 instances)
- Pedestrians (10 instances)
- Trees (24 instances)
- Buildings (16 instances)

### Optimization Tips
1. Use `useMemo` for expensive calculations
2. Implement frustum culling for distant objects
3. LOD (Level of Detail) for buildings at distance
4. Reduce shadow map size if performance is poor
5. Limit animation frame updates with delta time checks

### Current Frame Budget
- Scene renders at 60fps on modern hardware
- ~50-100 draw calls
- Shadow maps: 2048x2048 (can reduce to 1024 if needed)

## Extending the Application

### Adding New Obstacle Types
1. Add type to `ObstacleType` in types/index.ts
2. Add case to `ObstacleMesh` in scene/Obstacles.tsx
3. Create obstacle in store or via UI

### Adding New Camera Modes
1. Add mode to `CameraMode` type
2. Add case to `getCameraPosition()` in SceneCanvas
3. Add button to LeftPanel

### Integrating Real Backend
1. Replace telemetryService with WebSocket client
2. Replace plannerService with HTTP/WebSocket API
3. Add authentication/authorization
4. Handle connection states and errors
5. Add reconnection logic

### Adding Multi-Vehicle Support
1. Extend store to support vehicle array
2. Create VehicleManager component
3. Update HeroBus to accept vehicle ID prop
4. Add vehicle selection UI

## Troubleshooting

### Path Not Drawing
- Check `isDrawingPath` state is true
- Verify raycaster is hitting ground plane
- Check console for errors in PathDrawing component

### Camera Not Following Bus
- Verify `cameraMode` is 'follow'
- Check HeroBus useFrame hook is executing
- Ensure OrbitControls.enabled is false

### Performance Issues
- Reduce shadow map size
- Toggle off pedestrians/traffic layers
- Check browser DevTools Performance tab
- Verify no memory leaks in useFrame hooks

### Build Errors
- Run `npm install` to ensure all dependencies
- Check TypeScript version compatibility
- Verify Three.js and R3F versions match

## Future Enhancements

### High Priority
- [ ] Real backend integration (WebSocket)
- [ ] Path editing (drag control points properly)
- [ ] Multi-vehicle support
- [ ] Replay mode for past incidents

### Medium Priority
- [ ] Mini-map overlay
- [ ] Path history visualization
- [ ] Keyboard shortcuts
- [ ] Export incident reports

### Low Priority
- [ ] VR support for immersive operation
- [ ] Weather effects (rain, fog)
- [ ] Time of day simulation
- [ ] Advanced building LOD system

