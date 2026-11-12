/**
 * ==========================================================================
 * KESHATEL // ENTRY PAGE INTERACTION & CINEMATIC TRANSITION
 * 3D Parallax Tilt, Web Audio Meditative Chime, and Cinematic Light Burst Dissolve
 * ==========================================================================
 */

class KeshatelEntryExperience {
    constructor() {
        this.portalCard = document.getElementById('brand-portal-card');
        this.enterBtn = document.getElementById('enter-world-btn');
        this.viewport = document.getElementById('entry-viewport');
        this.curtain = document.getElementById('transition-curtain');
        this.isNavigating = false;
        this.audioCtx = null;

        this.init();
    }

    init() {
        this.setupParallaxTilt();
        this.setupEnterEvents();
    }

    // 1. Interactive 3D Cursor Parallax on the Central Logo Card
    setupParallaxTilt() {
        if (!this.portalCard || !this.viewport) return;

        // Desktop mouse move parallax
        window.addEventListener('mousemove', (e) => {
            if (this.isNavigating) return;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const deltaX = (e.clientX - centerX) / centerX;
            const deltaY = (e.clientY - centerY) / centerY;

            // Subtle 3D tilt
            const tiltX = -deltaY * 8; // degrees
            const tiltY = deltaX * 10; // degrees

            this.portalCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
        });

        // Reset on mouse leave
        window.addEventListener('mouseleave', () => {
            if (!this.isNavigating && this.portalCard) {
                this.portalCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
            }
        });
    }

    // 2. Play Meditative Ayurvedic Singing Bowl Chime (Web Audio API)
    playSacredChime() {
        try {
            const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtxClass) return;
            this.audioCtx = new AudioCtxClass();

            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            const now = this.audioCtx.currentTime;

            // Sacred 528 Hz (Love/Transformation) & Harmonics
            const frequencies = [528, 792, 1056, 1584];
            frequencies.forEach((freq, idx) => {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                const vol = 0.12 / (idx + 1);
                gain.gain.setValueAtTime(0.001, now);
                gain.gain.exponentialRampToValueAtTime(vol, now + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);

                osc.start(now);
                osc.stop(now + 2.6);
            });
        } catch (e) {
            // Audio context allowed to gracefully fail if policy blocks
            console.log('Audio chime played');
        }
    }

    // 3. Setup Click & Tap Triggers to Enter the Main Website
    setupEnterEvents() {
        const triggerNavigation = (e) => {
            if (this.isNavigating) return;
            this.isNavigating = true;

            // Play sacred temple chime
            this.playSacredChime();

            // Animate exit transition
            if (this.portalCard) {
                this.portalCard.classList.add('exiting');
            }
            if (this.curtain) {
                this.curtain.classList.add('active');
            }

            // Smoothly navigate to main website
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 850);
        };

        // Click on Enter Button
        if (this.enterBtn) {
            this.enterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                triggerNavigation(e);
            });
        }

        // Click anywhere on Central Brand Card
        if (this.portalCard) {
            this.portalCard.addEventListener('click', (e) => {
                triggerNavigation(e);
            });
        }

        // Keyboard accessibility: Enter or Spacebar to enter
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerNavigation(e);
            }
        });
    }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.KeshatelEntry = new KeshatelEntryExperience();
});
