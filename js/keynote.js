// Keynote presentation controller
class KeynotePresentation {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        this.progressBar = document.getElementById('progressBar');
        this.slideCounter = document.getElementById('slideCounter');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSlide();
        this.addCollectOrbAnimation();
    }

    setupEventListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    this.changeSlide(-1);
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.changeSlide(1);
                    break;
                case 'Home':
                    this.goToSlide(0);
                    break;
                case 'End':
                    this.goToSlide(this.totalSlides - 1);
                    break;
                case 'n':
                case 'N':
                    this.toggleSpeakerNotes();
                    break;
                case 'f':
                case 'F':
                    this.toggleFullscreen();
                    break;
            }
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        // Button navigation
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.changeSlide(-1));
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.changeSlide(1));
        }
        
        const toggleNotesBtn = document.getElementById('toggleNotes');
        if (toggleNotesBtn) {
            toggleNotesBtn.addEventListener('click', () => this.toggleSpeakerNotes());
        }

        // Handle swipe
        this.handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.changeSlide(1); // Swipe left - next slide
                } else {
                    this.changeSlide(-1); // Swipe right - previous slide
                }
            }
        };
    }

    updateSlide() {
        // Hide all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        
        // Show current slide
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('active');
        }
        
        // Update progress bar
        if (this.progressBar) {
            const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
            this.progressBar.style.width = progress + '%';
        }
        
        // Update slide counter
        if (this.slideCounter) {
            this.slideCounter.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
        }
        
        // Update navigation buttons
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        }

        // Trigger slide-specific animations
        this.triggerSlideAnimations();
    }

    changeSlide(direction) {
        const newSlide = this.currentSlide + direction;
        if (newSlide >= 0 && newSlide < this.totalSlides) {
            this.currentSlide = newSlide;
            this.updateSlide();
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber >= 0 && slideNumber < this.totalSlides) {
            this.currentSlide = slideNumber;
            this.updateSlide();
        }
    }

    toggleSpeakerNotes() {
        document.body.classList.toggle('show-notes');
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    triggerSlideAnimations() {
        const currentSlideElement = this.slides[this.currentSlide];
        
        if (!currentSlideElement) return;

        // Reset animations
        const animatedElements = currentSlideElement.querySelectorAll('.visual-card, .workflow-step, .problem-card, .solution-card');
        animatedElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.2}s`;
        });

        // Special animations for specific slides
        this.handleSpecialSlideAnimations();
    }

    handleSpecialSlideAnimations() {
        const slideIndex = this.currentSlide;
        
        switch(slideIndex) {
            case 0: // Title slide
                this.animateTitleSlide();
                break;
            case 1: // Workflow slide
                this.animateWorkflowDiagram();
                break;
            case 4: // Planning slide
                this.animateGamePreview();
                break;
            case 12: // Feedback slide
                this.animateOrbCollection();
                break;
        }
    }

    animateTitleSlide() {
        const orbs = document.querySelectorAll('.title-slide .orb-animation');
        orbs.forEach((orb, index) => {
            setTimeout(() => {
                orb.style.animation = 'float 3s ease-in-out infinite';
                orb.style.animationDelay = `${index * 0.5}s`;
            }, 1000);
        });
    }

    animateWorkflowDiagram() {
        const steps = document.querySelectorAll('.workflow-step');
        steps.forEach((step, index) => {
            setTimeout(() => {
                step.style.animation = 'pulse 2s ease-in-out infinite';
                step.style.animationDelay = `${index * 0.3}s`;
            }, 500);
        });
    }

    animateGamePreview() {
        const player = document.querySelector('.player-character');
        if (player) {
            setTimeout(() => {
                player.style.animation = 'playerMove 4s ease-in-out infinite';
            }, 1000);
        }
    }

    animateOrbCollection() {
        const orbs = document.querySelectorAll('.orb-animation');
        orbs.forEach((orb, index) => {
            setTimeout(() => {
                orb.style.animation = 'collectOrb 2s ease-in-out infinite';
            }, index * 500);
        });
    }

    addCollectOrbAnimation() {
        // Add CSS for collect orb animation if not already present
        if (!document.head.querySelector('style[data-orb-animation]')) {
            const style = document.createElement('style');
            style.setAttribute('data-orb-animation', 'true');
            style.textContent = `
                @keyframes collectOrbDynamic {
                    0% { transform: scale(1) translateY(0); opacity: 1; }
                    50% { transform: scale(1.2) translateY(-10px); opacity: 0.8; }
                    100% { transform: scale(0.8) translateY(-20px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Auto-advance functionality (optional)
    startAutoAdvance(seconds = 60) {
        this.autoAdvanceTimer = setInterval(() => {
            if (this.currentSlide < this.totalSlides - 1) {
                this.changeSlide(1);
            } else {
                this.stopAutoAdvance();
            }
        }, seconds * 1000);
    }

    stopAutoAdvance() {
        if (this.autoAdvanceTimer) {
            clearInterval(this.autoAdvanceTimer);
            this.autoAdvanceTimer = null;
        }
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.keynote = new KeynotePresentation();
    
    // Add keyboard shortcut hints
    const hint = document.querySelector('.keyboard-hint');
    if (hint) {
        hint.innerHTML = 'Use arrow keys • Spacebar • Press N for notes • F for fullscreen';
    }
    
    // Performance optimization: Preload next slide images
    const preloadNextSlide = debounce(() => {
        const nextSlide = window.keynote.currentSlide + 1;
        if (nextSlide < window.keynote.totalSlides) {
            const nextSlideElement = window.keynote.slides[nextSlide];
            const images = nextSlideElement.querySelectorAll('img');
            images.forEach(img => {
                const preloadImg = new Image();
                preloadImg.src = img.src;
            });
        }
    }, 500);
    
    // Trigger preload on slide changes
    document.addEventListener('keydown', preloadNextSlide);
});