import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'

const aduModels = [
    { id: 'model1', label: 'Studio', sqft: '400', price: '$89,000', description: 'Perfect starter unit' },
    { id: 'model2', label: 'One Bedroom', sqft: '600', price: '$129,000', description: 'Ideal for singles or couples' },
    { id: 'model3', label: 'Two Bedroom', sqft: '800', price: '$169,000', description: 'Spacious family living' },
    { id: 'model1', label: 'XL 8', sqft: '1,000', price: '$199,000', description: 'Premium living space' },
    { id: 'model2', label: 'XL 10', sqft: '1,200', price: '$239,000', description: 'Luxury ADU experience' }
]

const exteriorFinishes = [
    { id: 'siding-wood', label: 'Wood Siding', color: '#8B7355' },
    { id: 'siding-metal', label: 'Metal Siding', color: '#6B7280' },
    { id: 'siding-fiber', label: 'Fiber Cement', color: '#E5E7EB' },
    { id: 'siding-stone', label: 'Stone Veneer', color: '#9CA3AF' }
]

const roofOptions = [
    { id: 'roof-shingle', label: 'Asphalt Shingle', color: '#1F2937' },
    { id: 'roof-metal', label: 'Metal Roof', color: '#4B5563' },
    { id: 'roof-tile', label: 'Tile Roof', color: '#6B7280' }
]

const windowStyles = [
    { id: 'windows-standard', label: 'Standard Windows' },
    { id: 'windows-large', label: 'Large Windows' },
    { id: 'windows-picture', label: 'Picture Windows' }
]

export default function App() {
    const [selectedModel, setSelectedModel] = useState(aduModels[0].id)
    const [selectedFinish, setSelectedFinish] = useState(exteriorFinishes[0].id)
    const [selectedRoof, setSelectedRoof] = useState(roofOptions[0].id)
    const [selectedWindows, setSelectedWindows] = useState(windowStyles[0].id)
    const [activePanel, setActivePanel] = useState('models')

    const currentModel = aduModels.find(m => m.id === selectedModel)

    return (
        <>
            <div className="canvas-background">
                <Canvas
                    camera={{
                        fov: 50,
                        near: 0.1,
                        far: 200,
                        position: [0, 5, 10]
                    }}
                >
                    <Experience 
                        modelId={selectedModel}
                        finishId={selectedFinish}
                        roofId={selectedRoof}
                        windowsId={selectedWindows}
                    />
                </Canvas>
            </div>

            <div className="app-shell">
                <header className="app-header">
                    <div>
                        <p className="app-eyebrow">Dream Home Configurator</p>
                        <h1>Design Your ADU</h1>
                    </div>
                    <nav>
                        <button
                            type="button"
                            className={activePanel === 'models' ? 'nav-link is-active' : 'nav-link'}
                            onClick={() => setActivePanel('models')}
                        >
                            Models
                        </button>
                        <button
                            type="button"
                            className={activePanel === 'exterior' ? 'nav-link is-active' : 'nav-link'}
                            onClick={() => setActivePanel('exterior')}
                        >
                            Exterior
                        </button>
                        <button
                            type="button"
                            className={activePanel === 'interior' ? 'nav-link is-active' : 'nav-link'}
                            onClick={() => setActivePanel('interior')}
                        >
                            Interior
                        </button>
                    </nav>
                    <div className="header-actions">
                        <button type="button" className="ghost-btn">3D Tour</button>
                        <button type="button" className="primary-btn">Get Quote</button>
                    </div>
                </header>

                <div className="app-body">
                    <aside className="app-sidebar">
                        {activePanel === 'models' && (
                            <section>
                                <p className="sidebar-label">Choose Your Model</p>
                                <ul>
                                    {aduModels.map((model) => (
                                        <li key={model.id}>
                                            <button
                                                type="button"
                                                className={model.id === selectedModel ? 'sidebar-link is-active' : 'sidebar-link'}
                                                onClick={() => setSelectedModel(model.id)}
                                            >
                                                <span>{model.label}</span>
                                                <small>{model.sqft} sq ft · {model.price}</small>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {activePanel === 'exterior' && (
                            <>
                                <section>
                                    <p className="sidebar-label">Exterior Finish</p>
                                    <div className="sidebar-menu-grid">
                                        {exteriorFinishes.map((finish) => (
                                            <button
                                                key={finish.id}
                                                type="button"
                                                className={finish.id === selectedFinish ? 'sidebar-pill is-active' : 'sidebar-pill'}
                                                onClick={() => setSelectedFinish(finish.id)}
                                                style={{ 
                                                    borderColor: finish.id === selectedFinish ? finish.color : undefined,
                                                    background: finish.id === selectedFinish ? `${finish.color}20` : undefined
                                                }}
                                            >
                                                {finish.label}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <p className="sidebar-label">Roof Style</p>
                                    <div className="sidebar-menu-grid">
                                        {roofOptions.map((roof) => (
                                            <button
                                                key={roof.id}
                                                type="button"
                                                className={roof.id === selectedRoof ? 'sidebar-pill is-active' : 'sidebar-pill'}
                                                onClick={() => setSelectedRoof(roof.id)}
                                                style={{ 
                                                    borderColor: roof.id === selectedRoof ? roof.color : undefined,
                                                    background: roof.id === selectedRoof ? `${roof.color}20` : undefined
                                                }}
                                            >
                                                {roof.label}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <p className="sidebar-label">Windows</p>
                                    <div className="sidebar-menu-grid">
                                        {windowStyles.map((window) => (
                                            <button
                                                key={window.id}
                                                type="button"
                                                className={window.id === selectedWindows ? 'sidebar-pill is-active' : 'sidebar-pill'}
                                                onClick={() => setSelectedWindows(window.id)}
                                            >
                                                {window.label}
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </>
                        )}

                        {activePanel === 'interior' && (
                            <section>
                                <p className="sidebar-label">Interior Options</p>
                                <div className="inspector-card">
                                    <p className="inspector-title">Coming Soon</p>
                                    <p>Interior customization options will be available soon. Configure flooring, cabinetry, and fixtures.</p>
                                </div>
                            </section>
                        )}
                    </aside>

                    <section className="inspector-panel">
                        <header>
                            <p className="sidebar-label">Current Selection</p>
                            <strong>{currentModel?.label}</strong>
                        </header>
                        <div className="inspector-card">
                            <div className="spec-grid">
                                <div className="spec-item">
                                    <span className="spec-label">Square Feet</span>
                                    <span className="spec-value">{currentModel?.sqft}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Starting Price</span>
                                    <span className="spec-value">{currentModel?.price}</span>
                                </div>
                            </div>
                            <p style={{ marginTop: '1rem', marginBottom: 0, fontSize: '0.9rem', color: '#8c94b2' }}>
                                {currentModel?.description}
                            </p>
                        </div>
                        <div className="inspector-grid">
                            <article>
                                <h3>3D Tour</h3>
                                <p>Explore your ADU from every angle. Click and drag to rotate, scroll to zoom.</p>
                            </article>
                            <article>
                                <h3>Customization</h3>
                                <p>Choose from various exterior finishes, roof styles, and window options to match your vision.</p>
                            </article>
                            <article>
                                <h3>Get Started</h3>
                                <p>Ready to build? Click "Get Quote" to speak with our team about your custom ADU project.</p>
                            </article>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}
