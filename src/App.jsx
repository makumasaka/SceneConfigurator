import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'

const navItems = ['Scene', 'Materials', 'Lighting', 'Animations']

const cameraPresets = [
    { id: 'hero', label: 'Hero Orbit', description: 'Wide hero sweep around the product.' },
    { id: 'detail', label: 'Detail Close-up', description: 'Macro framing for texture shots.' },
    { id: 'top', label: 'Top Down', description: 'Orthographic-inspired birds-eye view.' }
]

const animationMenus = [
    { id: 'intro', label: 'Intro Reveal' },
    { id: 'explode', label: 'Exploded View' },
    { id: 'cycle', label: 'Material Cycle' }
]

export default function App() {
    const [activeNav, setActiveNav] = useState(navItems[0])
    const [selectedPreset, setSelectedPreset] = useState(cameraPresets[0].id)
    const [activeAnimation, setActiveAnimation] = useState(animationMenus[0].id)

    return (
        <>
            <div className="canvas-background">
                <Canvas
                    camera={{
                        fov: 45,
                        near: 0.1,
                        far: 200,
                        position: [-4, 3, 6]
                    }}
                >
                    <Experience />
                </Canvas>
            </div>

            <div className="app-shell">
                <header className="app-header">
                    <div>
                        <p className="app-eyebrow">Scene Configurator</p>
                        <h1>R3F Experience Hub</h1>
                    </div>
                    <nav>
                        {navItems.map((item) => (
                            <button
                                key={item}
                                type="button"
                                className={item === activeNav ? 'nav-link is-active' : 'nav-link'}
                                onClick={() => setActiveNav(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>
                    <div className="header-actions">
                        <button type="button" className="ghost-btn">Reset Camera</button>
                        <button type="button" className="primary-btn">Publish Scene</button>
                    </div>
                </header>

                <div className="app-body">
                    <aside className="app-sidebar">
                        <section>
                            <p className="sidebar-label">Camera Presets</p>
                            <ul>
                                {cameraPresets.map((preset) => (
                                    <li key={preset.id}>
                                        <button
                                            type="button"
                                            className={preset.id === selectedPreset ? 'sidebar-link is-active' : 'sidebar-link'}
                                            onClick={() => setSelectedPreset(preset.id)}
                                        >
                                            <span>{preset.label}</span>
                                            <small>{preset.description}</small>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <p className="sidebar-label">Animations</p>
                            <div className="sidebar-menu-grid">
                                {animationMenus.map((animation) => (
                                    <button
                                        key={animation.id}
                                        type="button"
                                        className={animation.id === activeAnimation ? 'sidebar-pill is-active' : 'sidebar-pill'}
                                        onClick={() => setActiveAnimation(animation.id)}
                                    >
                                        {animation.label}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </aside>

                    <section className="inspector-panel">
                        <header>
                            <p className="sidebar-label">Active Panel</p>
                            <strong>{activeNav}</strong>
                        </header>
                        <div className="inspector-card">
                            <p className="inspector-title">Next steps</p>
                            <p>
                                Wire these controls into Zustand or another state store so the menu selections can trigger
                                camera tweens, animation clips, lighting overrides, and material swaps in the R3F scene.
                            </p>
                        </div>
                        <div className="inspector-grid">
                            <article>
                                <h3>Camera target</h3>
                                <p>Anchor the camera rig to meshes or named nodes to align transitions.</p>
                            </article>
                            <article>
                                <h3>Animation queue</h3>
                                <p>Use GSAP or react-spring to coordinate layered UI + scene moves.</p>
                            </article>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}
