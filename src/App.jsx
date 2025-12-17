import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import * as THREE from 'three'

export default function App() {
    const [isRunning, setIsRunning] = useState(false)
    const [busSpeed, setBusSpeed] = useState(0)
    const [targetSpeed, setTargetSpeed] = useState(30) // km/h
    const [busPosition, setBusPosition] = useState([0, 0, 0])
    const [busRotation, setBusRotation] = useState([0, 0, 0])
    const [pathProgress, setPathProgress] = useState(0) // 0-1
    // Default path points forming a closed loop
    const [pathPoints, setPathPoints] = useState([
        [0, 0, 0], 
        [10, 0, 5], 
        [15, 0, 0], 
        [10, 0, -10], 
        [-5, 0, -5],
        [-5, 0, 5]
    ])
    const [editingPath, setEditingPath] = useState(false)
    const [numRoads, setNumRoads] = useState(5)
    
    // Agent visibility controls
    const [showAgents, setShowAgents] = useState({
        cars: true,
        bikes: true,
        pedestrians: true,
        animals: true,
        buildings: true
    })
    
    // Agent data
    const [agents, setAgents] = useState({
        cars: [
            { id: 1, position: [8, 0, 3], rotation: [0, Math.PI / 2, 0] },
            { id: 2, position: [-5, 0, -3], rotation: [0, -Math.PI / 2, 0] },
            { id: 3, position: [15, 0, -5], rotation: [0, 0, 0] }
        ],
        bikes: [
            { id: 1, position: [3, 0, 4], rotation: [0, Math.PI / 4, 0] },
            { id: 2, position: [-3, 0, -4], rotation: [0, -Math.PI / 4, 0] }
        ],
        pedestrians: [
            { id: 1, position: [6, 0, 2], rotation: [0, Math.PI / 3, 0] },
            { id: 2, position: [-4, 0, 5], rotation: [0, -Math.PI / 6, 0] },
            { id: 3, position: [12, 0, -2], rotation: [0, Math.PI, 0] }
        ],
        animals: [
            { id: 1, position: [2, 0, -3], rotation: [0, Math.PI / 2, 0], type: 'dog' },
            { id: 2, position: [-6, 0, 2], rotation: [0, -Math.PI / 2, 0], type: 'cat' }
        ],
        buildings: [
            { id: 1, position: [10, 0, 8], size: [3, 5, 3] },
            { id: 2, position: [-8, 0, -8], size: [4, 6, 4] },
            { id: 3, position: [15, 0, 5], size: [2, 4, 2] },
            { id: 4, position: [-10, 0, 6], size: [3, 5, 3] }
        ]
    })
    
    const curveRef = useRef(null)
    const animationFrameRef = useRef(null)
    
    // Calculate spline curve from path points (closed loop)
    useEffect(() => {
        if (pathPoints.length >= 2) {
            const points = pathPoints.map(p => new THREE.Vector3(...p))
            curveRef.current = new THREE.CatmullRomCurve3(points, true) // closed = true for continuous loop
        }
    }, [pathPoints])
    
    // Bus movement animation
    useEffect(() => {
        if (!isRunning || !curveRef.current) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            return
        }
        
        let progress = pathProgress
        const speedFactor = targetSpeed / 100 // Normalize speed
        
        const animate = () => {
            if (!isRunning || !curveRef.current) return
            
            // Update progress along path
            progress += speedFactor * 0.01
            if (progress >= 1) {
                progress = 0 // Loop back
            }
            
            // Get position and tangent from curve
            const position = curveRef.current.getPointAt(progress)
            const tangent = curveRef.current.getTangentAt(progress)
            
            // Calculate rotation from tangent
            const angle = Math.atan2(tangent.x, tangent.z)
            
            setBusPosition([position.x, position.y, position.z])
            setBusRotation([0, angle, 0])
            setPathProgress(progress)
            
            // Update speed (gradual acceleration/deceleration)
            setBusSpeed(prev => {
                if (prev < targetSpeed) {
                    return Math.min(prev + 0.5, targetSpeed)
                } else if (prev > targetSpeed) {
                    return Math.max(prev - 0.5, targetSpeed)
                }
                return prev
            })
            
            animationFrameRef.current = requestAnimationFrame(animate)
        }
        
        animationFrameRef.current = requestAnimationFrame(animate)
        
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [isRunning, targetSpeed, pathProgress])
    
    // Calculate path statistics
    const pathLength = curveRef.current ? curveRef.current.getLength() : 0
    const distanceTraveled = pathLength * pathProgress
    const distanceRemaining = pathLength * (1 - pathProgress)
    const estimatedTimeRemaining = busSpeed > 0 ? (distanceRemaining / (busSpeed / 3.6)) : 0 // Convert km/h to m/s
    
    const handleStartStop = () => {
        setIsRunning(!isRunning)
        if (!isRunning) {
            setBusSpeed(0) // Reset speed when starting
        }
    }
    
    const handleReset = () => {
        setIsRunning(false)
        setBusSpeed(0)
        setPathProgress(0)
        setBusPosition(pathPoints[0] || [0, 0, 0])
        setBusRotation([0, 0, 0])
    }
    
    const handleAddPathPoint = () => {
        const lastPoint = pathPoints[pathPoints.length - 1]
        const newPoint = [lastPoint[0] + 5, lastPoint[1], lastPoint[2] + 5]
        setPathPoints([...pathPoints, newPoint])
    }
    
    const handleRemovePathPoint = () => {
        if (pathPoints.length > 2) {
            setPathPoints(pathPoints.slice(0, -1))
        }
    }
    
    const toggleAgentVisibility = (agentType) => {
        setShowAgents(prev => ({
            ...prev,
            [agentType]: !prev[agentType]
        }))
    }
    
    return (
        <>
            <div className="canvas-background">
                <Canvas
                    camera={{
                        fov: 50,
                        near: 0.1,
                        far: 500,
                        position: [15, 10, 15]
                    }}
                >
                    <Experience
                        pathPoints={pathPoints}
                        busPosition={busPosition}
                        busRotation={busRotation}
                        busSpeed={busSpeed}
                        isRunning={isRunning}
                        editingPath={editingPath}
                        onPathUpdate={setPathPoints}
                        agents={agents}
                        showAgents={showAgents}
                        numRoads={numRoads}
                    />
                </Canvas>
            </div>

            <div className="app-shell">
                <header className="app-header">
                    <div>
                        <p className="app-eyebrow">Autonomous Bus System</p>
                        <h1>Control & Monitoring Center</h1>
                    </div>
                    <div className="header-status">
                        <div className={`status-indicator ${isRunning ? 'status-running' : 'status-stopped'}`}>
                            <span className="status-dot"></span>
                            {isRunning ? 'Running' : 'Stopped'}
                        </div>
                    </div>
                </header>

                <div className="app-body">
                    {/* Left Sidebar - Bus Controls */}
                    <aside className="app-sidebar">
                        <section>
                            <p className="sidebar-label">Bus Control</p>
                            <div className="control-group">
                                <button
                                    type="button"
                                    className={`control-btn ${isRunning ? 'btn-stop' : 'btn-start'}`}
                                    onClick={handleStartStop}
                                >
                                    {isRunning ? '⏸ Stop' : '▶ Start'}
                                </button>
                                <button
                                    type="button"
                                    className="control-btn btn-reset"
                                    onClick={handleReset}
                                >
                                    ↺ Reset
                                </button>
                            </div>
                            
                            <div className="control-group">
                                <label className="control-label">
                                    Target Speed: {targetSpeed} km/h
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="60"
                                    value={targetSpeed}
                                    onChange={(e) => setTargetSpeed(Number(e.target.value))}
                                    className="slider"
                                />
                            </div>
                        </section>

                        <section>
                            <p className="sidebar-label">Path Editing</p>
                            <div className="control-group">
                                <button
                                    type="button"
                                    className={`control-btn ${editingPath ? 'btn-active' : ''}`}
                                    onClick={() => setEditingPath(!editingPath)}
                                >
                                    {editingPath ? '✓ Done Editing' : '✎ Edit Path'}
                                </button>
                                <button
                                    type="button"
                                    className="control-btn"
                                    onClick={handleAddPathPoint}
                                >
                                    + Add Point
                                </button>
                                <button
                                    type="button"
                                    className="control-btn"
                                    onClick={handleRemovePathPoint}
                                    disabled={pathPoints.length <= 2}
                                >
                                    - Remove Point
                                </button>
                            </div>
                            <div className="path-info">
                                <small>Path Points: {pathPoints.length}</small>
                                <small>Path Length: {pathLength.toFixed(1)}m</small>
                            </div>
                        </section>

                        <section>
                            <p className="sidebar-label">Road Network</p>
                            <div className="control-group">
                                <label className="control-label">
                                    Number of Roads: {numRoads}
                                </label>
                                <input
                                    type="range"
                                    min="2"
                                    max="20"
                                    value={numRoads}
                                    onChange={(e) => setNumRoads(Number(e.target.value))}
                                    className="slider"
                                />
                            </div>
                        </section>

                        <section>
                            <p className="sidebar-label">Agent Visibility</p>
                            <div className="agent-controls">
                                {Object.entries(showAgents).map(([type, visible]) => (
                                    <label key={type} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={visible}
                                            onChange={() => toggleAgentVisibility(type)}
                                        />
                                        <span className="checkbox-custom"></span>
                                        <span className="checkbox-text">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                                    </label>
                                ))}
                            </div>
                        </section>
                    </aside>

                    {/* Right Panel - Monitoring Dashboard */}
                    <section className="monitoring-panel">
                        <header>
                            <p className="sidebar-label">Monitoring Dashboard</p>
                            <strong>Real-time Status</strong>
                        </header>
                        
                        <div className="monitoring-grid">
                            <div className="monitor-card">
                                <h3>Position</h3>
                                <div className="monitor-value">
                                    <div>X: {busPosition[0].toFixed(2)}m</div>
                                    <div>Y: {busPosition[1].toFixed(2)}m</div>
                                    <div>Z: {busPosition[2].toFixed(2)}m</div>
                                </div>
                            </div>

                            <div className="monitor-card">
                                <h3>Speed</h3>
                                <div className="monitor-value large">
                                    {busSpeed.toFixed(1)} <span className="unit">km/h</span>
                                </div>
                            </div>

                            <div className="monitor-card">
                                <h3>Path Progress</h3>
                                <div className="progress-bar-container">
                                    <div className="progress-bar" style={{ width: `${pathProgress * 100}%` }}></div>
                                </div>
                                <div className="monitor-value">
                                    {(pathProgress * 100).toFixed(1)}%
                                </div>
                            </div>

                            <div className="monitor-card">
                                <h3>Distance</h3>
                                <div className="monitor-value">
                                    <div>Traveled: {distanceTraveled.toFixed(1)}m</div>
                                    <div>Remaining: {distanceRemaining.toFixed(1)}m</div>
                                </div>
                            </div>

                            <div className="monitor-card">
                                <h3>ETA</h3>
                                <div className="monitor-value">
                                    {estimatedTimeRemaining > 0 
                                        ? `${Math.floor(estimatedTimeRemaining / 60)}:${Math.floor(estimatedTimeRemaining % 60).toString().padStart(2, '0')}`
                                        : '--:--'
                                    }
                                </div>
                            </div>

                            <div className="monitor-card">
                                <h3>System Status</h3>
                                <div className="monitor-value">
                                    <div className={`status-badge ${isRunning ? 'badge-active' : 'badge-inactive'}`}>
                                        {isRunning ? '● Active' : '○ Inactive'}
                                    </div>
                                    <div>Path Points: {pathPoints.length}</div>
                                    <div>Curve Length: {pathLength.toFixed(1)}m</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}
