/**
 * KAISEI // SAKURA & PARTICLE SYSTEM
 * Realistic 2.5D falling cherry blossoms and elemental motes with physics & mouse vortex
 */

class SakuraParticleEngine {
    constructor(canvasId = 'sakura-canvas') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.petals = [];
        this.maxPetals = 45;
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.targetWind = 0.8;
        this.currentWind = 0.8;
        this.elementMode = 'sakura'; // 'sakura', 'cyber', 'solar', 'void'
        this.isRunning = true;
        this.animId = null;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
            }
        }, { passive: true });

        // Populate initial petals across viewport
        for (let i = 0; i < this.maxPetals; i++) {
            this.petals.push(this.createPetal(true));
        }

        this.animate();
    }

    resize() {
        if (!this.canvas) return;
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        // Adjust petal count for mobile vs desktop
        this.maxPetals = window.innerWidth < 768 ? 22 : 48;
    }

    createPetal(randomY = false) {
        const size = Math.random() * 10 + 8;
        return {
            x: Math.random() * this.width,
            y: randomY ? Math.random() * this.height : -size * 2,
            z: Math.random() * 1.5 + 0.5, // Depth scaling
            size: size,
            speedY: Math.random() * 1.2 + 0.9,
            speedX: Math.random() * 0.8 - 0.4,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.03,
            flip: Math.random() * Math.PI,
            flipSpeed: Math.random() * 0.03 + 0.015,
            phase: Math.random() * Math.PI * 2,
            phaseSpeed: Math.random() * 0.02 + 0.01,
            colorVariant: Math.random()
        };
    }

    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        // Gust effect based on cursor speed
        const centerOffset = (e.clientX - this.width / 2) / (this.width / 2);
        this.targetWind = 0.8 + centerOffset * 1.5;
    }

    setElementMode(mode) {
        this.elementMode = mode;
    }

    getColors(petal) {
        switch (this.elementMode) {
            case 'cyber':
                return {
                    fill: petal.colorVariant > 0.5 ? 'rgba(0, 240, 255, 0.7)' : 'rgba(112, 0, 255, 0.7)',
                    shadow: 'rgba(0, 240, 255, 0.9)',
                    isMote: true
                };
            case 'solar':
                return {
                    fill: petal.colorVariant > 0.5 ? 'rgba(255, 150, 0, 0.75)' : 'rgba(255, 60, 20, 0.75)',
                    shadow: 'rgba(255, 180, 50, 0.9)',
                    isMote: petal.colorVariant > 0.4
                };
            case 'void':
                return {
                    fill: petal.colorVariant > 0.5 ? 'rgba(181, 55, 242, 0.75)' : 'rgba(121, 40, 202, 0.7)',
                    shadow: 'rgba(224, 170, 255, 0.85)',
                    isMote: false
                };
            case 'sakura':
            default:
                return {
                    fill: petal.colorVariant > 0.5 ? 'rgba(255, 183, 197, 0.78)' : 'rgba(255, 140, 175, 0.82)',
                    shadow: 'rgba(255, 200, 220, 0.5)',
                    isMote: false
                };
        }
    }

    drawPetal(petal) {
        const { fill, shadow, isMote } = this.getColors(petal);
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.rotation);
        const scaleX = Math.cos(petal.flip) * petal.z;
        const scaleY = petal.z;
        ctx.scale(scaleX, scaleY);

        ctx.shadowColor = shadow;
        ctx.shadowBlur = 8 * petal.z;
        ctx.fillStyle = fill;

        if (isMote) {
            // Cyber diamond or ember shard
            ctx.beginPath();
            ctx.moveTo(0, -petal.size);
            ctx.lineTo(petal.size * 0.6, 0);
            ctx.lineTo(0, petal.size);
            ctx.lineTo(-petal.size * 0.6, 0);
            ctx.closePath();
            ctx.fill();
        } else {
            // Organic Sakura Petal Curve (heart / drop notch)
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(
                petal.size * 0.8, -petal.size * 0.4,
                petal.size * 1.2, petal.size * 0.8,
                0, petal.size * 1.6
            );
            ctx.bezierCurveTo(
                -petal.size * 1.2, petal.size * 0.8,
                -petal.size * 0.8, -petal.size * 0.4,
                0, 0
            );
            ctx.fill();
        }

        ctx.restore();
    }

    update() {
        // Smooth wind transition
        this.currentWind += (this.targetWind - this.currentWind) * 0.05;

        for (let i = 0; i < this.petals.length; i++) {
            const p = this.petals[i];

            // Sway dynamics
            p.phase += p.phaseSpeed;
            const sway = Math.sin(p.phase) * 1.2;

            // Base velocity
            let vx = (this.currentWind + sway + p.speedX) * p.z;
            let vy = (p.speedY) * p.z;

            // In solar mode, some motes drift upward like embers
            if (this.elementMode === 'solar' && p.colorVariant > 0.6) {
                vy = -vy * 0.8;
            }

            // Mouse proximity vortex/push
            const dx = p.x - this.mouseX;
            const dy = p.y - this.mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repelRadius = 140;

            if (dist < repelRadius && dist > 1) {
                const force = (1 - dist / repelRadius) * 4;
                p.x += (dx / dist) * force;
                p.y += (dy / dist) * force;
                p.rotation += 0.05;
            }

            p.x += vx;
            p.y += vy;
            p.rotation += p.rotSpeed;
            p.flip += p.flipSpeed;

            // Wrap around boundaries
            if (p.y > this.height + 40 || p.x > this.width + 40 || p.x < -40 || p.y < -40) {
                this.petals[i] = this.createPetal(false);
            }
        }
    }

    animate() {
        if (!this.isRunning) return;
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.petals.length; i++) {
            this.drawPetal(this.petals[i]);
        }

        this.update();
        this.animId = requestAnimationFrame(() => this.animate());
    }

    burst(x, y, count = 20) {
        // Burst of petals when user triggers an ability
        for (let i = 0; i < count; i++) {
            const p = this.createPetal(false);
            p.x = x || this.width / 2;
            p.y = y || this.height / 2;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 3;
            p.speedX = Math.cos(angle) * speed;
            p.speedY = Math.sin(angle) * speed;
            p.flipSpeed *= 2;
            this.petals.push(p);
        }

        // Trim excess
        if (this.petals.length > this.maxPetals * 2) {
            this.petals.splice(0, count);
        }
    }
}

// Global initialization helper
window.SakuraEngine = SakuraParticleEngine;
