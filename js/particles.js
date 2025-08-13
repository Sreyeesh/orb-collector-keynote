// Particle animation system
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.particles = [];
        this.options = {
            particleCount: options.particleCount || 20,
            particleSize: options.particleSize || 4,
            particleColor: options.particleColor || 'rgba(0, 245, 255, 0.6)',
            animationDuration: options.animationDuration || 15,
            spawnRate: options.spawnRate || 2000,
            ...options
        };
        
        this.init();
    }

    init() {
        this.createInitialParticles();
        this.startParticleSpawning();
    }

    createInitialParticles() {
        for (let i = 0; i < this.options.particleCount; i++) {
            this.createParticle(i * (this.options.animationDuration * 1000 / this.options.particleCount));
        }
    }

    createParticle(delay = 0) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random starting position
        const startX = Math.random() * 100;
        const endX = startX + (Math.random() - 0.5) * 200;
        
        // Style the particle
        Object.assign(particle.style, {
            position: 'absolute',
            width: `${this.options.particleSize}px`,
            height: `${this.options.particleSize}px`,
            background: this.options.particleColor,
            borderRadius: '50%',
            left: `${startX}%`,
            pointerEvents: 'none',
            animation: `particleFloat ${this.options.animationDuration}s linear infinite`,
            animationDelay: `${delay}ms`
        });

        // Add custom CSS variables for end position
        particle.style.setProperty('--end-x', `${endX}px`);
        
        this.container.appendChild(particle);
        this.particles.push(particle);

        // Remove particle after animation completes
        setTimeout(() => {
            this.removeParticle(particle);
        }, this.options.animationDuration * 1000 + delay);
    }

    removeParticle(particle) {
        const index = this.particles.indexOf(particle);
        if (index > -1) {
            this.particles.splice(index, 1);
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }
    }

    startParticleSpawning() {
        this.spawnInterval = setInterval(() => {
            this.createParticle();
        }, this.options.spawnRate);
    }

    destroy() {
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }
        
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        
        this.particles = [];
    }
}

// Orb collection effect system
class OrbEffectSystem {
    constructor() {
        this.effects = [];
    }

    createCollectionEffect(x, y, container) {
        const effect = document.createElement('div');
        effect.className = 'collection-effect';
        
        Object.assign(effect.style, {
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: '20px',
            height: '20px',
            background: 'radial-gradient(circle, #00f5ff, transparent)',
            borderRadius: '50%',
            pointerEvents: 'none',
            animation: 'collectEffect 1s ease-out forwards',
            zIndex: '1000'
        });

        container.appendChild(effect);
        this.effects.push(effect);

        // Create sparkles
        for (let i = 0; i < 8; i++) {
            this.createSparkle(x, y, container, i);
        }

        // Remove effect after animation
        setTimeout(() => {
            this.removeEffect(effect);
        }, 1000);
    }

    createSparkle(centerX, centerY, container, index) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-effect';
        
        const angle = (index / 8) * Math.PI * 2;
        const distance = 50;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        Object.assign(sparkle.style, {
            position: 'absolute',
            left: `${centerX}px`,
            top: `${centerY}px`,
            width: '4px',
            height: '4px',
            background: '#ffff00',
            borderRadius: '50%',
            pointerEvents: 'none',
            animation: `sparkleEffect 0.8s ease-out forwards`,
            animationDelay: `${index * 0.1}s`,
            zIndex: '1001'
        });

        sparkle.style.setProperty('--end-x', `${endX}px`);
        sparkle.style.setProperty('--end-y', `${endY}px`);

        container.appendChild(sparkle);
        this.effects.push(sparkle);

        setTimeout(() => {
            this.removeEffect(sparkle);
        }, 800 + index * 100);
    }

    removeEffect(effect) {
        const index = this.effects.indexOf(effect);
        if (index > -1) {
            this.effects.splice(index, 1);
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }
    }
}

// Background animation controller
class BackgroundAnimationController {
    constructor() {
        this.shapes = [];
        this.init();
    }

    init() {
        this.createBackgroundShapes();
        this.startShapeAnimation();
    }

    createBackgroundShapes() {
        const container = document.querySelector('.keynote-bg-animation');
        if (!container) return;

        const shapeConfigs = [
            { size: 200, top: '10%', left: '10%', delay: 0 },
            { size: 150, top: '70%', right: '15%', delay: -5000 },
            { size: 100, top: '30%', right: '30%', delay: -10000 },
            { size: 120, bottom: '20%', left: '20%', delay: -7500 },
            { size: 80, top: '50%', left: '50%', delay: -12500 }
        ];

        shapeConfigs.forEach((config, index) => {
            const shape = document.createElement('div');
            shape.className = 'bg-shape';
            
            Object.assign(shape.style, {
                width: `${config.size}px`,
                height: `${config.size}px`,
                animationDelay: `${config.delay}ms`,
                ...config
            });

            container.appendChild(shape);
            this.shapes.push(shape);
        });
    }

    startShapeAnimation() {
        this.shapes.forEach(shape => {
            shape.addEventListener('animationiteration', () => {
                // Randomize animation duration for more organic movement
                const newDuration = 15 + Math.random() * 10;
                shape.style.animationDuration = `${newDuration}s`;
            });
        });
    }
}

// Initialize particle systems when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Create main particle system
    const particleContainer = document.querySelector('.floating-particles');
    if (particleContainer) {
        window.particleSystem = new ParticleSystem(particleContainer, {
            particleCount: 25,
            particleSize: 4,
            particleColor: 'rgba(0, 245, 255, 0.6)',
            animationDuration: 15,
            spawnRate: 2500
        });
    }

    // Initialize orb effect system
    window.orbEffects = new OrbEffectSystem();

    // Initialize background animations
    window.backgroundController = new BackgroundAnimationController();

    // Add CSS for particle and effect animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes collectEffect {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(2);
                opacity: 0.8;
            }
            100% {
                transform: scale(3);
                opacity: 0;
            }
        }

        @keyframes sparkleEffect {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(var(--end-x, 0), var(--end-y, 0)) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add interactive orb click effects
    document.addEventListener('click', (e) => {
        const isOrb = e.target.classList.contains('orb-animation');
        if (isOrb && window.orbEffects) {
            const rect = e.target.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            window.orbEffects.createCollectionEffect(x, y, document.body);
            
            // Add collection sound effect (if audio is enabled)
            if (window.audioEnabled) {
                playCollectionSound();
            }
        }
    });
});

// Audio system (optional)
function playCollectionSound() {
    // Create a simple beep using Web Audio API
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const AudioCtx = AudioContext || webkitAudioContext;
        const audioCtx = new AudioCtx();
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
    }
}

// Performance optimization: Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    const particles = document.querySelectorAll('.particle');
    const shapes = document.querySelectorAll('.bg-shape');
    
    if (document.hidden) {
        particles.forEach(p => p.style.animationPlayState = 'paused');
        shapes.forEach(s => s.style.animationPlayState = 'paused');
    } else {
        particles.forEach(p => p.style.animationPlayState = 'running');
        shapes.forEach(s => s.style.animationPlayState = 'running');
    }
});